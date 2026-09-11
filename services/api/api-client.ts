import Constants from 'expo-constants';
import { Platform } from 'react-native';

const LOCAL_WIFI_IP = '192.168.8.166';

const isVirtualAdapterIp = (ip: string): boolean => {
  if (!ip || ip === 'localhost' || ip === '127.0.0.1') return true;
  if (ip.startsWith('192.168.48.')) return true;
  if (ip.startsWith('172.') && !ip.startsWith('172.20.')) return true;
  return false;
};

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && !isVirtualAdapterIp(ip)) {
      return 'http://' + ip + ':3001';
    }
  }
  return 'http://' + LOCAL_WIFI_IP + ':3001';
};

export const API_BASE_URL = getBaseUrl();

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private getCandidateUrls(endpoint: string): string[] {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    const urls: string[] = [];

    // 1. Port 3001 (API Gateway primary - localhost & loopback first)
    urls.push('http://localhost:3001' + cleanEndpoint);
    urls.push('http://127.0.0.1:3001' + cleanEndpoint);
    urls.push('http://' + LOCAL_WIFI_IP + ':3001' + cleanEndpoint);

    if (process.env.EXPO_PUBLIC_API_URL) {
      urls.push(process.env.EXPO_PUBLIC_API_URL + cleanEndpoint);
    }

    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && !isVirtualAdapterIp(ip)) {
        urls.push('http://' + ip + ':3001' + cleanEndpoint);
        urls.push('http://' + ip + ':3000' + cleanEndpoint);
      }
    }

    if (Platform.OS === 'android') {
      urls.push('http://10.0.2.2:3001' + cleanEndpoint);
      urls.push('http://10.0.2.2:3000' + cleanEndpoint);
    }

    // 2. Port 3000 fallback
    urls.push('http://localhost:3000' + cleanEndpoint);
    urls.push('http://127.0.0.1:3000' + cleanEndpoint);
    urls.push('http://' + LOCAL_WIFI_IP + ':3000' + cleanEndpoint);

    return Array.from(new Set(urls));
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const candidateUrls = this.getCandidateUrls(endpoint);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = 'Bearer ' + this.token;
    }

    let lastError: any = null;

    for (const url of candidateUrls) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const urlObj = new URL(url);
        this.baseUrl = urlObj.origin;

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          const serverErr = new Error(errorData.message || 'API Error: ' + response.status);
          (serverErr as any).isServerError = true;
          throw serverErr;
        }

        return await response.json();
      } catch (error: any) {
        clearTimeout(timeoutId);
        lastError = error;
        if (error && error.isServerError) {
          throw error;
        }
      }
    }

    console.warn('[ApiClient] Connection attempt failed for ' + endpoint + ':', lastError?.message || lastError);
    throw lastError || new Error('Unable to connect to backend service.');
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

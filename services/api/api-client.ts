import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  // First prefer dynamic Metro debugger host IP if running via Expo Go / Metro
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return 'http://' + ip + ':3001';
    }
  }
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
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

    // 1. Current resolved base URL
    urls.push(this.baseUrl + cleanEndpoint);

    // 2. Dynamic host URI from Metro if available
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip) {
        const u = 'http://' + ip + ':3001' + cleanEndpoint;
        if (!urls.includes(u)) urls.push(u);
      }
    }

    // 3. Current local Wi-Fi IP
    const wifiIpUrl = 'http://192.168.1.45:3001' + cleanEndpoint;
    if (!urls.includes(wifiIpUrl)) urls.push(wifiIpUrl);

    // 4. Android emulator fallback
    if (Platform.OS === 'android') {
      const androidUrl = 'http://10.0.2.2:3001' + cleanEndpoint;
      if (!urls.includes(androidUrl)) urls.push(androidUrl);
    }

    // 5. Localhost fallback
    const localhostUrl = 'http://localhost:3001' + cleanEndpoint;
    if (!urls.includes(localhostUrl)) urls.push(localhostUrl);

    return urls;
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
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || 'API Error: ' + response.status);
        }

        // Successfully connected to backend, update baseUrl for subsequent calls
        const urlObj = new URL(url);
        this.baseUrl = urlObj.origin;
        return await response.json();
      } catch (error: any) {
        clearTimeout(timeoutId);
        lastError = error;
        // Continue loop to try next candidate URL
      }
    }

    console.warn('[ApiClient] All candidate URLs failed for endpoint ' + endpoint + ':', lastError?.message || lastError);
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

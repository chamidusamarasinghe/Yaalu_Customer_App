import { apiClient } from './api-client';

export interface UserProfile {
  id?: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  nicNumber?: string;
  city?: string;
  profilePicture?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
}

export interface RegisterUserPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  nicNumber?: string;
  city?: string;
  profilePicture?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: UserProfile;
  accessToken?: string;
  access_token?: string;
  message?: string;
}

class AuthService {
  private currentUser: UserProfile = {};
  private token: string | null = null;

  async register(payload: RegisterUserPayload): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>('/auth/register', payload);
    if (data.accessToken || data.access_token) {
      this.token = data.accessToken || data.access_token || null;
    }
    if (data.user) {
      this.currentUser = data.user;
    }
    return data;
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>('/auth/login', payload);
    if (data.accessToken || data.access_token) {
      this.token = data.accessToken || data.access_token || null;
    }
    if (data.user) {
      this.currentUser = data.user;
    }
    return data;
  }

  async updateProfile(payload: Partial<UserProfile>): Promise<{ user?: UserProfile }> {
    const mergedPayload = {
      ...payload,
      id: payload.id || this.currentUser?.id,
      email: payload.email || this.currentUser?.email,
    };
    const data = await apiClient.patch<{ user?: UserProfile }>('/auth/profile', mergedPayload);
    if (data.user) {
      this.currentUser = { ...this.currentUser, ...data.user };
    }
    return data;
  }

  async sendOtp(payload: { phoneNumber?: string; email?: string }): Promise<{ success: boolean; message: string; otp?: string }> {
    return apiClient.post('/auth/send-otp', payload);
  }

  async verifyOtp(payload: { target: string; code: string }): Promise<{ verified: boolean; message: string }> {
    return apiClient.post('/auth/verify-otp', payload);
  }

  getCurrentUser(): UserProfile {
    return this.currentUser || {};
  }

  getUser(): UserProfile {
    return this.currentUser || {};
  }

  setCurrentUser(user: UserProfile | null) {
    this.currentUser = user || {};
  }

  getToken(): string | null {
    return this.token;
  }

  logout() {
    this.currentUser = {};
    this.token = null;
  }
}

export const authService = new AuthService();

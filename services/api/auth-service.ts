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

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken?: string;
  user: UserProfile;
}

let currentUserSession: UserProfile = {};

export const authService = {
  getCurrentUser(): UserProfile {
    return currentUserSession;
  },

  setCurrentUser(user: UserProfile) {
    currentUserSession = { ...currentUserSession, ...user };
  },

  async register(payload: RegisterUserPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', payload);
      if (response.user) {
        this.setCurrentUser(response.user);
      }
      if (response.accessToken) {
        apiClient.setToken(response.accessToken);
      }
      return response;
    } catch (error: any) {
      console.warn('[authService] Registration failed:', error.message || error);
      throw error;
    }
  },

  async login(payload: LoginUserPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', payload);
      if (response.user) {
        this.setCurrentUser(response.user);
      }
      if (response.accessToken) {
        apiClient.setToken(response.accessToken);
      }
      return response;
    } catch (error: any) {
      console.warn('[authService] Login failed:', error.message || error);
      throw error;
    }
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.patch<{ user: UserProfile }>('/auth/profile', payload);
      if (response.user) {
        this.setCurrentUser(response.user);
        return response.user;
      }
      this.setCurrentUser(payload);
      return this.getCurrentUser();
    } catch (error: any) {
      console.warn('[authService] Profile update note:', error.message || error);
      this.setCurrentUser(payload);
      return this.getCurrentUser();
    }
  },

  logout() {
    currentUserSession = {};
    apiClient.setToken(null);
  },
};

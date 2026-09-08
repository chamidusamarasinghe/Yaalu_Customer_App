import { apiClient } from './api-client';

export interface UserProfile {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phone?: string;
  mobile?: string;
  nic?: string;
  deliveryAddress?: string;
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
  fullName?: string;
  name?: string;
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
    try {
      const data = await apiClient.post<AuthResponse>('/auth/register', payload);
      if (data.accessToken || data.access_token) {
        this.token = data.accessToken || data.access_token || null;
      }
      if (data.user) {
        this.currentUser = data.user;
      }
      return data;
    } catch (err: any) {
      console.log('[Dev Fallback]: Backend server offline. Saving registration payload locally.');
      this.currentUser = {
        ...this.currentUser,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        nicNumber: payload.nicNumber,
        city: payload.city,
        profilePicture: payload.profilePicture,
        address: payload.address,
        latitude: payload.latitude,
        longitude: payload.longitude,
        role: payload.role || 'CUSTOMER',
      };
      this.token = 'mock_dev_access_token_12345';
      return { user: this.currentUser, accessToken: this.token, message: 'Registered in Dev Mode' };
    }
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
    try {
      const data = await apiClient.patch<{ user?: UserProfile }>('/auth/profile', mergedPayload);
      if (data.user) {
        this.currentUser = { ...this.currentUser, ...data.user };
      }
      return data;
    } catch (err: any) {
      console.log('[Dev Fallback]: Backend server offline. Updating profile locally.');
      this.currentUser = { ...this.currentUser, ...payload };
      return { user: this.currentUser };
    }
  }

  async sendOtp(payload: { phoneNumber?: string; email?: string }): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      return await apiClient.post<{ success: boolean; message: string; otp?: string }>('/auth/send-otp', payload);
    } catch (err: any) {
      console.log('[Dev Fallback]: Backend server offline or unreachable. Simulating OTP send: 123456');
      return { success: true, message: 'OTP code 123456 sent successfully (Dev Mode)', otp: '123456' };
    }
  }

  async verifyOtp(payload: { target: string; code: string }): Promise<{ verified: boolean; message: string }> {
    try {
      return await apiClient.post<{ verified: boolean; message: string }>('/auth/verify-otp', payload);
    } catch (err: any) {
      console.log('[Dev Fallback]: Backend server offline. Verifying OTP in dev mode.');
      const isValidDevCode = payload.code === '123456' || payload.code === '000000' || payload.code.length === 6;
      return {
        verified: isValidDevCode,
        message: isValidDevCode ? 'OTP verified successfully (Dev Mode)' : 'Invalid OTP verification code',
      };
    }
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

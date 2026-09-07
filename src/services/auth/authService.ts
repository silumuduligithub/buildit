import apiRequest from '../api/apiRequest';
import { setAuthTokens, setAuthUserData, clearAuthSession } from '../api/apiClient';

export interface LoginPayload {
  identifier: string;
  password?: string;
  role?: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  role?: 'customer' | 'retailer' | 'driver';
  customer_type?: 'individual' | 'contractor' | 'builder';
  company_name?: string;
  gst_number?: string;
  store_name?: string;
  license_number?: string;
}

export interface OtpPayload {
  phone: string;
  otp: string;
  role?: string;
  customer_type?: string;
}

export const authService = {
  /**
   * Universal Login
   */
  login: async (payload: LoginPayload) => {
    const res = await apiRequest({
      url: '/auth/login',
      method: 'POST',
      body: payload,
      skipAuth: true,
    });

    if (res.data?.tokens) {
      await setAuthTokens(res.data.tokens.access_token, res.data.tokens.refresh_token);
    }
    if (res.data?.user) {
      await setAuthUserData(res.data.user);
    }
    return res;
  },

  /**
   * Send OTP to mobile
   */
  sendOtp: async (phone: string) => {
    return apiRequest({
      url: '/auth/send-otp',
      method: 'POST',
      body: { phone },
      skipAuth: true,
    });
  },

  /**
   * Verify OTP and instant login
   */
  verifyOtp: async (payload: OtpPayload) => {
    const res = await apiRequest({
      url: '/auth/verify-otp',
      method: 'POST',
      body: payload,
      skipAuth: true,
    });

    if (res.data?.tokens) {
      await setAuthTokens(res.data.tokens.access_token, res.data.tokens.refresh_token);
    }
    if (res.data?.user) {
      await setAuthUserData(res.data.user);
    }
    return res;
  },

  /**
   * Register new user
   */
  register: async (payload: RegisterPayload) => {
    const res = await apiRequest({
      url: '/auth/register',
      method: 'POST',
      body: payload,
      skipAuth: true,
    });

    if (res.data?.tokens) {
      await setAuthTokens(res.data.tokens.access_token, res.data.tokens.refresh_token);
    }
    if (res.data?.user) {
      await setAuthUserData(res.data.user);
    }
    return res;
  },

  /**
   * Get Current Authenticated User & Role Profile
   */
  getMe: async () => {
    const res = await apiRequest({
      url: '/auth/me',
      method: 'GET',
    });

    if (res.data?.user) {
      await setAuthUserData(res.data.user);
    }
    return res;
  },

  /**
   * Logout user session
   */
  logout: async () => {
    try {
      await apiRequest({
        url: '/auth/logout',
        method: 'POST',
      });
    } catch {
      // Continue with client side logout even if server request fails
    } finally {
      await clearAuthSession();
    }
  },

  /**
   * Change user password
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest({
      url: '/auth/change-password',
      method: 'POST',
      body: {
        current_password: currentPassword,
        new_password: newPassword,
      },
    });
  },
};

export default authService;

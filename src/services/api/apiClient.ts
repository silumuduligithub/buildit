import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_CONFIG } from '../../config/api.config';
import { showFlashMessage } from '../../components/ui/FlashMessage';

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: '@buildkart_access_token',
  REFRESH_TOKEN: '@buildkart_refresh_token',
  USER_DATA: '@buildkart_user_data',
  CURRENT_ROLE: '@buildkart_current_role',
};

export interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  skipAuth?: boolean;
  skipLoader?: boolean;
  loadingMessage?: string;
}

export interface ApiResponseWrapper<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiError extends Error {
  statusCode: number;
  errors?: any;
  data?: any;

  constructor(message: string, statusCode: number = 500, errors?: any, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = data;
  }
}

// ── Global API Loading Event Emitter ──────────────────────
export type ApiLoadingListener = (isLoading: boolean, activeCount: number, message?: string) => void;
let activeRequestCount = 0;
const loadingListeners: Set<ApiLoadingListener> = new Set();

export const subscribeToApiLoading = (listener: ApiLoadingListener) => {
  loadingListeners.add(listener);
  return () => {
    loadingListeners.delete(listener);
  };
};

export const notifyApiLoadingStart = (message?: string) => {
  activeRequestCount++;
  loadingListeners.forEach((fn) => fn(true, activeRequestCount, message));
};

export const notifyApiLoadingEnd = () => {
  activeRequestCount = Math.max(0, activeRequestCount - 1);
  loadingListeners.forEach((fn) => fn(activeRequestCount > 0, activeRequestCount));
};

// In-memory token cache for high-performance synchronous access
let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

export const setAuthTokens = async (accessToken: string | null, refreshToken: string | null) => {
  inMemoryAccessToken = accessToken;
  inMemoryRefreshToken = refreshToken;
  console.log(`🔑 [AUTH] setAuthTokens -> AccessToken: ${!!accessToken}, RefreshToken: ${!!refreshToken}`);

  try {
    if (accessToken) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    }

    if (refreshToken) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    }
  } catch (err) {
    // Non-fatal fallback to in-memory tokens
  }
};

export const getStoredAccessToken = async (): Promise<string | null> => {
  if (inMemoryAccessToken) return inMemoryAccessToken;
  try {
    const token = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    inMemoryAccessToken = token;
    return token;
  } catch {
    return null;
  }
};

export const getStoredRefreshToken = async (): Promise<string | null> => {
  if (inMemoryRefreshToken) return inMemoryRefreshToken;
  try {
    const token = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    inMemoryRefreshToken = token;
    return token;
  } catch {
    return null;
  }
};

export const setAuthUserData = async (userData: any) => {
  try {
    if (userData) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
    }
  } catch {
    // Ignore error
  }
};

export const getStoredUserData = async (): Promise<any | null> => {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearAuthSession = async () => {
  console.log('🚪 [AUTH] clearAuthSession called');
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
  try {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA),
    ]);
  } catch {
    // Ignore error
  }
};

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback);
};

const attemptTokenRefresh = async (): Promise<string | null> => {
  const refreshToken = await getStoredRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const refreshUrl = `${API_BASE_URL}/auth/refresh`;
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const resJson = await response.json();
    if (response.ok && resJson?.data?.tokens?.access_token) {
      const newAccessToken = resJson.data.tokens.access_token;
      const newRefreshToken = resJson.data.tokens.refresh_token || refreshToken;
      await setAuthTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } else if (response.status === 401 || response.status === 403) {
      // Clear session only if refresh token was explicitly rejected by the backend server
      await clearAuthSession();
      return null;
    } else {
      return null;
    }
  } catch (error) {
    // Do NOT wipe auth tokens on network failure or timeout
    return null;
  }
};

const buildQueryString = (params?: Record<string, any>): string => {
  if (!params) return '';
  const queryParts: string[] = [];
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      if (Array.isArray(val)) {
        val.forEach((item) => queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`));
      } else {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
      }
    }
  }
  return queryParts.length ? `?${queryParts.join('&')}` : '';
};

/**
 * Production-ready Core API Client
 */
export async function executeApiRequest<T = any>(
  options: RequestOptions,
  isRetry: boolean = false
): Promise<ApiResponseWrapper<T>> {
  const {
    url,
    method = 'GET',
    body,
    params,
    headers = {},
    timeout = API_CONFIG.TIMEOUT_MS,
    skipAuth = false,
    skipLoader = false,
    loadingMessage,
  } = options;

  if (!skipLoader && !isRetry) {
    notifyApiLoadingStart(loadingMessage);
  }

  // Resolve full target URL
  const cleanUrl = url.startsWith('http')
    ? url
    : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

  const queryString = buildQueryString(params);
  const finalUrl = `${cleanUrl}${queryString}`;

  // Request Headers
  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  // Determine Body Type
  let requestBody: any = undefined;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (body !== undefined && body !== null) {
    if (isFormData) {
      requestBody = body;
      // Let fetch calculate correct multipart boundary
      delete requestHeaders['Content-Type'];
    } else if (typeof body === 'object') {
      if (!requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = 'application/json';
      }
      requestBody = JSON.stringify(body);
    } else {
      requestBody = String(body);
    }
  }

  // Attach Authorization Header
  if (!skipAuth) {
    const token = await getStoredAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Abort Controller for Request Timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(finalUrl, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse JSON Response
    let responseData: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }
    }

    // Handle 401 Unauthorized with single-retry token refresh
    if (response.status === 401 && !isRetry && !skipAuth && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await attemptTokenRefresh();
        isRefreshing = false;
        onRefreshed(newToken);

        if (newToken) {
          return executeApiRequest<T>(options, true);
        }
      } else {
        // Wait for active refresh to complete
        const retryPromise = new Promise<ApiResponseWrapper<T>>((resolve, reject) => {
          addRefreshSubscriber((newToken) => {
            if (newToken) {
              executeApiRequest<T>(options, true).then(resolve).catch(reject);
            } else {
              reject(new ApiError('Session expired. Please log in again.', 401));
            }
          });
        });
        return retryPromise;
      }
    }

    // Check HTTP status code
    if (!response.ok) {
      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, responseData?.errors, responseData);
    }

    // Standard Backend Response normalization: { success: true, statusCode: 200, data: ..., message: ... }
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return {
        success: responseData.success ?? true,
        statusCode: responseData.statusCode ?? response.status,
        message: responseData.message,
        data: responseData.data as T,
        pagination: responseData.pagination,
      };
    }

    return {
      success: true,
      statusCode: response.status,
      data: responseData as T,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error?.name === 'AbortError') {
      showFlashMessage({
        type: 'error',
        message: 'Request Timed Out',
        description: 'Network is slow or unreachable. Please check connection.',
      });
      throw new ApiError('Request timed out. Please check your connection.', 408);
    }

    if (error instanceof ApiError) {
      if (error.statusCode === 0) {
        showFlashMessage({
          type: 'error',
          message: 'Network is offline',
          description: 'Please check your internet connection.',
        });
      }
      throw error;
    }

    showFlashMessage({
      type: 'error',
      message: 'Network is offline',
      description: 'Unable to connect to server. Please verify your connection.',
    });

    throw new ApiError(
      error?.message || 'Network request failed. Please verify the backend server is running.',
      0
    );
  } finally {
    if (!skipLoader && !isRetry) {
      notifyApiLoadingEnd();
    }
  }
}

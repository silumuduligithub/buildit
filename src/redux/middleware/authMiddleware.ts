import { Middleware, isAnyOf } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_STORAGE_KEYS } from '../../services/api/apiClient';
import { logoutThunk, loginThunk, verifyOtpThunk, setCurrentRole } from '../slices/authSlice';
import { clearCartOptimistic } from '../slices/cartSlice';

/**
 * Auth Middleware
 * Intercepts auth actions to handle role storage, token cleanup, and session state reset.
 */
export const authMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  // 1. When user logs out, purge cached session items from local storage and clear cart
  if (logoutThunk.fulfilled.match(action)) {
    store.dispatch(clearCartOptimistic());
    Promise.all([
      AsyncStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA),
      AsyncStorage.removeItem('buildkart_cart_cache'),
    ]).catch(() => {});
  }

  // 2. When login or OTP verification succeeds, persist role to AsyncStorage
  if (isAnyOf(loginThunk.fulfilled, verifyOtpThunk.fulfilled)(action)) {
    const role = action.payload?.role;
    if (role) {
      AsyncStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_ROLE, role).catch(() => {});
    }
  }

  // 3. When role changes explicitly
  if (setCurrentRole.match(action)) {
    AsyncStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_ROLE, action.payload).catch(() => {});
  }

  return result;
};

export default authMiddleware;

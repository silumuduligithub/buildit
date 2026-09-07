import { Middleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_CACHE_KEY = 'buildkart_cart_cache';
const ADDRESSES_CACHE_KEY = 'buildkart_addresses_cache';

let debounceCartTimer: any = null;
let debounceAddressTimer: any = null;

/**
 * Persistence Middleware
 * Automatically synchronizes offline cart items and address book state to local AsyncStorage.
 */
export const persistenceMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);
  const actionType: string = action?.type || '';

  // 1. Sync Cart on any cart modification
  if (actionType.startsWith('cart/')) {
    if (debounceCartTimer) clearTimeout(debounceCartTimer);
    debounceCartTimer = setTimeout(() => {
      try {
        const state: any = store.getState();
        if (state.cart?.items) {
          AsyncStorage.setItem(CART_CACHE_KEY, JSON.stringify(state.cart.items)).catch(() => {});
        }
      } catch {
        // Ignore serialization errors
      }
    }, 400);
  }

  // 2. Sync Saved Addresses on any user address modification
  if (actionType.startsWith('user/')) {
    if (debounceAddressTimer) clearTimeout(debounceAddressTimer);
    debounceAddressTimer = setTimeout(() => {
      try {
        const state: any = store.getState();
        if (state.user?.savedAddresses) {
          AsyncStorage.setItem(ADDRESSES_CACHE_KEY, JSON.stringify(state.user.savedAddresses)).catch(() => {});
        }
      } catch {
        // Ignore serialization errors
      }
    }, 400);
  }

  return result;
};

export default persistenceMiddleware;

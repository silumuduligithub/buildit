import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import catalogReducer from './slices/catalogSlice';
import ordersReducer from './slices/ordersSlice';
import retailerReducer from './slices/retailerSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

import {
  authMiddleware,
  persistenceMiddleware,
  analyticsMiddleware,
  errorLoggingMiddleware,
  loggerMiddleware,
} from './middleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    catalog: catalogReducer,
    orders: ordersReducer,
    retailer: retailerReducer,
    user: userReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(
      authMiddleware,
      persistenceMiddleware,
      analyticsMiddleware,
      errorLoggingMiddleware,
      loggerMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';

/**
 * Error Logging & Diagnostics Middleware
 * Captures all rejected async thunks, logs diagnostic telemetry, and handles normalized error reporting.
 */
export const errorLoggingMiddleware: Middleware = () => (next) => (action: any) => {
  if (isRejectedWithValue(action) || (action.type && action.type.endsWith('/rejected'))) {
    const errorPayload = action.payload || action.error;
    const actionType = action.type;
    const timestamp = new Date().toISOString();

    if (__DEV__) {
      console.warn(
        `[Redux Error] [${timestamp}] Action: ${actionType}\nMessage:`,
        errorPayload
      );
    }
  }

  return next(action);
};

export default errorLoggingMiddleware;

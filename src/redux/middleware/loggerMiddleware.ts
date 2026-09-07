import { Middleware } from '@reduxjs/toolkit';

/**
 * Dev Logger Middleware
 * Provides formatted action inspection and state change performance logging during development.
 */
export const loggerMiddleware: Middleware = (store) => (next) => (action: any) => {
  if (!__DEV__) {
    return next(action);
  }

  const startTime = Date.now();
  const actionType = action?.type || 'UNKNOWN_ACTION';
  const result = next(action);
  const duration = Date.now() - startTime;

  // Log in dev mode with collapsed formatting style
  console.log(`%c redux action %c ${actionType} %c (${duration}ms)`, 'color: #888;', 'color: #FF6B00; font-weight: bold;', 'color: #059669;');

  return result;
};

export default loggerMiddleware;

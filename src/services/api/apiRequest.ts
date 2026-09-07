import { executeApiRequest, RequestOptions, ApiResponseWrapper, ApiError } from './apiClient';

/**
 * Production-ready Global API Request Utility
 *
 * Example usages:
 * ```ts
 * const { data } = await apiRequest({ url: '/customer/home', method: 'GET' });
 * const { data } = await apiRequest({ url: '/users', method: 'POST', body: { name: 'John' } });
 * ```
 */
export const apiRequest = async <T = any>(options: RequestOptions): Promise<ApiResponseWrapper<T>> => {
  return executeApiRequest<T>(options);
};

export { ApiError };
export type { RequestOptions, ApiResponseWrapper };
export default apiRequest;

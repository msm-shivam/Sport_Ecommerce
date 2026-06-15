import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

export const catalogApi = {
  products: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/catalog/products', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/catalog/products/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/catalog/products', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/catalog/products/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/catalog/products/${id}`),
  },
  categories: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/catalog/categories', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/catalog/categories/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/catalog/categories', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/catalog/categories/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/catalog/categories/${id}`),
  },
  brands: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/catalog/brands', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/catalog/brands/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/catalog/brands', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/catalog/brands/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/catalog/brands/${id}`),
  },
  reviews: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/catalog/reviews', { params }),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/catalog/reviews/${id}`),
  },
};

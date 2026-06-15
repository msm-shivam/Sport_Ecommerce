import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

export const ordersApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/orders', { params }),
  get: (id: string) =>
    apiClient.get<ApiResponse<unknown>>(`/orders/${id}`),
  update: (id: string, body: unknown) =>
    apiClient.patch<ApiResponse<unknown>>(`/orders/${id}`, body),
  shipments: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/orders/shipments', { params }),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/orders/shipments', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/orders/shipments/${id}`, body),
  },
  returns: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/orders/returns', { params }),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/orders/returns/${id}`, body),
  },
};

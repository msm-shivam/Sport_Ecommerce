import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

export const customersApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/customers', { params }),
  get: (id: string) =>
    apiClient.get<ApiResponse<unknown>>(`/customers/${id}`),
  activity: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/customers/activity', { params }),
  },
};

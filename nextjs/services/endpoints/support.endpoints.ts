import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

export const supportApi = {
  tickets: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/support/tickets', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/support/tickets/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/support/tickets', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/support/tickets/${id}`, body),
  },
  analytics: {
    get: () =>
      apiClient.get<ApiResponse<unknown>>('/support/analytics'),
  },
};

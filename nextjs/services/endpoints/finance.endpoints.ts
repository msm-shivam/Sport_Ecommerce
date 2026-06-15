import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

export const financeApi = {
  transactions: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/finance/transactions', { params }),
  },
  settlements: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/finance/settlements', { params }),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/finance/settlements/${id}`, body),
  },
  expenses: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/finance/expenses', { params }),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/finance/expenses', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/finance/expenses/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/finance/expenses/${id}`),
  },
};

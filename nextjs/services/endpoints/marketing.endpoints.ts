import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

export const marketingApi = {
  coupons: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/marketing/coupons', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/marketing/coupons/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/marketing/coupons', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/marketing/coupons/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/marketing/coupons/${id}`),
  },
  promotions: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/marketing/promotions', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/marketing/promotions/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/marketing/promotions', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/marketing/promotions/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/marketing/promotions/${id}`),
  },
  campaigns: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/marketing/campaigns', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/marketing/campaigns/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/marketing/campaigns', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/marketing/campaigns/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/marketing/campaigns/${id}`),
  },
  emailTemplates: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/marketing/email-templates', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/marketing/email-templates/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/marketing/email-templates', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/marketing/email-templates/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/marketing/email-templates/${id}`),
  },
};

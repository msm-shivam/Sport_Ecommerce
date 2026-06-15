import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

export const cmsApi = {
  pages: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/cms/pages', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/cms/pages/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/cms/pages', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/cms/pages/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/cms/pages/${id}`),
  },
  sections: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/cms/sections', { params }),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/cms/sections', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/cms/sections/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/cms/sections/${id}`),
    reorder: (body: unknown) =>
      apiClient.post<ApiResponse<null>>('/cms/sections/reorder', body),
  },
};

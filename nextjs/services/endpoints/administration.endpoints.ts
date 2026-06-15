import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

export const adminApi = {
  users: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/admin/users', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/admin/users/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/admin/users', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/admin/users/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/admin/users/${id}`),
  },
  roles: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/admin/roles', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/admin/roles/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/admin/roles', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/admin/roles/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/admin/roles/${id}`),
  },
  permissions: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/admin/permissions', { params }),
  },
  auditLogs: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/admin/audit-logs', { params }),
  },
  securityLogs: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/admin/security-logs', { params }),
  },
  privacyRequests: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/admin/privacy-requests', { params }),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/admin/privacy-requests/${id}`, body),
  },
};

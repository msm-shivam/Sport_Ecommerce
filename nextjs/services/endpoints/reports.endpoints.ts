import apiClient, { ApiResponse } from '@/services/api.client';

export const reportsApi = {
  generate: (params?: Record<string, unknown>) =>
    apiClient.post<ApiResponse<unknown>>('/reports/generate', params),
  exportCsv: (params?: Record<string, unknown>) =>
    apiClient.post('/reports/export', params, { responseType: 'blob' }),
};

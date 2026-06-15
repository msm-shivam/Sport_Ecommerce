'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/services/api.client';
import * as Types from '@/services/types';

export function useDashboard() {
  return useQuery<ApiResponse<Types.DashboardData>>({
    queryKey: ['dashboard', 'main'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Types.DashboardData>>('/admin/dashboards/main');
      return data;
    },
  });
}

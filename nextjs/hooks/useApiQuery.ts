'use client';

import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/services/api.client';

export function useApiQuery<T>(
  key: QueryKey,
  url: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<ApiResponse<T>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<T>>({
    queryKey: [...key, params],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<T>>(url, { params });
      return data;
    },
    ...options,
  });
}

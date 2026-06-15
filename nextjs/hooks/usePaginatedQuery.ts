'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}

export function usePaginatedQuery<T>(
  key: string,
  url: string,
  params: PaginationParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<PaginatedResponse<T>>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<PaginatedResponse<T>>>({
    queryKey: [key, params],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<T>>>(url, { params });
      return data;
    },
    placeholderData: (prev) => prev,
    ...options,
  });
}

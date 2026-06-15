'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/services/api.client';

type Method = 'post' | 'patch' | 'put' | 'delete';

export function useApiMutation<TData = unknown, TVariables = unknown>(
  method: Method,
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, 'mutationFn'>
) {
  return useMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn: async (variables) => {
      if (method === 'delete') {
        const { data } = await apiClient.delete<ApiResponse<TData>>(url);
        return data;
      }
      const { data } = await apiClient[method]<ApiResponse<TData>>(url, variables);
      return data;
    },
    ...options,
  });
}

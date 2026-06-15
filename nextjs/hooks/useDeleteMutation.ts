'use client';

import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/services/api.client';

export function useDeleteMutation<T = unknown>(
  url: string,
  queryKey: string,
  options?: Omit<UseMutationOptions<ApiResponse<T>, Error, void>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<T>, Error, void>({
    mutationFn: async () => {
      const { data } = await apiClient.delete<ApiResponse<T>>(url);
      return data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

import apiClient, { ApiResponse, PaginatedResponse } from '@/services/api.client';

export const inventoryApi = {
  stock: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/inventory/stock', { params }),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/inventory/stock/${id}`, body),
  },
  suppliers: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/inventory/suppliers', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/inventory/suppliers/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/inventory/suppliers', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/inventory/suppliers/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/inventory/suppliers/${id}`),
  },
  purchaseOrders: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/inventory/purchase-orders', { params }),
    get: (id: string) =>
      apiClient.get<ApiResponse<unknown>>(`/inventory/purchase-orders/${id}`),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/inventory/purchase-orders', body),
    update: (id: string, body: unknown) =>
      apiClient.patch<ApiResponse<unknown>>(`/inventory/purchase-orders/${id}`, body),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`/inventory/purchase-orders/${id}`),
  },
  goodsReceipts: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/inventory/goods-receipts', { params }),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/inventory/goods-receipts', body),
  },
  stockAdjustments: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<ApiResponse<PaginatedResponse<unknown>>>('/inventory/stock-adjustments', { params }),
    create: (body: unknown) =>
      apiClient.post<ApiResponse<unknown>>('/inventory/stock-adjustments', body),
  },
};

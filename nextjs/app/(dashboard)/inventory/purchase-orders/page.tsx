'use client';

import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useQueryParams } from '@/hooks/useQueryParams';

export default function PurchaseOrdersPage() {
  const { getQueryParam, setQueryParams } = useQueryParams();
  const page = parseInt(getQueryParam('page', '1'), 10);
  const limit = parseInt(getQueryParam('limit', '10'), 10);
  const search = getQueryParam('search');

  const { data, isLoading } = usePaginatedQuery<any>('purchase-orders', '/admin/purchase-orders', { page, limit, search });
  const orders = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const handleSearchChange = (val: string) => {
    setQueryParams({ search: val, page: 1 });
  };

  const columns: TableColumn[] = [
    { key: 'poNumber', label: 'PO Number', sortable: true },
    { key: 'supplier', label: 'Supplier', sortable: true },
    { key: 'orderDate', label: 'Order Date', sortable: true },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      render: (val) => `$${(val as number).toLocaleString()}`,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Orders" description="Track and manage purchase orders with suppliers." />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search PO number..." />
      </div>
      <AppDataTable data={orders} columns={columns} totalItems={total} loading={isLoading} />
    </div>
  );
}

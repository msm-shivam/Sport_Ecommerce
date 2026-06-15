'use client';

import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useQueryParams } from '@/hooks/useQueryParams';

export default function StockAdjustmentsPage() {
  const { getQueryParam, setQueryParams } = useQueryParams();
  const page = parseInt(getQueryParam('page', '1'), 10);
  const limit = parseInt(getQueryParam('limit', '10'), 10);
  const search = getQueryParam('search');

  const { data, isLoading } = usePaginatedQuery<any>('stock-adjustments', '/admin/inventory-plus/movements', { page, limit, search });
  const adjustments = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const handleSearchChange = (val: string) => {
    setQueryParams({ search: val, page: 1 });
  };

  const columns: TableColumn[] = [
    { key: 'productName', label: 'Product', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true },
    {
      key: 'adjustment',
      label: 'Adjustment',
      sortable: true,
      render: (val) => {
        const v = val as number;
        const sign = v >= 0 ? '+' : '';
        const color = v >= 0 ? 'text-green-600' : 'text-red-600';
        return <span className={`font-semibold ${color}`}>{sign}{v}</span>;
      },
    },
    { key: 'reason', label: 'Reason' },
    { key: 'date', label: 'Date', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Adjustments" description="Track inventory changes and corrections." />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search product name or SKU..." />
      </div>
      <AppDataTable data={adjustments} columns={columns} totalItems={total} loading={isLoading} />
    </div>
  );
}

'use client';

import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useQueryParams } from '@/hooks/useQueryParams';

export default function SettlementsPage() {
  const { getQueryParam, setQueryParams } = useQueryParams();
  const page = parseInt(getQueryParam('page', '1'), 10);
  const limit = parseInt(getQueryParam('limit', '10'), 10);
  const search = getQueryParam('search');

  const { data, isLoading } = usePaginatedQuery<any>('settlements', '/admin/settlements', { page, limit, search });
  const settlements = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const handleSearchChange = (val: string) => {
    setQueryParams({ search: val, page: 1 });
  };

  const columns: TableColumn[] = [
    { key: 'settlementNumber', label: 'Settlement #', sortable: true },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (val) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settlements" description="Review batch payouts and settlement records." />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search settlement #..." />
      </div>
      <AppDataTable data={settlements} columns={columns} totalItems={total} loading={isLoading} />
    </div>
  );
}

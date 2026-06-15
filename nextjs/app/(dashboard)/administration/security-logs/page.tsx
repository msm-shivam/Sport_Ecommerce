'use client';

import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import AppRowActions from '@/components/table/AppRowActions';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useQueryParams } from '@/hooks/useQueryParams';

export default function SecurityLogsPage() {
  const { getQueryParam, setQueryParams } = useQueryParams();
  const page = parseInt(getQueryParam('page', '1'), 10);
  const limit = parseInt(getQueryParam('limit', '10'), 10);
  const search = getQueryParam('search');

  const { data, isLoading } = usePaginatedQuery<any>('security-logs', '/admin/security', { page, limit, search });
  const logs = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const handleSearchChange = (val: string) => {
    setQueryParams({ search: val, page: 1 });
  };

  const columns: TableColumn[] = [
    { key: 'user', label: 'User', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'ipAddress', label: 'IP Address', sortable: true },
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Security Logs" description="Monitor authentication and security-related events." />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search user, action, or IP address..." />
      </div>

      <AppDataTable
        data={logs}
        columns={columns}
        totalItems={total}
        loading={isLoading}
        rowActions={() => <AppRowActions />}
      />
    </div>
  );
}

'use client';

import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import AppRowActions from '@/components/table/AppRowActions';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useQueryParams } from '@/hooks/useQueryParams';

function formatRequestType(type: string) {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function PrivacyRequestsPage() {
  const { getQueryParam, setQueryParams } = useQueryParams();
  const page = parseInt(getQueryParam('page', '1'), 10);
  const limit = parseInt(getQueryParam('limit', '10'), 10);
  const search = getQueryParam('search');

  const { data, isLoading } = usePaginatedQuery<any>('privacy-requests', '/admin/privacy', { page, limit, search });
  const requests = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const handleSearchChange = (val: string) => {
    setQueryParams({ search: val, page: 1 });
  };

  const columns: TableColumn[] = [
    { key: 'customerName', label: 'Customer Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'requestType',
      label: 'Request Type',
      sortable: true,
      render: (val) => formatRequestType(val),
    },
    { key: 'requestedDate', label: 'Requested Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Privacy Requests" description="Manage GDPR and data privacy requests from customers." />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search customer name or email..." />
      </div>

      <AppDataTable
        data={requests}
        columns={columns}
        totalItems={total}
        loading={isLoading}
        rowActions={() => <AppRowActions />}
      />
    </div>
  );
}

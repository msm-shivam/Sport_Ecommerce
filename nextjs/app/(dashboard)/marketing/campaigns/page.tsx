'use client';

import React, { useTransition, use } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import * as Types from '@/services/types';

export default function CampaignsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const page = parseInt((resolvedSearchParams.page as string) || '1', 10);
  const limit = parseInt((resolvedSearchParams.limit as string) || '10', 10);
  const search = (resolvedSearchParams.search as string) || '';
  const [, startTransition] = useTransition();

  const { data: campaignsRes, isLoading } = usePaginatedQuery<Types.Campaign>(
    'campaigns',
    '/admin/campaigns',
    { page, limit, search }
  );

  const campaigns = campaignsRes?.data?.items || [];
  const totalItems = campaignsRes?.data?.total || 0;

  const updateUrl = (newParams: Record<string, string | number | null>) => {
    const url = new URL(window.location.href);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '') url.searchParams.delete(k);
      else url.searchParams.set(k, String(v));
    });
    window.history.pushState({}, '', url.toString());
  };

  const handleSearchChange = (val: string) => {
    startTransition(() => {
      updateUrl({ search: val, page: 1 });
    });
  };

  const handleSort = (key: string, dir: 'asc' | 'desc') => {
    startTransition(() => {
      updateUrl({ sortBy: key, sortOrder: dir });
    });
  };

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'channel', label: 'Channel', sortable: true },
    { key: 'budget', label: 'Budget', sortable: true, render: (val) => `$${Number(val).toLocaleString()}` },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Campaigns" description="Track and manage marketing campaigns." />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search name or channel..." />
      </div>

      <AppDataTable
        data={campaigns}
        columns={columns}
        totalItems={totalItems}
        loading={isLoading}
        onSort={handleSort}
      />
    </div>
  );
}

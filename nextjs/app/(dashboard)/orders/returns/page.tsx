'use client';

import React, { useState, useTransition, use } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import apiClient from '@/services/api.client';
import * as Types from '@/services/types';

export default function ReturnsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const page = parseInt((resolvedSearchParams.page as string) || '1', 10);
  const limit = parseInt((resolvedSearchParams.limit as string) || '10', 10);
  const search = (resolvedSearchParams.search as string) || '';
  const [, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const { data: returnsRes, isLoading } = usePaginatedQuery<Types.Return>(
    'returns',
    '/admin/returns',
    { page, limit, search }
  );

  const returns = returnsRes?.data?.items || [];
  const totalItems = returnsRes?.data?.total || 0;

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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsSaving(true);
    try {
      await apiClient.patch(`/admin/returns/${id}`, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['returns'] });
    } finally {
      setIsSaving(false);
    }
  };

  const columns: TableColumn[] = [
    { key: 'orderNumber', label: 'Order No', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'reason', label: 'Reason' },
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
      <PageHeader title="Returns" description="Process and manage product returns and refunds." />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search order or customer name..." />
      </div>
      <AppDataTable data={returns} columns={columns} totalItems={totalItems} loading={isLoading} />
    </div>
  );
}

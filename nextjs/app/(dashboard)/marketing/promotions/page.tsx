'use client';

import React, { useTransition, use } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import * as Types from '@/services/types';

export default function PromotionsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const page = parseInt((resolvedSearchParams.page as string) || '1', 10);
  const limit = parseInt((resolvedSearchParams.limit as string) || '10', 10);
  const search = (resolvedSearchParams.search as string) || '';
  const [, startTransition] = useTransition();

  const { data: promotionsRes, isLoading } = usePaginatedQuery<Types.Promotion>(
    'promotions',
    '/admin/promotions',
    { page, limit, search }
  );

  const promotions = promotionsRes?.data?.items || [];
  const totalItems = promotionsRes?.data?.total || 0;

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
    { key: 'title', label: 'Title', sortable: true },
    { key: 'discount', label: 'Discount', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Promotions" description="Manage promotional campaigns and discounts." />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search title..." />
      </div>

      <AppDataTable
        data={promotions}
        columns={columns}
        totalItems={totalItems}
        loading={isLoading}
        onSort={handleSort}
      />
    </div>
  );
}

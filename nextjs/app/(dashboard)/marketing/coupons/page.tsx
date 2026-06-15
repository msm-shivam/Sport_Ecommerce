'use client';

import React, { useTransition, use } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import AppRowActions from '@/components/table/AppRowActions';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import apiClient from '@/services/api.client';
import * as Types from '@/services/types';

export default function CouponsPage({
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

  const { data: couponsRes, isLoading } = usePaginatedQuery<Types.Coupon>(
    'coupons',
    '/admin/coupons',
    { page, limit, search }
  );

  const coupons = couponsRes?.data?.items || [];
  const totalItems = couponsRes?.data?.total || 0;

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

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/admin/coupons/${id}`);
    queryClient.invalidateQueries({ queryKey: ['coupons'] });
  };

  const columns: TableColumn[] = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'title', label: 'Campaign Title', sortable: true },
    { key: 'discount', label: 'Discount Value', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Coupons" description="Manage coupon codes and discounts." />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search code or title..." />
      </div>

      <AppDataTable
        data={coupons}
        columns={columns}
        totalItems={totalItems}
        loading={isLoading}
        onSort={handleSort}
        rowActions={(row: any) => (
          <AppRowActions
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />
    </div>
  );
}

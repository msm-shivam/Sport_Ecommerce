'use client';

import React, { useState, useTransition, use } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import AppRowActions from '@/components/table/AppRowActions';
import { Review } from '@/types/catalog';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import apiClient from '@/services/api.client';
import { Star, CheckCircle, XCircle } from 'lucide-react';

export default function ReviewsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const page = parseInt((resolvedSearchParams.page as string) || '1', 10);
  const limit = parseInt((resolvedSearchParams.limit as string) || '10', 10);
  const search = (resolvedSearchParams.search as string) || '';
  const status = (resolvedSearchParams.status as string) || '';

  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

  const { data: reviewsRes, isLoading } = usePaginatedQuery<Review>(
    'reviews',
    '/admin/reviews',
    { page, limit, search, status }
  );

  const reviews = reviewsRes?.data?.items || [];
  const totalReviews = reviewsRes?.data?.total || 0;

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

  const handleStatusFilter = (val: string) => {
    startTransition(() => {
      updateUrl({ status: val, page: 1 });
    });
  };

  const handleApprove = async (id: string) => {
    await apiClient.patch(`/admin/reviews/${id}`, { status: 'approved' });
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
  };

  const handleReject = async (id: string) => {
    await apiClient.patch(`/admin/reviews/${id}`, { status: 'rejected' });
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
  };

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/admin/reviews/${id}`);
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
  };

  const columns: TableColumn[] = [
    { key: 'productName', label: 'Product', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (val: any) => (
        <div className="flex items-center gap-0.5 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill={i < Number(val) ? 'currentColor' : 'none'} />
          ))}
        </div>
      ),
    },
    { key: 'comment', label: 'Comment' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val: any) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Monitor customer feedback and approve or reject submissions." />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search product, customer, or comment..." />
        <select
          value={status}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <AppDataTable
        data={reviews}
        columns={columns}
        totalItems={totalReviews}
        loading={isLoading}
        rowActions={(row: any) => (
          <AppRowActions
            onDelete={() => handleDelete(row.id)}
            extraActions={[
              { label: 'Approve', icon: CheckCircle, onClick: () => handleApprove(row.id) },
              { label: 'Reject', icon: XCircle, onClick: () => handleReject(row.id), danger: true },
            ]}
          />
        )}
      />
    </div>
  );
}

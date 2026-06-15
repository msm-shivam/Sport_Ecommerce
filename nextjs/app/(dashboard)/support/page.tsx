'use client';

import React, { useState, useTransition, use, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import AppRowActions from '@/components/table/AppRowActions';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import apiClient from '@/services/api.client';
import { useQueryClient } from '@tanstack/react-query';
import * as Types from '@/services/types';
import StatsCard from '@/components/shared/StatsCard';
import { LifeBuoy, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function SupportPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const page = parseInt((resolvedSearchParams.page as string) || '1', 10);
  const limit = parseInt((resolvedSearchParams.limit as string) || '10', 10);
  const search = (resolvedSearchParams.search as string) || '';
  const status = (resolvedSearchParams.status as string) || '';
  const [, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const { data: ticketsRes, isLoading } = usePaginatedQuery<Types.Ticket>(
    'support',
    '/admin/support',
    { page, limit, search, status }
  );

  const tickets = ticketsRes?.data?.items || [];
  const totalItems = ticketsRes?.data?.total || 0;

  const stats = useMemo(() => ({
    total: totalItems,
    open: tickets.filter(t => t.status === 'open').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    highPriority: tickets.filter(t => t.priority === 'high').length,
  }), [tickets, totalItems]);

  const handleResolve = async (row: Types.Ticket) => {
    await apiClient.patch(`/admin/support/${row.id}`, { status: 'resolved' });
    queryClient.invalidateQueries({ queryKey: ['support'] });
  };

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

  const columns: TableColumn[] = [
    { key: 'ticketNumber', label: 'Ticket #', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'email', label: 'Email' },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          val === 'high' ? 'bg-red-50 text-red-600 border border-red-500/20' : 'bg-zinc-100 text-zinc-600'
        }`}>
          {String(val).toUpperCase()}
        </span>
      ),
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
      <PageHeader title="Support" description="Resolve customer queries and monitor tickets." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard title="Total Tickets" value={stats.total} icon={LifeBuoy} />
        <StatsCard title="Open" value={stats.open} icon={Clock} trend={{ value: 33, isPositive: false, label: 'needs attention' }} />
        <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircle} trend={{ value: 50, isPositive: true, label: 'resolution rate' }} />
        <StatsCard title="High Priority" value={stats.highPriority} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Support Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm"><span className="text-zinc-500">Total Tickets</span><span className="font-bold text-zinc-800 dark:text-zinc-200">{stats.total}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-zinc-500">Open</span><span className="font-bold text-blue-600">{stats.open}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-zinc-500">Resolved</span><span className="font-bold text-green-600">{stats.resolved}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-zinc-500">High Priority</span><span className="font-bold text-red-500">{stats.highPriority}</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <a href="/support/tickets" className="rounded-lg bg-zinc-100 p-3 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-orange-100 hover:text-orange-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-orange-900/30 dark:hover:text-orange-400">Tickets</a>
            <a href="/support/analytics" className="rounded-lg bg-zinc-100 p-3 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-orange-100 hover:text-orange-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-orange-900/30 dark:hover:text-orange-400">Analytics</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search ticket #, customer, or email..." />
        <select
          value={status}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <AppDataTable
        data={tickets}
        columns={columns}
        totalItems={totalItems}
        loading={isLoading}
        rowActions={(row: any) => (
          <AppRowActions
            extraActions={[
              {
                label: 'Resolve Ticket',
                icon: CheckCircle,
                onClick: () => handleResolve(row),
              },
            ]}
          />
        )}
      />
    </div>
  );
}

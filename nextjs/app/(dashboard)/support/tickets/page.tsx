'use client';

import React, { useState, useTransition, use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import AppDrawer from '@/components/modal/AppDrawer';
import AppInput from '@/components/form/AppInput';
import AppSelect from '@/components/form/AppSelect';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import AppRowActions from '@/components/table/AppRowActions';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import apiClient from '@/services/api.client';
import * as Types from '@/services/types';
import { CheckCircle, Plus } from 'lucide-react';

const ticketSchema = z.object({
  ticketNumber: z.string().min(1, 'Ticket number is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['open', 'pending', 'resolved']),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export default function TicketsPage({
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Types.Ticket | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema) as any,
    defaultValues: {
      ticketNumber: '',
      customerName: '',
      email: '',
      priority: 'low',
      status: 'open',
    },
  });

  const { data: ticketsRes, isLoading } = usePaginatedQuery<Types.Ticket>(
    'tickets',
    '/admin/support',
    { page, limit, search }
  );

  const tickets = ticketsRes?.data?.items || [];
  const totalItems = ticketsRes?.data?.total || 0;

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

  const handleOpenAddDrawer = () => {
    setEditingTicket(null);
    reset({ ticketNumber: '', customerName: '', email: '', priority: 'low', status: 'open' });
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (ticket: Types.Ticket) => {
    setEditingTicket(ticket);
    reset({
      ticketNumber: ticket.ticketNumber,
      customerName: ticket.customerName,
      email: ticket.email,
      priority: ticket.priority,
      status: ticket.status,
    });
    setDrawerOpen(true);
  };

  const handleSave = async (values: TicketFormValues) => {
    setIsSaving(true);
    try {
      if (editingTicket) {
        await apiClient.patch(`/admin/support/${editingTicket.id}`, values);
      } else {
        await apiClient.post('/admin/support', values);
      }
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setDrawerOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/admin/support/${id}`);
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
  };

  const handleResolve = async (row: Types.Ticket) => {
    await apiClient.patch(`/admin/support/${row.id}`, { status: 'resolved' });
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
  };

  const columns: TableColumn[] = [
    { key: 'ticketNumber', label: 'Ticket #', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'email', label: 'Email' },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (val) => {
        const colorMap: Record<string, string> = {
          high: 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-500/20',
          medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/20',
          low: 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-500/20',
        };
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap[val] || colorMap.low}`}>
            {val.charAt(0).toUpperCase() + val.slice(1)}
          </span>
        );
      },
    },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Tickets" description="Manage support tickets and customer inquiries.">
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add Ticket</span>
        </button>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search ticket number, customer, or email..." />
      </div>

      <AppDataTable
        data={tickets}
        columns={columns}
        totalItems={totalItems}
        loading={isLoading}
        rowActions={(row: any) => (
          <AppRowActions
            onEdit={() => handleOpenEditDrawer(row)}
            onDelete={() => handleDelete(row.id)}
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

      <AppDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingTicket ? 'Edit Ticket' : 'Add New Ticket'}
      >
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <AppInput label="Ticket Number" register={register('ticketNumber')} error={errors.ticketNumber?.message} />
          <AppInput label="Customer Name" register={register('customerName')} error={errors.customerName?.message} />
          <AppInput label="Email" type="email" register={register('email')} error={errors.email?.message} />
          <AppSelect
            label="Priority"
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            register={register('priority')}
            error={errors.priority?.message}
          />
          <AppSelect
            label="Status"
            options={[
              { value: 'open', label: 'Open' },
              { value: 'pending', label: 'Pending' },
              { value: 'resolved', label: 'Resolved' },
            ]}
            register={register('status')}
            error={errors.status?.message}
          />
          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-orange-500 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Ticket'}
            </button>
          </div>
        </form>
      </AppDrawer>
    </div>
  );
}

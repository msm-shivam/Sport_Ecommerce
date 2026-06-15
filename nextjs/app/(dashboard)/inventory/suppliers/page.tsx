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
import { Plus } from 'lucide-react';

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  contact: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone number is required'),
  status: z.enum(['active', 'inactive']),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function SuppliersPage({
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
  const [editingSupplier, setEditingSupplier] = useState<Types.Supplier | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      name: '',
      contact: '',
      email: '',
      phone: '',
      status: 'active',
    },
  });

  const { data: suppliersRes, isLoading } = usePaginatedQuery<Types.Supplier>(
    'suppliers',
    '/admin/suppliers',
    { page, limit, search }
  );

  const suppliers = suppliersRes?.data?.items || [];
  const totalItems = suppliersRes?.data?.total || 0;

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
    setEditingSupplier(null);
    reset({ name: '', contact: '', email: '', phone: '', status: 'active' });
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (supplier: Types.Supplier) => {
    setEditingSupplier(supplier);
    reset({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      status: supplier.status,
    });
    setDrawerOpen(true);
  };

  const handleSave = async (values: SupplierFormValues) => {
    setIsSaving(true);
    try {
      if (editingSupplier) {
        await apiClient.patch(`/admin/suppliers/${editingSupplier.id}`, values);
      } else {
        await apiClient.post('/admin/suppliers', values);
      }
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setDrawerOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/admin/suppliers/${id}`);
    queryClient.invalidateQueries({ queryKey: ['suppliers'] });
  };

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'contact', label: 'Contact' },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Suppliers" description="Manage supplier information and relationships.">
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add Supplier</span>
        </button>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search suppliers..." />
      </div>

      <AppDataTable
        data={suppliers}
        columns={columns}
        totalItems={totalItems}
        loading={isLoading}
        rowActions={(row: any) => (
          <AppRowActions
            onEdit={() => handleOpenEditDrawer(row)}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />

      <AppDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <AppInput label="Supplier Name" register={register('name')} error={errors.name?.message} />
          <AppInput label="Contact Person" register={register('contact')} error={errors.contact?.message} />
          <AppInput label="Email" type="email" register={register('email')} error={errors.email?.message} />
          <AppInput label="Phone" register={register('phone')} error={errors.phone?.message} />
          <AppSelect
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
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
              {isSaving ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </AppDrawer>
    </div>
  );
}

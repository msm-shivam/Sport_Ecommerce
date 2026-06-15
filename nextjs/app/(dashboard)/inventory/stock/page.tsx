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

const stockSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  status: z.enum(['active', 'inactive', 'out of stock']),
});

type StockFormValues = z.infer<typeof stockSchema>;

export default function StockLevelsPage({
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
  const [editingProduct, setEditingProduct] = useState<Types.Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema) as any,
    defaultValues: {
      name: '',
      sku: '',
      stock: 0,
      status: 'active',
    },
  });

  const { data: productsRes, isLoading } = usePaginatedQuery<Types.Product>(
    'inventory-plus',
    '/admin/inventory-plus',
    { page, limit, search }
  );

  const products = productsRes?.data?.items || [];
  const totalItems = productsRes?.data?.total || 0;

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
    setEditingProduct(null);
    reset({ name: '', sku: '', stock: 0, status: 'active' });
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (product: Types.Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      status: product.status,
    });
    setDrawerOpen(true);
  };

  const handleSave = async (values: StockFormValues) => {
    setIsSaving(true);
    try {
      if (editingProduct) {
        await apiClient.patch(`/admin/inventory-plus/${editingProduct.id}`, values);
      } else {
        await apiClient.post('/admin/inventory-plus', values);
      }
      queryClient.invalidateQueries({ queryKey: ['inventory-plus'] });
      setDrawerOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/admin/inventory-plus/${id}`);
    queryClient.invalidateQueries({ queryKey: ['inventory-plus'] });
  };

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (val) => {
        const v = val as number;
        const color = v === 0 ? 'text-red-600 font-semibold' : v < 15 ? 'text-amber-600 font-semibold' : '';
        return <span className={color}>{v}</span>;
      },
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
      <PageHeader title="Stock Levels" description="Monitor product stock quantities and availability.">
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add Stock Item</span>
        </button>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search name or SKU..." />
      </div>

      <AppDataTable
        data={products}
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
        title={editingProduct ? 'Edit Stock Item' : 'Add Stock Item'}
      >
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <AppInput label="Name" register={register('name')} error={errors.name?.message} />
          <AppInput label="SKU" register={register('sku')} error={errors.sku?.message} />
          <AppInput label="Stock Qty" type="number" register={register('stock')} error={errors.stock?.message} />
          <AppSelect
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'out of stock', label: 'Out of Stock' },
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
              {isSaving ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </AppDrawer>
    </div>
  );
}

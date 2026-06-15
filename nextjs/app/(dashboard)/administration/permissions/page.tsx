'use client';

import React, { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import AppDataTable, { TableColumn } from '@/components/table/AppDataTable';
import AppDrawer from '@/components/modal/AppDrawer';
import AppInput from '@/components/form/AppInput';
import SearchInput from '@/components/shared/SearchInput';
import AppRowActions from '@/components/table/AppRowActions';
import { Plus } from 'lucide-react';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import apiClient from '@/services/api.client';

const permissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  module: z.string().min(1, 'Module is required'),
  description: z.string().min(1, 'Description is required'),
});

type PermissionFormValues = z.infer<typeof permissionSchema>;

function PermissionsPageContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);
  const search = searchParams.get('search') ?? '';

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<any>(null);

  const { data: permissionsRes, isLoading } = usePaginatedQuery<any>('permissions', '/admin/permissions', { page, limit, search });
  const permissions = permissionsRes?.data?.items || [];
  const totalPermissions = permissionsRes?.data?.total || 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { name: '', slug: '', module: '', description: '' },
  });

  const handleSearchChange = (val: string) => {
    const url = new URL(window.location.href);
    if (val) url.searchParams.set('search', val); else url.searchParams.delete('search');
    url.searchParams.set('page', '1');
    window.history.pushState({}, '', url.toString());
  };

  const handleOpenAddDrawer = () => {
    setEditingPermission(null);
    reset({ name: '', slug: '', module: '', description: '' });
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item: any) => {
    setEditingPermission(item);
    reset({ name: item.name, slug: item.slug, module: item.module, description: item.description });
    setDrawerOpen(true);
  };

  const handleSave = async (values: PermissionFormValues) => {
    setIsSaving(true);
    try {
      if (editingPermission) {
        await apiClient.patch(`/admin/permissions/${editingPermission.id}`, values);
      } else {
        await apiClient.post('/admin/permissions', values);
      }
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      setDrawerOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/admin/permissions/${id}`);
    queryClient.invalidateQueries({ queryKey: ['permissions'] });
  };

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'module', label: 'Module', sortable: true },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Permissions" description="Manage system permissions and their associated modules.">
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors"
        >
          <Plus size={16} />
          <span>Add Permission</span>
        </button>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search name, slug, or module..." />
      </div>

      <AppDataTable
        data={permissions}
        columns={columns}
        totalItems={totalPermissions}
        loading={isLoading}
        rowActions={(row: any) => (
          <AppRowActions
            onEdit={() => handleOpenEditDrawer(row)}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />

      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingPermission ? 'Edit Permission' : 'Add New Permission'}>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <AppInput label="Name" register={register('name')} error={errors.name?.message} />
          <AppInput label="Slug" register={register('slug')} error={errors.slug?.message} />
          <AppInput label="Module" register={register('module')} error={errors.module?.message} />
          <AppInput label="Description" register={register('description')} error={errors.description?.message} />
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
              {isSaving ? 'Saving...' : 'Save Permission'}
            </button>
          </div>
        </form>
      </AppDrawer>
    </div>
  );
}

export default function PermissionsPage() {
  return (
    <Suspense>
      <PermissionsPageContent />
    </Suspense>
  );
}

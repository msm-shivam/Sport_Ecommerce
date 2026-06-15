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
import AppSelect from '@/components/form/AppSelect';
import SearchInput from '@/components/shared/SearchInput';
import StatusBadge from '@/components/shared/StatusBadge';
import AppRowActions from '@/components/table/AppRowActions';
import { Plus, Shield } from 'lucide-react';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import apiClient from '@/services/api.client';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['active', 'inactive']),
});

type UserFormValues = z.infer<typeof userSchema>;

function AdminUsersPageContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);
  const search = searchParams.get('search') ?? '';

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const { data: usersRes, isLoading } = usePaginatedQuery<any>('admin-users', '/admin/users', { page, limit, search });
  const users = usersRes?.data?.items || [];
  const totalUsers = usersRes?.data?.total || 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: '', status: 'active' },
  });

  const handleSearchChange = (val: string) => {
    const url = new URL(window.location.href);
    if (val) url.searchParams.set('search', val); else url.searchParams.delete('search');
    url.searchParams.set('page', '1');
    window.history.pushState({}, '', url.toString());
  };

  const handleOpenAddDrawer = () => {
    setEditingUser(null);
    reset({ name: '', email: '', role: '', status: 'active' });
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item: any) => {
    setEditingUser(item);
    reset({ name: item.name, email: item.email, role: item.role, status: item.status });
    setDrawerOpen(true);
  };

  const handleSave = async (values: UserFormValues) => {
    setIsSaving(true);
    try {
      if (editingUser) {
        await apiClient.patch(`/admin/users/${editingUser.id}`, values);
      } else {
        await apiClient.post('/admin/users', values);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDrawerOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/admin/users/${id}`);
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    await apiClient.patch(`/admin/users/${item.id}`, { status: newStatus });
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  const columns: TableColumn[] = [
    { key: 'name', label: 'Operator Name', sortable: true },
    { key: 'email', label: 'System Email', sortable: true },
    { key: 'role', label: 'Security Role', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Users" description="Manage system administrators and their access levels.">
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search name, email, or role..." />
      </div>

      <AppDataTable
        data={users}
        columns={columns}
        totalItems={totalUsers}
        loading={isLoading}
        rowActions={(row: any) => (
          <AppRowActions
            onEdit={() => handleOpenEditDrawer(row)}
            onDelete={() => handleDelete(row.id)}
            extraActions={[
              {
                label: 'Toggle Status',
                icon: Shield,
                onClick: () => handleToggleStatus(row),
              },
            ]}
          />
        )}
      />

      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingUser ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <AppInput label="Operator Name" register={register('name')} error={errors.name?.message} />
          <AppInput label="System Email" register={register('email')} error={errors.email?.message} />
          <AppInput label="Security Role" register={register('role')} error={errors.role?.message} />
          <AppSelect
            label="Status"
            options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
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
              {isSaving ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </AppDrawer>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense>
      <AdminUsersPageContent />
    </Suspense>
  );
}

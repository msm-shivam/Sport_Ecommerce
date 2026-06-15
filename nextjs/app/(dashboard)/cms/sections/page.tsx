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
import { Plus } from 'lucide-react';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import apiClient from '@/services/api.client';

const sectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  status: z.enum(['active', 'inactive']),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

function CmsSectionsPageContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);
  const search = searchParams.get('search') ?? '';

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);

  const { data: sectionsRes, isLoading } = usePaginatedQuery<any>('cms-sections', '/admin/homepage', { page, limit, search });
  const sections = sectionsRes?.data?.items || [];
  const totalSections = sectionsRes?.data?.total || 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { name: '', type: '', status: 'active' },
  });

  const handleSearchChange = (val: string) => {
    const url = new URL(window.location.href);
    if (val) url.searchParams.set('search', val); else url.searchParams.delete('search');
    url.searchParams.set('page', '1');
    window.history.pushState({}, '', url.toString());
  };

  const handleOpenAddDrawer = () => {
    setEditingSection(null);
    reset({ name: '', type: '', status: 'active' });
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item: any) => {
    setEditingSection(item);
    reset({ name: item.name, type: item.type, status: item.status });
    setDrawerOpen(true);
  };

  const handleSave = async (values: SectionFormValues) => {
    setIsSaving(true);
    try {
      if (editingSection) {
        await apiClient.patch(`/admin/homepage/${editingSection.id}`, values);
      } else {
        await apiClient.post('/admin/homepage', values);
      }
      queryClient.invalidateQueries({ queryKey: ['cms-sections'] });
      setDrawerOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/admin/homepage/${id}`);
    queryClient.invalidateQueries({ queryKey: ['cms-sections'] });
  };

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Homepage Sections" description="Manage homepage layout and content sections.">
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors"
        >
          <Plus size={16} />
          <span>Add Section</span>
        </button>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search name or type..." />
      </div>

      <AppDataTable
        data={sections}
        columns={columns}
        totalItems={totalSections}
        loading={isLoading}
        rowActions={(row: any) => (
          <AppRowActions
            onEdit={() => handleOpenEditDrawer(row)}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />

      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingSection ? 'Edit Section' : 'Add New Section'}>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <AppInput label="Name" register={register('name')} error={errors.name?.message} />
          <AppInput label="Type" register={register('type')} error={errors.type?.message} />
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
              {isSaving ? 'Saving...' : 'Save Section'}
            </button>
          </div>
        </form>
      </AppDrawer>
    </div>
  );
}

export default function CmsSectionsPage() {
  return (
    <Suspense>
      <CmsSectionsPageContent />
    </Suspense>
  );
}

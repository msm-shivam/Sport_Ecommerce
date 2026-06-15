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

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  status: z.enum(['published', 'draft']),
});

type PageFormValues = z.infer<typeof pageSchema>;

function CmsPagesPageContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);
  const search = searchParams.get('search') ?? '';

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  const { data: pagesRes, isLoading } = usePaginatedQuery<any>('cms-pages', '/admin/cms-pages', { page, limit, search });
  const pages = pagesRes?.data?.items || [];
  const totalPages = pagesRes?.data?.total || 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: { title: '', slug: '', status: 'draft' },
  });

  const handleSearchChange = (val: string) => {
    const url = new URL(window.location.href);
    if (val) url.searchParams.set('search', val); else url.searchParams.delete('search');
    url.searchParams.set('page', '1');
    window.history.pushState({}, '', url.toString());
  };

  const handleOpenAddDrawer = () => {
    setEditingPage(null);
    reset({ title: '', slug: '', status: 'draft' });
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item: any) => {
    setEditingPage(item);
    reset({ title: item.title, slug: item.slug, status: item.status });
    setDrawerOpen(true);
  };

  const handleSave = async (values: PageFormValues) => {
    setIsSaving(true);
    try {
      if (editingPage) {
        await apiClient.patch(`/admin/cms-pages/${editingPage.id}`, values);
      } else {
        await apiClient.post('/admin/cms-pages', values);
      }
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      setDrawerOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/admin/cms-pages/${id}`);
    queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
  };

  const columns: TableColumn[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="CMS Pages" description="Manage static pages and content.">
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors"
        >
          <Plus size={16} />
          <span>Add Page</span>
        </button>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search title or slug..." />
      </div>

      <AppDataTable
        data={pages}
        columns={columns}
        totalItems={totalPages}
        loading={isLoading}
        rowActions={(row: any) => (
          <AppRowActions
            onEdit={() => handleOpenEditDrawer(row)}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />

      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingPage ? 'Edit Page' : 'Add New Page'}>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <AppInput label="Title" register={register('title')} error={errors.title?.message} />
          <AppInput label="Slug" register={register('slug')} error={errors.slug?.message} />
          <AppSelect
            label="Status"
            options={[{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]}
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
              {isSaving ? 'Saving...' : 'Save Page'}
            </button>
          </div>
        </form>
      </AppDrawer>
    </div>
  );
}

export default function CmsPagesPage() {
  return (
    <Suspense>
      <CmsPagesPageContent />
    </Suspense>
  );
}

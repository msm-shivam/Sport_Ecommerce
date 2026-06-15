'use client';

import React, { useState } from 'react';
import AppPagination from './AppPagination';
import { EmptyState } from '../shared/EmptyState';
import LoadingState from '../shared/LoadingState';
import { ArrowUpDown, ArrowUp, ArrowDown, Columns3, Download, RotateCw } from 'lucide-react';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  visible?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (val: any, row: any) => React.ReactNode;
}

interface AppDataTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: TableColumn[];
  totalItems: number;
  loading?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowActions?: (row: any) => React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onRefresh?: () => void;
  onExportCsv?: () => void;
  bulkActions?: React.ReactNode;
}

export function AppDataTable({
  data,
  columns,
  totalItems,
  loading = false,
  selectedIds = [],
  onSelectionChange,
  onSort,
  rowActions,
  onRefresh,
  onExportCsv,
  bulkActions,
}: AppDataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [localVisible, setLocalVisible] = useState<Record<string, boolean>>({});

  const visibleColumns = columns.filter((col) => {
    const forced = localVisible[col.key];
    if (forced !== undefined) return forced;
    return col.visible !== false;
  });

  const handleSort = (key: string) => {
    if (!onSort) return;
    let nextDirection: 'asc' | 'desc' = 'asc';
    if (sortKey === key) {
      nextDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    setSortKey(key);
    setSortDirection(nextDirection);
    onSort(key, nextDirection);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      onSelectionChange(data.map((item) => String(item.id)));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((x) => x !== id));
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  const toggleColumn = (key: string) => {
    setLocalVisible((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? false : !prev[key],
    }));
  };

  return (
    <div className="flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button onClick={onRefresh} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <RotateCw size={16} />
            </button>
          )}
          {onExportCsv && (
            <button onClick={onExportCsv} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <Download size={16} />
            </button>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowColumnToggle(!showColumnToggle)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Columns3 size={16} />
          </button>
          {showColumnToggle && (
            <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
              {columns.map((col) => (
                <label key={col.key} className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localVisible[col.key] !== false && col.visible !== false}
                    onChange={() => toggleColumn(col.key)}
                    className="accent-orange-600"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && bulkActions && (
        <div className="flex items-center gap-2 border-b border-zinc-200 bg-orange-50/50 px-4 py-2 dark:border-zinc-800 dark:bg-orange-950/10">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{selectedIds.length} selected</span>
          {bulkActions}
        </div>
      )}

      {/* Scrollable table view */}
      <div className="overflow-x-auto w-full">
        {loading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                {onSelectionChange && (
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="accent-orange-600 rounded"
                    />
                  </th>
                )}

                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`py-3 px-4 font-bold text-zinc-500 dark:text-zinc-400 select-none ${
                      col.sortable ? 'cursor-pointer hover:text-zinc-950 dark:hover:text-zinc-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span>
                          {sortKey !== col.key ? (
                            <ArrowUpDown size={13} className="text-zinc-400" />
                          ) : sortDirection === 'asc' ? (
                            <ArrowUp size={13} className="text-orange-500" />
                          ) : (
                            <ArrowDown size={13} className="text-orange-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}

                {rowActions && <th className="py-3 px-4 w-16 text-right font-bold text-zinc-500 dark:text-zinc-400">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const isSelected = selectedIds.includes(String(row.id));
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors last:border-0 dark:border-zinc-800/60 dark:hover:bg-zinc-900/30 ${
                      isSelected ? 'bg-orange-50/20 dark:bg-orange-950/10' : ''
                    }`}
                  >
                    {onSelectionChange && (
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(String(row.id), e.target.checked)}
                          className="accent-orange-600 rounded"
                        />
                      </td>
                    )}

                    {visibleColumns.map((col) => (
                      <td key={col.key} className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}

                    {rowActions && <td className="py-3.5 px-4 text-right">{rowActions(row)}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && data.length > 0 && <AppPagination totalItems={totalItems} />}
    </div>
  );
}

export default AppDataTable;

'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import Button from '@/components/ui/Button';
import { AdminPagination } from './AdminPagination';
import { AdminSearchInput } from './AdminSearchInput';
import Link from 'next/link';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalCount: number;
  page: number;
  pageSize: number;
  basePath: string;
  searchPlaceholder?: string;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onDelete?: (item: T) => void;
  idKey?: keyof T;
  createLabel?: string;
}

export function AdminTable<T extends Record<string, any>>({
  data,
  columns,
  totalCount,
  page,
  pageSize,
  basePath,
  searchPlaceholder = 'Search...',
  sortKey,
  sortDirection = 'desc',
  onDelete,
  idKey = 'id' as keyof T,
  createLabel = 'Create New',
}: AdminTableProps<T>) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const buildUrl = (params: Record<string, string | number>) => {
    const url = new URL(basePath, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, String(value));
    });
    return url.pathname + url.search;
  };

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    window.location.href = buildUrl({ page: 1, sortKey: key, sortDirection: newDirection });
  };

  const handleSearch = (query: string) => {
    window.location.href = buildUrl({ page: 1, search: query });
  };

  const handlePageChange = (newPage: number) => {
    window.location.href = buildUrl({ page: newPage, sortKey: sortKey || '', sortDirection });
  };

  const handleDelete = async (item: T) => {
    if (deleteConfirm === item[idKey]) {
      onDelete?.(item);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(item[idKey]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <AdminSearchInput
          placeholder={searchPlaceholder}
          onSearch={handleSearch}
        />
        <Link href={`${basePath}/new`}>
          <Button size="small">{createLabel}</Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white',
                    col.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                    col.width
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-32 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={String(item[idKey]) || index}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {col.render ? col.render(item) : String(item[col.key] ?? '-')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`${basePath}/${item[idKey]}`}>
                        <Button size="small" mode="ghost">
                          Edit
                        </Button>
                      </Link>
                      {onDelete && (
                        <Button
                          size="small"
                          mode="ghost"
                          className={deleteConfirm === item[idKey] ? 'text-red-600' : ''}
                          onPress={() => handleDelete(item)}
                        >
                          {deleteConfirm === item[idKey] ? 'Confirm?' : 'Delete'}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

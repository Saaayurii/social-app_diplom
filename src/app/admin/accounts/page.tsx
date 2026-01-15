'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { AdminSearchInput } from '@/components/admin/AdminSearchInput';
import { cn } from '@/lib/cn';

interface Account {
  id: string;
  provider: string;
  type: string;
  user: { id: string; email: string | null; username: string | null };
}

interface ApiResponse {
  data: Account[];
  pagination: { page: number; pageSize: number; totalCount: number; totalPages: number };
}

export default function AccountsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<Account[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;
  const search = searchParams.get('search') || '';
  const sortKey = searchParams.get('sortKey') || 'id';
  const sortDirection = searchParams.get('sortDirection') || 'desc';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), search, sortKey, sortDirection });
      const res = await fetch(`/api/admin/accounts?${params}`);
      const json: ApiResponse = await res.json();
      setData(json.data);
      setTotalCount(json.pagination.totalCount);
    } catch (e) {
      console.error('Failed to fetch accounts', e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortKey, sortDirection]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const buildUrl = (params: Record<string, string | number>) => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => { if (value) url.set(key, String(value)); });
    return `/admin/accounts?${url.toString()}`;
  };

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    router.push(buildUrl({ page: 1, sortKey: key, sortDirection: newDirection, search }));
  };

  const handleSearch = (query: string) => router.push(buildUrl({ page: 1, search: query, sortKey, sortDirection }));
  const handlePageChange = (newPage: number) => router.push(buildUrl({ page: newPage, sortKey, sortDirection, search }));

  const handleDelete = async (item: Account) => {
    if (deleteConfirm === item.id) {
      try { await fetch(`/api/admin/accounts/${item.id}`, { method: 'DELETE' }); fetchData(); } catch (e) { console.error(e); }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(item.id);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const columns = [
    { key: 'id', label: 'ID', width: 'w-32' },
    { key: 'provider', label: 'Провайдер', sortable: true },
    { key: 'type', label: 'Тип' },
    { key: 'user', label: 'Пользователь' },
  ];

  if (loading) return <div className="flex items-center justify-center py-12"><div className="text-gray-500 dark:text-gray-400">Загрузка...</div></div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Аккаунты (OAuth)</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <AdminSearchInput placeholder="Поиск аккаунтов..." onSearch={handleSearch} />
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={cn('px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white', col.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700', col.width)} onClick={() => col.sortable && handleSort(col.key)}>
                    <div className="flex items-center gap-2">{col.label}{col.sortable && sortKey === col.key && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}</div>
                  </th>
                ))}
                <th className="w-32 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {data.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Данные не найдены</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"><span className="font-mono text-xs">{item.id.slice(0, 8)}...</span></td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.provider}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.user?.email || item.user?.username || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/accounts/${item.id}`}><Button size="small" mode="ghost">Изменить</Button></Link>
                        <Button size="small" mode="ghost" className={deleteConfirm === item.id ? 'text-red-600' : ''} onPress={() => handleDelete(item)}>{deleteConfirm === item.id ? 'Подтвердить?' : 'Удалить'}</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination page={page} totalPages={totalPages} totalCount={totalCount} pageSize={pageSize} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

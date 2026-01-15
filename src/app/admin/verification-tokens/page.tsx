'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { cn } from '@/lib/cn';

interface Token {
  identifier: string;
  token: string;
  expires: string;
}

interface ApiResponse {
  data: Token[];
  pagination: { page: number; pageSize: number; totalCount: number; totalPages: number };
}

export default function VerificationTokensPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<Token[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;
  const sortKey = searchParams.get('sortKey') || 'expires';
  const sortDirection = searchParams.get('sortDirection') || 'desc';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), sortKey, sortDirection });
      const res = await fetch(`/api/admin/verification-tokens?${params}`);
      const json: ApiResponse = await res.json();
      setData(json.data);
      setTotalCount(json.pagination.totalCount);
    } catch (e) { console.error('Failed to fetch', e); }
    finally { setLoading(false); }
  }, [page, pageSize, sortKey, sortDirection]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const buildUrl = (params: Record<string, string | number>) => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => { if (value) url.set(key, String(value)); });
    return `/admin/verification-tokens?${url.toString()}`;
  };

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    router.push(buildUrl({ page: 1, sortKey: key, sortDirection: newDirection }));
  };

  const handlePageChange = (newPage: number) => router.push(buildUrl({ page: newPage, sortKey, sortDirection }));

  const handleDelete = async (item: Token) => {
    if (deleteConfirm === item.token) {
      try { await fetch(`/api/admin/verification-tokens/${encodeURIComponent(item.token)}`, { method: 'DELETE' }); fetchData(); } catch (e) { console.error(e); }
      setDeleteConfirm(null);
    } else { setDeleteConfirm(item.token); }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const columns = [
    { key: 'identifier', label: 'Идентификатор', sortable: true },
    { key: 'token', label: 'Токен' },
    { key: 'expires', label: 'Истекает', sortable: true },
    { key: 'status', label: 'Статус' },
  ];

  if (loading) return <div className="flex items-center justify-center py-12"><div className="text-gray-500 dark:text-gray-400">Загрузка...</div></div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Токены верификации</h1>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={cn('px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white', col.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700')} onClick={() => col.sortable && handleSort(col.key)}>
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
                  <tr key={item.token} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.identifier}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"><span className="font-mono text-xs">{item.token.slice(0, 20)}...</span></td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{new Date(item.expires).toLocaleString('ru-RU')}</td>
                    <td className="px-4 py-3 text-sm">{new Date(item.expires) > new Date() ? <span className="text-green-600">Действителен</span> : <span className="text-red-600">Истек</span>}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/verification-tokens/${encodeURIComponent(item.token)}`}><Button size="small" mode="ghost">Изменить</Button></Link>
                        <Button size="small" mode="ghost" className={deleteConfirm === item.token ? 'text-red-600' : ''} onPress={() => handleDelete(item)}>{deleteConfirm === item.token ? 'Подтвердить?' : 'Удалить'}</Button>
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

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { cn } from '@/lib/cn';

interface PostLike {
  id: number;
  postId: number;
  createdAt: string;
  user: { id: string; username: string | null };
  post: { id: number; content: string | null };
}

interface ApiResponse {
  data: PostLike[];
  pagination: { page: number; pageSize: number; totalCount: number; totalPages: number };
}

export default function PostLikesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<PostLike[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;
  const sortKey = searchParams.get('sortKey') || 'id';
  const sortDirection = searchParams.get('sortDirection') || 'desc';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), sortKey, sortDirection });
      const res = await fetch(`/api/admin/post-likes?${params}`);
      const json: ApiResponse = await res.json();
      setData(json.data);
      setTotalCount(json.pagination.totalCount);
    } catch (e) {
      console.error('Failed to fetch post likes', e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortKey, sortDirection]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const buildUrl = (params: Record<string, string | number>) => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => { if (value) url.set(key, String(value)); });
    return `/admin/post-likes?${url.toString()}`;
  };

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    router.push(buildUrl({ page: 1, sortKey: key, sortDirection: newDirection }));
  };

  const handlePageChange = (newPage: number) => router.push(buildUrl({ page: newPage, sortKey, sortDirection }));

  const handleDelete = async (item: PostLike) => {
    if (deleteConfirm === item.id) {
      try { await fetch(`/api/admin/post-likes/${item.id}`, { method: 'DELETE' }); fetchData(); } catch (e) { console.error(e); }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(item.id);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const columns = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'user', label: 'Пользователь' },
    { key: 'postId', label: 'ID поста', sortable: true },
    { key: 'post', label: 'Содержимое поста' },
    { key: 'createdAt', label: 'Создан', sortable: true },
  ];

  if (loading) return <div className="flex items-center justify-center py-12"><div className="text-gray-500 dark:text-gray-400">Загрузка...</div></div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Лайки постов</h1>
      <div className="space-y-4">
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
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.user?.username || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.postId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"><span className="line-clamp-1 max-w-xs">{item.post?.content || '-'}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{new Date(item.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/post-likes/${item.id}`}><Button size="small" mode="ghost">Изменить</Button></Link>
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

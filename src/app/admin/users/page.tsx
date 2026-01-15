'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { AdminSearchInput } from '@/components/admin/AdminSearchInput';
import { cn } from '@/lib/cn';

interface User {
  id: string;
  username: string | null;
  email: string | null;
  name: string | null;
  _count: {
    post: number;
    followers: number;
  };
}

interface ApiResponse {
  data: User[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function UsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<User[]>([]);
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
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
        sortKey,
        sortDirection,
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const json: ApiResponse = await res.json();
      setData(json.data);
      setTotalCount(json.pagination.totalCount);
    } catch (e) {
      console.error('Failed to fetch users', e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortKey, sortDirection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const buildUrl = (params: Record<string, string | number>) => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.set(key, String(value));
    });
    return `/admin/users?${url.toString()}`;
  };

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    router.push(buildUrl({ page: 1, sortKey: key, sortDirection: newDirection, search }));
  };

  const handleSearch = (query: string) => {
    router.push(buildUrl({ page: 1, search: query, sortKey, sortDirection }));
  };

  const handlePageChange = (newPage: number) => {
    router.push(buildUrl({ page: newPage, sortKey, sortDirection, search }));
  };

  const handleDelete = async (user: User) => {
    if (deleteConfirm === user.id) {
      try {
        await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
        fetchData();
      } catch (e) {
        console.error('Failed to delete user', e);
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(user.id);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const columns = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-24' },
    { key: 'username', label: 'Логин', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'name', label: 'Имя', sortable: true },
    { key: '_count.post', label: 'Посты' },
    { key: '_count.followers', label: 'Подписчики' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Пользователи</h1>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <AdminSearchInput
            placeholder="Поиск пользователей..."
            onSearch={handleSearch}
          />
          <Link href="/admin/users/new">
            <Button size="small">Создать пользователя</Button>
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white',
                      col.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                      col.width
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
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
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    Данные не найдены
                  </td>
                </tr>
              ) : (
                data.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user.username || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user.email || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user._count.post}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user._count.followers}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button size="small" mode="ghost">Изменить</Button>
                        </Link>
                        <Button
                          size="small"
                          mode="ghost"
                          className={deleteConfirm === user.id ? 'text-red-600' : ''}
                          onPress={() => handleDelete(user)}
                        >
                          {deleteConfirm === user.id ? 'Подтвердить?' : 'Удалить'}
                        </Button>
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
    </div>
  );
}

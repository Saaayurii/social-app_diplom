import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { User } from '@prisma/client';

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    sortKey?: string;
    sortDirection?: string;
  };
}

export default async function UsersPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const search = searchParams.search || '';
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const where = search
    ? {
        OR: [
          { username: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        _count: {
          select: { post: true, followers: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const columns: Column<typeof users[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-24' },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    {
      key: '_count',
      label: 'Posts',
      render: (user) => user._count.post,
    },
    {
      key: 'followers',
      label: 'Followers',
      render: (user) => user._count.followers,
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
      <AdminTable
        data={users}
        columns={columns}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        basePath="/admin/users"
        searchPlaceholder="Search users..."
        sortKey={sortKey}
        sortDirection={sortDirection}
        createLabel="Create User"
      />
    </div>
  );
}

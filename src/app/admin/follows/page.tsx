import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; search?: string; sortKey?: string; sortDirection?: string };
}

export default async function FollowsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const search = searchParams.search || '';
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const where = search ? { OR: [{ follower: { username: { contains: search, mode: 'insensitive' as const } } }, { following: { username: { contains: search, mode: 'insensitive' as const } } }] } : {};

  const [follows, totalCount] = await Promise.all([
    prisma.follow.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        follower: { select: { id: true, username: true } },
        following: { select: { id: true, username: true } },
      },
    }),
    prisma.follow.count({ where }),
  ]);

  const columns: Column<typeof follows[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'follower', label: 'Follower', render: (f) => f.follower?.username || '-' },
    { key: 'following', label: 'Following', render: (f) => f.following?.username || '-' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Follows</h1>
      <AdminTable data={follows} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/follows" searchPlaceholder="Search users..." sortKey={sortKey} sortDirection={sortDirection} createLabel="" />
    </div>
  );
}

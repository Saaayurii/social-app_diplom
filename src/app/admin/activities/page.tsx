import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; sortKey?: string; sortDirection?: string };
}

export default async function ActivitiesPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const [activities, totalCount] = await Promise.all([
    prisma.activity.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        sourceUser: { select: { id: true, username: true } },
        targetUser: { select: { id: true, username: true } },
      },
    }),
    prisma.activity.count(),
  ]);

  const columns: Column<typeof activities[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'sourceUser', label: 'Source User', render: (a) => a.sourceUser?.username || '-' },
    { key: 'targetUser', label: 'Target User', render: (a) => a.targetUser?.username || '-' },
    { key: 'isNotificationRead', label: 'Read', render: (a) => a.isNotificationRead ? 'Yes' : 'No' },
    { key: 'createdAt', label: 'Created', sortable: true, render: (a) => new Date(a.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Activities</h1>
      <AdminTable data={activities} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/activities" sortKey={sortKey} sortDirection={sortDirection} createLabel="" />
    </div>
  );
}

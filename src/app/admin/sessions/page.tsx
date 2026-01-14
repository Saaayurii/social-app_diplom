import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; sortKey?: string; sortDirection?: string };
}

export default async function SessionsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const sortKey = searchParams.sortKey || 'expires';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const [sessions, totalCount] = await Promise.all([
    prisma.session.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: { user: { select: { id: true, email: true, username: true } } },
    }),
    prisma.session.count(),
  ]);

  const columns: Column<typeof sessions[0]>[] = [
    { key: 'id', label: 'ID', width: 'w-32', render: (s) => <span className="font-mono text-xs">{s.id.slice(0, 8)}...</span> },
    { key: 'user', label: 'User', render: (s) => s.user?.email || s.user?.username || '-' },
    { key: 'expires', label: 'Expires', sortable: true, render: (s) => new Date(s.expires).toLocaleString() },
    { key: 'status', label: 'Status', render: (s) => new Date(s.expires) > new Date() ? <span className="text-green-600">Active</span> : <span className="text-red-600">Expired</span> },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Sessions</h1>
      <AdminTable data={sessions} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/sessions" sortKey={sortKey} sortDirection={sortDirection} createLabel="" />
    </div>
  );
}

import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; search?: string; sortKey?: string; sortDirection?: string };
}

export default async function AccountsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const search = searchParams.search || '';
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const where = search ? { OR: [{ provider: { contains: search, mode: 'insensitive' as const } }, { user: { email: { contains: search, mode: 'insensitive' as const } } }] } : {};

  const [accounts, totalCount] = await Promise.all([
    prisma.account.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: { user: { select: { id: true, email: true, username: true } } },
    }),
    prisma.account.count({ where }),
  ]);

  const columns: Column<typeof accounts[0]>[] = [
    { key: 'id', label: 'ID', width: 'w-32', render: (a) => <span className="font-mono text-xs">{a.id.slice(0, 8)}...</span> },
    { key: 'provider', label: 'Provider', sortable: true },
    { key: 'type', label: 'Type' },
    { key: 'user', label: 'User', render: (a) => a.user?.email || a.user?.username || '-' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Accounts (OAuth)</h1>
      <AdminTable data={accounts} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/accounts" searchPlaceholder="Search accounts..." sortKey={sortKey} sortDirection={sortDirection} createLabel="" />
    </div>
  );
}

import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; sortKey?: string; sortDirection?: string };
}

export default async function VerificationTokensPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const sortKey = searchParams.sortKey || 'expires';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const [tokens, totalCount] = await Promise.all([
    prisma.verificationToken.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
    }),
    prisma.verificationToken.count(),
  ]);

  const columns: Column<typeof tokens[0]>[] = [
    { key: 'identifier', label: 'Identifier', sortable: true },
    { key: 'token', label: 'Token', render: (t) => <span className="font-mono text-xs">{t.token.slice(0, 20)}...</span> },
    { key: 'expires', label: 'Expires', sortable: true, render: (t) => new Date(t.expires).toLocaleString() },
    { key: 'status', label: 'Status', render: (t) => new Date(t.expires) > new Date() ? <span className="text-green-600">Valid</span> : <span className="text-red-600">Expired</span> },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Verification Tokens</h1>
      <AdminTable data={tokens} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/verification-tokens" sortKey={sortKey} sortDirection={sortDirection} createLabel="" idKey="token" />
    </div>
  );
}

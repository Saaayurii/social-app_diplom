import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; sortKey?: string; sortDirection?: string };
}

export default async function ConversationsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const [conversations, totalCount] = await Promise.all([
    prisma.conversation.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        participants: { include: { user: { select: { id: true, username: true } } } },
        _count: { select: { messages: true } },
      },
    }),
    prisma.conversation.count(),
  ]);

  const columns: Column<typeof conversations[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'participants', label: 'Participants', render: (c) => c.participants.map(p => p.user?.username).filter(Boolean).join(', ') || '-' },
    { key: 'messages', label: 'Messages', render: (c) => c._count.messages },
    { key: 'createdAt', label: 'Created', sortable: true, render: (c) => new Date(c.createdAt).toLocaleDateString() },
    { key: 'updatedAt', label: 'Updated', sortable: true, render: (c) => new Date(c.updatedAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Conversations</h1>
      <AdminTable data={conversations} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/conversations" sortKey={sortKey} sortDirection={sortDirection} createLabel="" />
    </div>
  );
}

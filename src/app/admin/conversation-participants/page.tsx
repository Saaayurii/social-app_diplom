import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; sortKey?: string; sortDirection?: string };
}

export default async function ConversationParticipantsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const [participants, totalCount] = await Promise.all([
    prisma.conversationParticipant.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        user: { select: { id: true, username: true } },
        conversation: { select: { id: true } },
      },
    }),
    prisma.conversationParticipant.count(),
  ]);

  const columns: Column<typeof participants[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'conversationId', label: 'Conversation ID', sortable: true },
    { key: 'user', label: 'User', render: (p) => p.user?.username || '-' },
    { key: 'lastReadAt', label: 'Last Read', sortable: true, render: (p) => new Date(p.lastReadAt).toLocaleString() },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Conversation Participants</h1>
      <AdminTable data={participants} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/conversation-participants" sortKey={sortKey} sortDirection={sortDirection} createLabel="" />
    </div>
  );
}

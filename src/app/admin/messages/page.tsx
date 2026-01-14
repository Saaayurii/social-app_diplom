import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; search?: string; sortKey?: string; sortDirection?: string };
}

export default async function MessagesPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const search = searchParams.search || '';
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const where = search ? { content: { contains: search, mode: 'insensitive' as const } } : {};

  const [messages, totalCount] = await Promise.all([
    prisma.message.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        sender: { select: { id: true, username: true } },
        conversation: { select: { id: true } },
      },
    }),
    prisma.message.count({ where }),
  ]);

  const columns: Column<typeof messages[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'content', label: 'Content', render: (m) => <span className="line-clamp-2 max-w-md">{m.content}</span> },
    { key: 'sender', label: 'Sender', render: (m) => m.sender?.username || '-' },
    { key: 'conversationId', label: 'Conv. ID', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true, render: (m) => new Date(m.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
      <AdminTable data={messages} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/messages" searchPlaceholder="Search messages..." sortKey={sortKey} sortDirection={sortDirection} createLabel="" />
    </div>
  );
}

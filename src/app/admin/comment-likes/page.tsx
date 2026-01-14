import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; sortKey?: string; sortDirection?: string };
}

export default async function CommentLikesPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const [likes, totalCount] = await Promise.all([
    prisma.commentLike.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        user: { select: { id: true, username: true } },
        comment: { select: { id: true, content: true } },
      },
    }),
    prisma.commentLike.count(),
  ]);

  const columns: Column<typeof likes[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'user', label: 'User', render: (l) => l.user?.username || '-' },
    { key: 'commentId', label: 'Comment ID', sortable: true },
    { key: 'comment', label: 'Comment', render: (l) => <span className="line-clamp-1 max-w-xs">{l.comment?.content || '-'}</span> },
    { key: 'createdAt', label: 'Created', sortable: true, render: (l) => new Date(l.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Comment Likes</h1>
      <AdminTable data={likes} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/comment-likes" sortKey={sortKey} sortDirection={sortDirection} createLabel="" />
    </div>
  );
}

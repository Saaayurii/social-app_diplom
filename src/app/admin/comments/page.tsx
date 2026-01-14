import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; search?: string; sortKey?: string; sortDirection?: string };
}

export default async function CommentsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const search = searchParams.search || '';
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const where = search ? { content: { contains: search, mode: 'insensitive' as const } } : {};

  const [comments, totalCount] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        user: { select: { id: true, username: true } },
        post: { select: { id: true } },
        _count: { select: { commentLikes: true, replies: true } },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  const columns: Column<typeof comments[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'content', label: 'Content', render: (c) => <span className="line-clamp-2 max-w-md">{c.content}</span> },
    { key: 'user', label: 'Author', render: (c) => c.user?.username || '-' },
    { key: 'postId', label: 'Post ID', sortable: true },
    { key: 'likes', label: 'Likes', render: (c) => c._count.commentLikes },
    { key: 'replies', label: 'Replies', render: (c) => c._count.replies },
    { key: 'createdAt', label: 'Created', sortable: true, render: (c) => new Date(c.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Comments</h1>
      <AdminTable data={comments} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/comments" searchPlaceholder="Search comments..." sortKey={sortKey} sortDirection={sortDirection} />
    </div>
  );
}

import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; search?: string; sortKey?: string; sortDirection?: string };
}

export default async function PostsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const search = searchParams.search || '';
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const where = search
    ? {
        OR: [
          { content: { contains: search, mode: 'insensitive' as const } },
          { user: { username: { contains: search, mode: 'insensitive' as const } } },
        ],
      }
    : {};

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        user: { select: { id: true, username: true } },
        _count: { select: { postLikes: true, comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  const columns: Column<typeof posts[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    {
      key: 'content',
      label: 'Content',
      render: (post) => (
        <span className="line-clamp-2 max-w-md">{post.content || '-'}</span>
      ),
    },
    {
      key: 'user',
      label: 'Author',
      render: (post) => post.user?.username || '-',
    },
    { key: 'likes', label: 'Likes', render: (post) => post._count.postLikes },
    { key: 'comments', label: 'Comments', render: (post) => post._count.comments },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (post) => new Date(post.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
      <AdminTable
        data={posts}
        columns={columns}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        basePath="/admin/posts"
        searchPlaceholder="Search posts..."
        sortKey={sortKey}
        sortDirection={sortDirection}
        createLabel="Create Post"
      />
    </div>
  );
}

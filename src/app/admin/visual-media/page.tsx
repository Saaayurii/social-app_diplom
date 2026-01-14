import prisma from '@/lib/prisma/prisma';
import { AdminTable, Column } from '@/components/admin/AdminTable';

interface PageProps {
  searchParams: { page?: string; sortKey?: string; sortDirection?: string };
}

export default async function VisualMediaPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const sortKey = searchParams.sortKey || 'id';
  const sortDirection = (searchParams.sortDirection || 'desc') as 'asc' | 'desc';

  const [media, totalCount] = await Promise.all([
    prisma.visualMedia.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        user: { select: { id: true, username: true } },
        post: { select: { id: true } },
      },
    }),
    prisma.visualMedia.count(),
  ]);

  const columns: Column<typeof media[0]>[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'fileName', label: 'File Name', render: (m) => <span className="font-mono text-xs">{m.fileName}</span> },
    { key: 'user', label: 'User', render: (m) => m.user?.username || '-' },
    { key: 'postId', label: 'Post ID', sortable: true },
    { key: 'uploadedAt', label: 'Uploaded', sortable: true, render: (m) => new Date(m.uploadedAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Visual Media</h1>
      <AdminTable data={media} columns={columns} totalCount={totalCount} page={page} pageSize={pageSize} basePath="/admin/visual-media" sortKey={sortKey} sortDirection={sortDirection} createLabel="" />
    </div>
  );
}

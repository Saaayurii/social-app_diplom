import prisma from '@/lib/prisma/prisma';
import { AdminStats } from '@/components/admin/AdminStats';

async function getStats() {
  const [
    totalUsers,
    totalPosts,
    totalComments,
    totalConversations,
    totalMessages,
    totalFollows,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.follow.count(),
  ]);

  return {
    totalUsers,
    totalPosts,
    totalComments,
    totalConversations,
    totalMessages,
    totalFollows,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Панель управления
      </h1>

      <AdminStats stats={stats} />
    </div>
  );
}

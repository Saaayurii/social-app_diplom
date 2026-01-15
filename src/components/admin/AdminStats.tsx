interface StatsProps {
  stats: {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
    totalConversations: number;
    totalMessages: number;
    totalFollows: number;
  };
}

const statItems = [
  { key: 'totalUsers', label: 'Пользователи', color: 'bg-blue-500' },
  { key: 'totalPosts', label: 'Посты', color: 'bg-green-500' },
  { key: 'totalComments', label: 'Комментарии', color: 'bg-yellow-500' },
  { key: 'totalConversations', label: 'Диалоги', color: 'bg-purple-500' },
  { key: 'totalMessages', label: 'Сообщения', color: 'bg-pink-500' },
  { key: 'totalFollows', label: 'Подписки', color: 'bg-indigo-500' },
];

export function AdminStats({ stats }: StatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statItems.map((item) => (
        <div
          key={item.key}
          className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-lg ${item.color}`} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats[item.key as keyof typeof stats].toLocaleString('ru-RU')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

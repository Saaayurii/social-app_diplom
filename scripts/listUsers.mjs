import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n📋 Список тестовых пользователей:\n');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      _count: {
        select: {
          post: true,
          followers: true,
          following: true,
        },
      },
    },
    orderBy: {
      username: 'asc',
    },
    take: 20,
  });

  if (users.length === 0) {
    console.log('❌ Пользователи не найдены. Запустите seed скрипт:');
    console.log('   npm run seed:docker');
    return;
  }

  console.log('┌────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ Username              │ Name                │ Posts │ Followers │ Following │');
  console.log('├────────────────────────────────────────────────────────────────────────────┤');

  users.forEach((user) => {
    const username = (user.username || 'N/A').padEnd(21);
    const name = (user.name || 'N/A').substring(0, 19).padEnd(19);
    const posts = String(user._count.post).padStart(5);
    const followers = String(user._count.followers).padStart(9);
    const following = String(user._count.following).padStart(9);

    console.log(
      `│ ${username} │ ${name} │ ${posts} │ ${followers} │ ${following} │`,
    );
  });

  console.log('└────────────────────────────────────────────────────────────────────────────┘');

  const totalUsers = await prisma.user.count();
  console.log(`\n✅ Всего пользователей в базе: ${totalUsers}`);
  console.log(`   Показано первых 20 пользователей (отсортировано по username)\n`);

  if (totalUsers > 0) {
    const stats = await prisma.$transaction([
      prisma.post.count(),
      prisma.follow.count(),
      prisma.postLike.count(),
      prisma.comment.count(),
      prisma.message.count(),
      prisma.activity.count(),
    ]);

    console.log('📊 Статистика базы данных:');
    console.log(`   • Постов: ${stats[0]}`);
    console.log(`   • Подписок: ${stats[1]}`);
    console.log(`   • Лайков на посты: ${stats[2]}`);
    console.log(`   • Комментариев: ${stats[3]}`);
    console.log(`   • Сообщений: ${stats[4]}`);
    console.log(`   • Уведомлений: ${stats[5]}\n`);
  }

  console.log('💡 Для входа используйте email любого пользователя из списка выше\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Ошибка:', e.message);
    await prisma.$disconnect();
    process.exit(1);
  });

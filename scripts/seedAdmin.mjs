import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Создание администратора...');

  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      name: 'Главный Администратор',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Администратор создан:', admin.email);
  console.log('📧 Email: admin@example.com');
  console.log('🔑 Пароль: admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Ошибка создания администратора:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

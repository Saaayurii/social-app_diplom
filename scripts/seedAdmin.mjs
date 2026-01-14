import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Creating admin user...');

  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin created:', admin.email);
  console.log('📧 Email: admin@example.com');
  console.log('🔑 Password: admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error creating admin:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

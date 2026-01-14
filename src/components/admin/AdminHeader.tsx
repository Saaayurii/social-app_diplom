'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface AdminHeaderProps {
  adminEmail: string;
  adminName: string;
}

export function AdminHeader({ adminEmail, adminName }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Welcome, <span className="font-medium">{adminName}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{adminEmail}</span>
        <Button size="small" mode="subtle" onPress={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

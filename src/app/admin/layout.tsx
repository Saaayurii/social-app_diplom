import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getAdminSession } from '@/lib/admin/adminAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Check if this is the login page by looking at referer or just skip redirect for unauthenticated
  if (!session) {
    // Let the middleware handle the redirect, just render children here
    // This allows login page to work
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar role={session.role} />
      <div className="flex flex-1 flex-col">
        <AdminHeader adminEmail={session.email} adminName={session.name} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

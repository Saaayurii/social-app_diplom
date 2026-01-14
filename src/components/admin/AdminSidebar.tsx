'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { AdminRole } from '@prisma/client';

interface MenuItem {
  label: string;
  href: string;
  section?: string;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Users', href: '/admin/users', section: 'users' },
  { label: 'Accounts', href: '/admin/accounts' },
  { label: 'Sessions', href: '/admin/sessions' },
  { label: 'Verification Tokens', href: '/admin/verification-tokens' },
  { label: 'Posts', href: '/admin/posts', section: 'content' },
  { label: 'Post Likes', href: '/admin/post-likes' },
  { label: 'Visual Media', href: '/admin/visual-media' },
  { label: 'Comments', href: '/admin/comments' },
  { label: 'Comment Likes', href: '/admin/comment-likes' },
  { label: 'Follows', href: '/admin/follows', section: 'social' },
  { label: 'Activities', href: '/admin/activities' },
  { label: 'Conversations', href: '/admin/conversations', section: 'messages' },
  { label: 'Participants', href: '/admin/conversation-participants' },
  { label: 'Messages', href: '/admin/messages' },
];

const sections: Record<string, string> = {
  users: 'Users & Auth',
  content: 'Content',
  social: 'Social',
  messages: 'Messaging',
};

interface AdminSidebarProps {
  role: AdminRole;
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  let currentSection = '';

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <Link href="/admin" className="text-xl font-bold text-green-600 dark:text-green-400">
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const showSectionHeader = item.section && item.section !== currentSection;
          if (item.section) currentSection = item.section;

          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <div key={item.href}>
              {showSectionHeader && (
                <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  {sections[item.section!]}
                </div>
              )}
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Role: {role}
        </div>
      </div>
    </aside>
  );
}

'use client';

import { cn } from '@/lib/cn';
import { ProfileWidget } from './sidebar/ProfileWidget';
import { SuggestedUsers } from './sidebar/SuggestedUsers';
import { TrendingPosts } from './sidebar/TrendingPosts';

interface RightSidebarProps {
  className?: string;
}

export function RightSidebar({ className }: RightSidebarProps) {
  return (
    <aside
      className={cn(
        'sticky top-0 h-screen w-[320px] overflow-y-auto p-4',
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <ProfileWidget />
        <SuggestedUsers />
        <TrendingPosts />
      </div>
    </aside>
  );
}

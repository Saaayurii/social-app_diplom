'use client';

import { useSessionUserData } from '@/hooks/useSessionUserData';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import Link from 'next/link';

export function ProfileWidget() {
  const [user] = useSessionUserData();

  if (!user) {
    return (
      <div className="rounded-2xl bg-card p-4">
        <div className="animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="flex-1">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="mt-2 h-3 w-16 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex-shrink-0">
          <ProfilePhoto
            name={user.name}
            username={user.username}
            photoUrl={user.profilePhoto}
          />
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/${user.username}`} className="link">
            <h3 className="truncate font-semibold text-foreground">{user.name}</h3>
          </Link>
          <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <div className="mt-3 flex justify-around border-t border-border pt-3">
        <Link href={`/${user.username}/followers`} className="link text-center">
          <p className="font-bold">{user.followerCount || 0}</p>
          <p className="text-xs text-muted-foreground">Подписчики</p>
        </Link>
        <Link href={`/${user.username}/following`} className="link text-center">
          <p className="font-bold">{user.followingCount || 0}</p>
          <p className="text-xs text-muted-foreground">Подписки</p>
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUser } from '@/types/definitions';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useFollowsMutations } from '@/hooks/mutations/useFollowsMutations';
import { useUserQuery } from '@/hooks/queries/useUserQuery';

function SuggestedUserItem({ userId }: { userId: string }) {
  const { data: user } = useUserQuery(userId);
  const { followMutation, unFollowMutation } = useFollowsMutations({ targetUserId: userId });

  if (!user) return null;

  const handleFollowClick = () => {
    if (user.isFollowing) {
      unFollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link href={`/${user.username}`} className="h-10 w-10 flex-shrink-0">
        <ProfilePhoto
          name={user.name}
          username={user.username}
          photoUrl={user.profilePhoto}
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/${user.username}`} className="link">
          <p className="truncate text-sm font-semibold">{user.name}</p>
        </Link>
        <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
      </div>
      <Button
        onPress={handleFollowClick}
        mode={user.isFollowing ? 'secondary' : 'primary'}
        size="small"
        loading={followMutation.isPending || unFollowMutation.isPending}
      >
        {user.isFollowing ? 'Отписаться' : 'Подписаться'}
      </Button>
    </div>
  );
}

export function SuggestedUsers() {
  const qc = useQueryClient();

  const { data: users, isPending, isError } = useQuery<GetUser[]>({
    queryKey: ['suggested-users'],
    queryFn: async () => {
      const res = await fetch('/api/users?limit=5');
      if (!res.ok) throw new Error('Failed to fetch users');
      const users = await res.json();

      // Cache each user for later use
      for (const user of users) {
        qc.setQueryData(['users', user.id], user);
      }

      return users;
    },
    staleTime: 60000 * 5, // 5 minutes
  });

  if (isPending) {
    return (
      <div className="rounded-2xl bg-card p-4">
        <h3 className="mb-3 font-bold text-foreground">Кого подписаться</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="mt-1 h-2 w-14 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !users?.length) return null;

  return (
    <div className="rounded-2xl bg-card p-4">
      <h3 className="mb-3 font-bold text-foreground">Кого подписаться</h3>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <SuggestedUserItem key={user.id} userId={user.id} />
        ))}
      </div>
      <Link
        href="/discover"
        className="link mt-3 block text-sm text-primary hover:text-primary/80"
      >
        Показать больше
      </Link>
    </div>
  );
}

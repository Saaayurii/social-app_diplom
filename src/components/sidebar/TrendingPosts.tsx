'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetPost } from '@/types/definitions';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import Link from 'next/link';
import { Heart, Comment } from '@/svg_components';

export function TrendingPosts() {
  const qc = useQueryClient();

  const { data: posts, isPending, isError } = useQuery<GetPost[]>({
    queryKey: ['trending-posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts/trending?limit=3');
      if (!res.ok) throw new Error('Failed to fetch trending posts');
      const posts = await res.json();

      // Cache each post for later use
      for (const post of posts) {
        qc.setQueryData(['posts', post.id], post);
      }

      return posts;
    },
    staleTime: 60000 * 5, // 5 minutes
  });

  if (isPending) {
    return (
      <div className="rounded-2xl bg-card p-4">
        <h3 className="mb-3 font-bold text-foreground">Популярное</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse items-start gap-2">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="mt-1 h-2 w-full rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !posts?.length) return null;

  return (
    <div className="rounded-2xl bg-card p-4">
      <h3 className="mb-3 font-bold text-foreground">Популярное</h3>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block rounded-lg p-2 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-start gap-2">
              <div className="h-8 w-8 flex-shrink-0">
                <ProfilePhoto
                  name={post.user.name}
                  username={post.user.username}
                  photoUrl={post.user.profilePhoto}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{post.user.name}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {post.content || 'Фото/видео'}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {post._count.postLikes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Comment className="h-3 w-3" />
                    {post._count.comments}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

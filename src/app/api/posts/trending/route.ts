import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { selectPost } from '@/lib/prisma/selectPost';
import { toGetPost } from '@/lib/prisma/toGetPost';
import { NextResponse } from 'next/server';
import { GetPost } from '@/types/definitions';

export async function GET(request: Request) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  // Get posts from the last 7 days, ordered by likes count
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const res = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    orderBy: {
      postLikes: {
        _count: 'desc',
      },
    },
    take: limit,
    select: selectPost(user.id),
  });

  const postsPromises = res.map(toGetPost);
  const posts = await Promise.all(postsPromises);

  return NextResponse.json<GetPost[]>(posts);
}

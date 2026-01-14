import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canModify } from '@/lib/admin/adminAuth';
import { z } from 'zod';

const createPostSchema = z.object({
  content: z.string().optional(),
  userId: z.string(),
});

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const search = searchParams.get('search') || '';
  const sortKey = searchParams.get('sortKey') || 'id';
  const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';

  const where = search
    ? {
        OR: [
          { content: { contains: search, mode: 'insensitive' as const } },
          { user: { username: { contains: search, mode: 'insensitive' as const } } },
        ],
      }
    : {};

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        user: { select: { id: true, username: true, name: true } },
        _count: { select: { postLikes: true, comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    data: posts,
    pagination: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
  });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session || !canModify(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = createPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 });
    }

    const post = await prisma.post.create({ data: result.data });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

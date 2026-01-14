import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canModify } from '@/lib/admin/adminAuth';
import { z } from 'zod';

const createCommentSchema = z.object({
  content: z.string().min(1),
  userId: z.string(),
  postId: z.number(),
  parentId: z.number().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const search = searchParams.get('search') || '';
  const sortKey = searchParams.get('sortKey') || 'id';
  const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';

  const where = search ? { content: { contains: search, mode: 'insensitive' as const } } : {};

  const [comments, totalCount] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        user: { select: { id: true, username: true } },
        post: { select: { id: true } },
        _count: { select: { commentLikes: true, replies: true } },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return NextResponse.json({
    data: comments,
    pagination: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
  });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session || !canModify(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const result = createCommentSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Validation failed' }, { status: 400 });

    const comment = await prisma.comment.create({ data: result.data });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

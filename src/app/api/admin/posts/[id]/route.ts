import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canModify, canDelete } from '@/lib/admin/adminAuth';
import { z } from 'zod';

const updatePostSchema = z.object({
  content: z.string().optional().nullable(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      user: { select: { id: true, username: true, name: true } },
      _count: { select: { postLikes: true, comments: true, visualMedia: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canModify(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = updatePostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id: parseInt(params.id) },
      data: result.data,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canDelete(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.post.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

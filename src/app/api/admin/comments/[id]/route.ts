import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canModify, canDelete } from '@/lib/admin/adminAuth';
import { z } from 'zod';

const updateCommentSchema = z.object({ content: z.string().optional() });

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      user: { select: { id: true, username: true } },
      post: { select: { id: true } },
      _count: { select: { commentLikes: true, replies: true } },
    },
  });

  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(comment);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canModify(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const result = updateCommentSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Validation failed' }, { status: 400 });

    const comment = await prisma.comment.update({ where: { id: parseInt(params.id) }, data: result.data });
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canDelete(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await prisma.comment.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

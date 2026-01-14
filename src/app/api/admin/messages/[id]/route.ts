import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canDelete, canModify } from '@/lib/admin/adminAuth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const message = await prisma.message.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      sender: { select: { id: true, username: true, email: true } },
      conversation: { select: { id: true } },
    },
  });

  if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(message);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canModify(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const message = await prisma.message.update({
      where: { id: parseInt(params.id) },
      data: { content: body.content },
    });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canDelete(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await prisma.message.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

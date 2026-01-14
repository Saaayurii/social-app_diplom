import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canDelete } from '@/lib/admin/adminAuth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const conversation = await prisma.conversation.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      participants: { include: { user: { select: { id: true, username: true } } } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { sender: { select: { id: true, username: true } } },
      },
      _count: { select: { messages: true } },
    },
  });

  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(conversation);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canDelete(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await prisma.conversation.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

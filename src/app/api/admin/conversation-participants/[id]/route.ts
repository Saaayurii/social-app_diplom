import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canDelete } from '@/lib/admin/adminAuth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const participant = await prisma.conversationParticipant.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      user: { select: { id: true, username: true, email: true } },
      conversation: { select: { id: true, createdAt: true } },
    },
  });

  if (!participant) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(participant);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canDelete(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await prisma.conversationParticipant.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

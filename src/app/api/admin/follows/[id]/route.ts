import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canDelete } from '@/lib/admin/adminAuth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const follow = await prisma.follow.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      follower: { select: { id: true, username: true, email: true } },
      following: { select: { id: true, username: true, email: true } },
    },
  });

  if (!follow) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(follow);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canDelete(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await prisma.follow.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

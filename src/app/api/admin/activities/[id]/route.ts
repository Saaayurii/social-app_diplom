import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canDelete, canModify } from '@/lib/admin/adminAuth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const activity = await prisma.activity.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      sourceUser: { select: { id: true, username: true } },
      targetUser: { select: { id: true, username: true } },
    },
  });

  if (!activity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(activity);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canModify(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const activity = await prisma.activity.update({
      where: { id: parseInt(params.id) },
      data: {
        isNotificationActive: body.isNotificationActive,
        isNotificationRead: body.isNotificationRead,
      },
    });
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session || !canDelete(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await prisma.activity.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canDelete } from '@/lib/admin/adminAuth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sess = await prisma.session.findUnique({
    where: { id: params.id },
    include: { user: { select: { id: true, email: true, username: true } } },
  });

  if (!sess) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(sess);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const adminSession = await getAdminSession();
  if (!adminSession || !canDelete(adminSession.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await prisma.session.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

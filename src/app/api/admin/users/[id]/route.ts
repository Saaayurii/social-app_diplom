import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession, canModify, canDelete } from '@/lib/admin/adminAuth';
import { z } from 'zod';

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'NONBINARY']).optional().nullable(),
  relationshipStatus: z.enum(['SINGLE', 'IN_A_RELATIONSHIP', 'ENGAGED', 'MARRIED']).optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          post: true,
          followers: true,
          following: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session || !canModify(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session || !canDelete(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

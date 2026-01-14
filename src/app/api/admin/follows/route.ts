import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession } from '@/lib/admin/adminAuth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const search = searchParams.get('search') || '';
  const sortKey = searchParams.get('sortKey') || 'id';
  const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';

  const where = search ? { OR: [{ follower: { username: { contains: search, mode: 'insensitive' as const } } }, { following: { username: { contains: search, mode: 'insensitive' as const } } }] } : {};

  const [follows, totalCount] = await Promise.all([
    prisma.follow.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
      include: {
        follower: { select: { id: true, username: true } },
        following: { select: { id: true, username: true } },
      },
    }),
    prisma.follow.count({ where }),
  ]);

  return NextResponse.json({ data: follows, pagination: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) } });
}

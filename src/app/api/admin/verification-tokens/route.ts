import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getAdminSession } from '@/lib/admin/adminAuth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const sortKey = searchParams.get('sortKey') || 'expires';
  const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';

  const [tokens, totalCount] = await Promise.all([
    prisma.verificationToken.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortKey]: sortDirection },
    }),
    prisma.verificationToken.count(),
  ]);

  return NextResponse.json({ data: tokens, pagination: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) } });
}

import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { toGetMessage } from '@/lib/prisma/toGetMessage';
import { FindMessageResult, GetMessage } from '@/types/definitions';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;
  const conversationId = parseInt(params.conversationId, 10);

  // Verify user is participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId },
    },
  });

  if (!participant) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const cursor = searchParams.get('cursor');
  const sortDirection =
    (searchParams.get('sort-direction') as 'asc' | 'desc') || 'desc';

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      ...(cursor && {
        id: sortDirection === 'desc' ? { lt: parseInt(cursor, 10) } : { gt: parseInt(cursor, 10) },
      }),
    },
    take: limit,
    orderBy: { id: sortDirection },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          name: true,
          profilePhoto: true,
        },
      },
    },
  });

  const result: GetMessage[] = messages.map((msg) =>
    toGetMessage(msg as unknown as FindMessageResult, userId)
  );

  return NextResponse.json(result);
}

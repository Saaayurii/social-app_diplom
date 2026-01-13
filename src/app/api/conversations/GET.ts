import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { includeToConversation } from '@/lib/prisma/includeToConversation';
import { toGetConversation } from '@/lib/prisma/toGetConversation';
import { FindConversationResult, GetConversation } from '@/types/definitions';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const cursor = searchParams.get('cursor');

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
      ...(cursor && {
        id: { lt: parseInt(cursor, 10) },
      }),
    },
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: includeToConversation(),
  });

  const result: GetConversation[] = conversations.map((conv) =>
    toGetConversation(conv as unknown as FindConversationResult, userId)
  );

  return NextResponse.json(result);
}

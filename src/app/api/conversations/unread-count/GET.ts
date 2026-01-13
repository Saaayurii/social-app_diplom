import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  const participants = await prisma.conversationParticipant.findMany({
    where: { userId },
    include: {
      conversation: {
        include: {
          messages: {
            where: {
              senderId: { not: userId },
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  });

  let unreadCount = 0;
  for (const p of participants) {
    const lastMessage = p.conversation.messages[0];
    if (lastMessage && new Date(lastMessage.createdAt) > new Date(p.lastReadAt)) {
      unreadCount++;
    }
  }

  return NextResponse.json(unreadCount);
}

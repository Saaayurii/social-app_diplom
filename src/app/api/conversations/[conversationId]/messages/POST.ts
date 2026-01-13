import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { messageWriteSchema } from '@/lib/validations/message';
import { toGetMessage } from '@/lib/prisma/toGetMessage';
import { FindMessageResult, GetMessage } from '@/types/definitions';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(
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

  try {
    const body = await request.json();
    const { content } = messageWriteSchema.parse(body);

    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: userId,
      },
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

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json<GetMessage>(
      toGetMessage(message as unknown as FindMessageResult, userId)
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 422 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

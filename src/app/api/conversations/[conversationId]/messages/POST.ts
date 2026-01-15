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
  console.log('POST /messages called, conversationId:', params.conversationId);

  const [user] = await getServerUser();
  console.log('User:', user?.id);
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;
  const conversationId = parseInt(params.conversationId, 10);

  // Verify user is participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId },
    },
  });
  console.log('Participant:', participant);

  if (!participant) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  try {
    const body = await request.json();
    console.log('Body:', body);
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
    console.error('Error creating message:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 422 }
      );
    }
    // Временно возвращаем детали ошибки для отладки
    return NextResponse.json(
      { error: 'Internal server error', details: String(error), stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    );
  }
}

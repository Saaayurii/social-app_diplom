import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { conversationCreateSchema } from '@/lib/validations/message';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  try {
    const body = await request.json();
    const { participantId, content } = conversationCreateSchema.parse(body);

    // Cannot create conversation with yourself
    if (participantId === userId) {
      return NextResponse.json(
        { error: 'Нельзя создать диалог с самим собой.' },
        { status: 400 }
      );
    }

    // Check if conversation already exists between these users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: participantId } } },
        ],
        participants: {
          every: {
            userId: { in: [userId, participantId] },
          },
        },
      },
    });

    if (existingConversation) {
      // Add message to existing conversation
      await prisma.message.create({
        data: {
          content,
          conversationId: existingConversation.id,
          senderId: userId,
        },
      });

      await prisma.conversation.update({
        where: { id: existingConversation.id },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json({ conversationId: existingConversation.id });
    }

    // Create new conversation with initial message
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId }, { userId: participantId }],
        },
        messages: {
          create: {
            content,
            senderId: userId,
          },
        },
      },
    });

    return NextResponse.json({ conversationId: conversation.id });
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

import { z } from 'zod';

export const messageWriteSchema = z.object({
  content: z.string().refine((value) => value.trim().length > 0, {
    message: 'Сообщение не может быть пустым.',
  }),
});

export const conversationCreateSchema = z.object({
  participantId: z.string().min(1, 'ID участника обязателен.'),
  content: z.string().refine((value) => value.trim().length > 0, {
    message: 'Первое сообщение не может быть пустым.',
  }),
});

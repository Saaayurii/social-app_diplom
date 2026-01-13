import { GetMessage } from '@/types/definitions';

export async function getMessages({
  conversationId,
  cursor,
  limit = 20,
  direction = 'forward',
}: {
  conversationId: number;
  cursor?: number;
  limit?: number;
  direction?: 'forward' | 'backward';
}) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    'sort-direction': direction === 'forward' ? 'desc' : 'asc',
    ...(cursor && { cursor: cursor.toString() }),
  });

  const res = await fetch(
    `/api/conversations/${conversationId}/messages?${params}`
  );

  if (!res.ok) throw new Error('Ошибка загрузки сообщений.');
  return (await res.json()) as GetMessage[];
}

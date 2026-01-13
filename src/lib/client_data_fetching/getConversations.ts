import { GetConversation } from '@/types/definitions';

export async function getConversations({
  cursor,
  limit = 10,
}: {
  cursor?: number;
  limit?: number;
}) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    ...(cursor && { cursor: cursor.toString() }),
  });

  const res = await fetch(`/api/conversations?${params}`);

  if (!res.ok) throw new Error('Ошибка загрузки диалогов.');
  return (await res.json()) as GetConversation[];
}

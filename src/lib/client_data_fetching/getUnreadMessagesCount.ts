export async function getUnreadMessagesCount() {
  const res = await fetch('/api/conversations/unread-count');

  if (!res.ok) throw new Error('Ошибка загрузки счётчика непрочитанных.');
  return (await res.json()) as number;
}

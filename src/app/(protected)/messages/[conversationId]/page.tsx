import { getServerUser } from '@/lib/getServerUser';
import { Chat } from './Chat';

export const metadata = {
  title: 'ДонГУ Сеть | Чат',
};

export default async function Page({
  params,
}: {
  params: { conversationId: string };
}) {
  const [user] = await getServerUser();

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col md:h-[calc(100vh-32px)]">
      <Chat
        conversationId={parseInt(params.conversationId, 10)}
        userId={user.id}
      />
    </div>
  );
}

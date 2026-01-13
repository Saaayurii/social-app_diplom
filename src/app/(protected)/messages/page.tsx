import { getServerUser } from '@/lib/getServerUser';
import { ConversationsList } from './ConversationsList';

export const metadata = {
  title: 'ДонГУ Сеть | Сообщения',
};

export default async function Page() {
  const [user] = await getServerUser();

  if (!user) return null;
  return (
    <div className="px-4 pt-4">
      <ConversationsList userId={user.id} />
    </div>
  );
}

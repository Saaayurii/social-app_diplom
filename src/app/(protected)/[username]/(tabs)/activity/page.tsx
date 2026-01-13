import { getServerUser } from '@/lib/getServerUser';
import { getProfile } from '../../getProfile';
import { Activities } from './Activities';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  return {
    title: `Активность | ${profile?.name}` || 'Активность',
  };
}

export default async function Page({ params }: { params: { username: string } }) {
  const [user] = await getServerUser();
  if (!user) return <p>Это защищённая страница.</p>;
  const profile = await getProfile(params.username);
  const isOwn = user?.id === profile?.id;

  if (!isOwn) return <p>У вас нет доступа к этой странице.</p>;
  return (
    <div className="mt-4">
      <Activities userId={user.id} />
    </div>
  );
}

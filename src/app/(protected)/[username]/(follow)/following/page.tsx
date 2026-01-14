import { DiscoverProfiles } from '@/components/DiscoverProfiles';
import { DiscoverSearch } from '@/components/DiscoverSearch';
import { DiscoverFilters } from '@/components/DiscoverFilters';
import { notFound } from 'next/navigation';
import { getProfile } from '../../getProfile';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  return {
    title: `Подписки | ${profile?.name}` || 'Подписки',
  };
}

export default async function Page({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  if (!profile) notFound();

  return (
    <div className="p-4">
      <h1 className="mb-6 mt-1 text-4xl font-bold">Подписки {profile?.name}</h1>
      <DiscoverSearch label="Поиск подписок" />
      <DiscoverFilters />
      <DiscoverProfiles followingOf={profile?.id} />
    </div>
  );
}

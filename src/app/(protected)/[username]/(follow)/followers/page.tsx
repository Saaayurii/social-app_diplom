import { DiscoverProfiles } from '@/components/DiscoverProfiles';
import { DiscoverSearch } from '@/components/DiscoverSearch';
import { DiscoverFilters } from '@/components/DiscoverFilters';
import { notFound } from 'next/navigation';
import { getProfile } from '../../getProfile';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  return {
    title: `Подписчики | ${profile?.name}` || 'Подписчики',
  };
}

export default async function Page({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  if (!profile) notFound();

  return (
    <div className="p-4">
      <h1 className="mb-6 text-4xl font-bold">Подписчики {profile?.name}</h1>
      <DiscoverSearch label="Поиск подписчиков" />
      <DiscoverFilters />
      <DiscoverProfiles followersOf={profile?.id} />
    </div>
  );
}

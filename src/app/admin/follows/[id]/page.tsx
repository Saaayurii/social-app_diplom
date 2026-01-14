'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ViewFollowPage() {
  const params = useParams();
  const router = useRouter();
  const [follow, setFollow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/follows/${params.id}`).then(r => r.json()).then(d => { setFollow(d); setLoading(false); });
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Remove this follow?')) return;
    const res = await fetch(`/api/admin/follows/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/follows'); router.refresh(); }
  };

  if (loading) return <div>Loading...</div>;
  if (!follow) return <div>Not found</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Follow #{follow.id}</h1>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Remove Follow</Button>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <dl className="space-y-4">
          <div><dt className="text-sm text-gray-500">Follower</dt><dd>{follow.follower?.username || '-'}</dd></div>
          <div><dt className="text-sm text-gray-500">Following</dt><dd>{follow.following?.username || '-'}</dd></div>
        </dl>
      </div>
      <div className="mt-4"><Button mode="ghost" onPress={() => router.push('/admin/follows')}>Back</Button></div>
    </div>
  );
}

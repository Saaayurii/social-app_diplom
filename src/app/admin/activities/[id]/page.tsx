'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ViewActivityPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/activities/${params.id}`).then(r => r.json()).then(d => { setActivity(d); setLoading(false); });
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Delete this activity?')) return;
    const res = await fetch(`/api/admin/activities/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/activities'); router.refresh(); }
  };

  const toggleRead = async () => {
    const res = await fetch(`/api/admin/activities/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isNotificationRead: !activity.isNotificationRead }),
    });
    if (res.ok) {
      const data = await res.json();
      setActivity(data);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!activity) return <div>Not found</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity #{activity.id}</h1>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Delete</Button>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <dl className="space-y-4">
          <div><dt className="text-sm text-gray-500">Type</dt><dd>{activity.type}</dd></div>
          <div><dt className="text-sm text-gray-500">Source User</dt><dd>{activity.sourceUser?.username || '-'}</dd></div>
          <div><dt className="text-sm text-gray-500">Target User</dt><dd>{activity.targetUser?.username || '-'}</dd></div>
          <div><dt className="text-sm text-gray-500">Source ID</dt><dd>{activity.sourceId}</dd></div>
          <div><dt className="text-sm text-gray-500">Target ID</dt><dd>{activity.targetId || '-'}</dd></div>
          <div><dt className="text-sm text-gray-500">Notification Active</dt><dd>{activity.isNotificationActive ? 'Yes' : 'No'}</dd></div>
          <div className="flex items-center justify-between">
            <div><dt className="text-sm text-gray-500">Read</dt><dd>{activity.isNotificationRead ? 'Yes' : 'No'}</dd></div>
            <Button size="small" mode="ghost" onPress={toggleRead}>Toggle Read</Button>
          </div>
          <div><dt className="text-sm text-gray-500">Created</dt><dd>{new Date(activity.createdAt).toLocaleString()}</dd></div>
        </dl>
      </div>
      <div className="mt-4"><Button mode="ghost" onPress={() => router.push('/admin/activities')}>Back</Button></div>
    </div>
  );
}

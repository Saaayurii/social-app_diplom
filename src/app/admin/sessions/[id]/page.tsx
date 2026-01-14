'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ViewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/sessions/${params.id}`).then(r => r.json()).then(d => { setSession(d); setLoading(false); });
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Revoke this session?')) return;
    const res = await fetch(`/api/admin/sessions/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/sessions'); router.refresh(); }
  };

  if (loading) return <div>Loading...</div>;
  if (!session) return <div>Not found</div>;

  const isActive = new Date(session.expires) > new Date();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Session Details</h1>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Revoke Session</Button>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <dl className="space-y-4">
          <div><dt className="text-sm text-gray-500">ID</dt><dd className="font-mono text-sm">{session.id}</dd></div>
          <div><dt className="text-sm text-gray-500">User</dt><dd>{session.user?.email || session.user?.username || '-'}</dd></div>
          <div><dt className="text-sm text-gray-500">Expires</dt><dd>{new Date(session.expires).toLocaleString()}</dd></div>
          <div><dt className="text-sm text-gray-500">Status</dt><dd className={isActive ? 'text-green-600' : 'text-red-600'}>{isActive ? 'Active' : 'Expired'}</dd></div>
        </dl>
      </div>
      <div className="mt-4"><Button mode="ghost" onPress={() => router.push('/admin/sessions')}>Back</Button></div>
    </div>
  );
}

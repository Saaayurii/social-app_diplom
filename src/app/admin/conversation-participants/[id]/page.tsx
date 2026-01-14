'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ViewParticipantPage() {
  const params = useParams();
  const router = useRouter();
  const [participant, setParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/conversation-participants/${params.id}`).then(r => r.json()).then(d => { setParticipant(d); setLoading(false); });
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Remove this participant?')) return;
    const res = await fetch(`/api/admin/conversation-participants/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/conversation-participants'); router.refresh(); }
  };

  if (loading) return <div>Loading...</div>;
  if (!participant) return <div>Not found</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Participant #{participant.id}</h1>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Remove</Button>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <dl className="space-y-4">
          <div><dt className="text-sm text-gray-500">User</dt><dd>{participant.user?.username || '-'}</dd></div>
          <div><dt className="text-sm text-gray-500">Conversation ID</dt><dd>{participant.conversationId}</dd></div>
          <div><dt className="text-sm text-gray-500">Last Read At</dt><dd>{new Date(participant.lastReadAt).toLocaleString()}</dd></div>
        </dl>
      </div>
      <div className="mt-4"><Button mode="ghost" onPress={() => router.push('/admin/conversation-participants')}>Back</Button></div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ViewConversationPage() {
  const params = useParams();
  const router = useRouter();
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/conversations/${params.id}`).then(r => r.json()).then(d => { setConversation(d); setLoading(false); });
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Delete this conversation and all messages?')) return;
    const res = await fetch(`/api/admin/conversations/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/conversations'); router.refresh(); }
  };

  if (loading) return <div>Loading...</div>;
  if (!conversation) return <div>Not found</div>;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conversation #{conversation.id}</h1>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Delete</Button>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 font-semibold">Participants</h2>
        <div className="flex gap-2">
          {conversation.participants.map((p: any) => (
            <span key={p.id} className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
              {p.user?.username || 'Unknown'}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">Total messages: {conversation._count.messages}</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 font-semibold">Recent Messages (last 50)</h2>
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {conversation.messages.map((m: any) => (
            <div key={m.id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{m.sender?.username || 'Unknown'}</span>
                <span className="text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1">{m.content}</p>
            </div>
          ))}
          {conversation.messages.length === 0 && <p className="text-gray-500">No messages</p>}
        </div>
      </div>

      <div className="mt-4"><Button mode="ghost" onPress={() => router.push('/admin/conversations')}>Back</Button></div>
    </div>
  );
}

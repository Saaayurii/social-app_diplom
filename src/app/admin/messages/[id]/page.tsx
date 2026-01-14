'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminForm, FormField } from '@/components/admin/AdminForm';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const messageSchema = z.object({ content: z.string().min(1) });
type MessageFormData = z.infer<typeof messageSchema>;

const fields: FormField<MessageFormData>[] = [{ name: 'content', label: 'Content', type: 'textarea', required: true }];

export default function EditMessagePage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/messages/${params.id}`).then(r => r.json()).then(d => { setMessage(d); setLoading(false); });
  }, [params.id]);

  const handleSubmit = async (data: MessageFormData) => {
    const res = await fetch(`/api/admin/messages/${params.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this message?')) return;
    const res = await fetch(`/api/admin/messages/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/messages'); router.refresh(); }
  };

  if (loading) return <div>Loading...</div>;
  if (!message) return <div>Not found</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Message #{message.id}</h1>
          <p className="text-sm text-gray-500">Sender: {message.sender?.username} | Conversation: #{message.conversationId}</p>
        </div>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Delete</Button>
      </div>
      <AdminForm fields={fields} schema={messageSchema} defaultValues={{ content: message.content }} onSubmit={handleSubmit} backPath="/admin/messages" title="" />
    </div>
  );
}

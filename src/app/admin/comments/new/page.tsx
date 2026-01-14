'use client';

import { useEffect, useState } from 'react';
import { AdminForm, FormField } from '@/components/admin/AdminForm';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1),
  userId: z.string().min(1),
  postId: z.string().min(1),
});

type CommentFormData = z.infer<typeof commentSchema>;

export default function NewCommentPage() {
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  const [posts, setPosts] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/users?pageSize=100').then(r => r.json()).then(d => setUsers(d.data.map((u: any) => ({ value: u.id, label: u.username || u.email }))));
    fetch('/api/admin/posts?pageSize=100').then(r => r.json()).then(d => setPosts(d.data.map((p: any) => ({ value: String(p.id), label: `#${p.id}: ${(p.content || '').slice(0, 30)}` }))));
  }, []);

  const fields: FormField<CommentFormData>[] = [
    { name: 'userId', label: 'Author', type: 'select', options: users, required: true },
    { name: 'postId', label: 'Post', type: 'select', options: posts, required: true },
    { name: 'content', label: 'Content', type: 'textarea', required: true },
  ];

  const handleSubmit = async (data: CommentFormData) => {
    const res = await fetch('/api/admin/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, postId: parseInt(data.postId) }) });
    if (!res.ok) throw new Error('Failed');
  };

  return <AdminForm fields={fields} schema={commentSchema} onSubmit={handleSubmit} backPath="/admin/comments" title="Create Comment" submitLabel="Create" />;
}

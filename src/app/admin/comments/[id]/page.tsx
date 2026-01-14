'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminForm, FormField } from '@/components/admin/AdminForm';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const commentSchema = z.object({ content: z.string().min(1) });
type CommentFormData = z.infer<typeof commentSchema>;

const fields: FormField<CommentFormData>[] = [{ name: 'content', label: 'Content', type: 'textarea', required: true }];

export default function EditCommentPage() {
  const params = useParams();
  const router = useRouter();
  const [comment, setComment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/comments/${params.id}`).then(r => r.json()).then(d => { setComment(d); setLoading(false); });
  }, [params.id]);

  const handleSubmit = async (data: CommentFormData) => {
    const res = await fetch(`/api/admin/comments/${params.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
  };

  const handleDelete = async () => {
    if (!confirm('Delete?')) return;
    const res = await fetch(`/api/admin/comments/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/comments'); router.refresh(); }
  };

  if (loading) return <div>Loading...</div>;
  if (!comment) return <div>Not found</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Comment #{comment.id}</h1>
          <p className="text-sm text-gray-500">Author: {comment.user?.username} | Post: #{comment.postId}</p>
        </div>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Delete</Button>
      </div>
      <AdminForm fields={fields} schema={commentSchema} defaultValues={{ content: comment.content }} onSubmit={handleSubmit} backPath="/admin/comments" title="" />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminForm, FormField } from '@/components/admin/AdminForm';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const postSchema = z.object({
  content: z.string().optional().nullable(),
});

type PostFormData = z.infer<typeof postSchema>;

const fields: FormField<PostFormData>[] = [
  { name: 'content', label: 'Content', type: 'textarea' },
];

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/posts/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (data: PostFormData) => {
    const response = await fetch(`/api/admin/posts/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    setDeleting(true);
    const response = await fetch(`/api/admin/posts/${params.id}`, { method: 'DELETE' });
    if (response.ok) {
      router.push('/admin/posts');
      router.refresh();
    }
    setDeleting(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Post #{post.id}</h1>
          <p className="text-sm text-gray-500">Author: {post.user?.username || 'Unknown'}</p>
        </div>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete} loading={deleting}>
          Delete
        </Button>
      </div>
      <AdminForm
        fields={fields}
        schema={postSchema}
        defaultValues={{ content: post.content }}
        onSubmit={handleSubmit}
        backPath="/admin/posts"
        title=""
      />
    </div>
  );
}

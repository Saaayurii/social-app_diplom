'use client';

import { useEffect, useState } from 'react';
import { AdminForm, FormField } from '@/components/admin/AdminForm';
import { z } from 'zod';

const postSchema = z.object({
  content: z.string().optional(),
  userId: z.string().min(1, 'User is required'),
});

type PostFormData = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/users?pageSize=100')
      .then((res) => res.json())
      .then((data) => {
        setUsers(
          data.data.map((u: any) => ({
            value: u.id,
            label: u.username || u.email || u.id,
          }))
        );
      });
  }, []);

  const fields: FormField<PostFormData>[] = [
    { name: 'userId', label: 'Author', type: 'select', options: users, required: true },
    { name: 'content', label: 'Content', type: 'textarea' },
  ];

  const handleSubmit = async (data: PostFormData) => {
    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create');
  };

  return (
    <AdminForm
      fields={fields}
      schema={postSchema}
      onSubmit={handleSubmit}
      backPath="/admin/posts"
      title="Create Post"
      submitLabel="Create"
    />
  );
}

'use client';

import { AdminForm, FormField } from '@/components/admin/AdminForm';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().optional(),
  name: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const fields: FormField<UserFormData>[] = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'name', label: 'Name', type: 'text' },
];

export default function NewUserPage() {
  const handleSubmit = async (data: UserFormData) => {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }
  };

  return (
    <AdminForm
      fields={fields}
      schema={userSchema}
      onSubmit={handleSubmit}
      backPath="/admin/users"
      title="Create User"
      submitLabel="Create"
    />
  );
}

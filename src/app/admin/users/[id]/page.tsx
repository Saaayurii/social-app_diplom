'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminForm, FormField } from '@/components/admin/AdminForm';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const userSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  relationshipStatus: z.string().optional().nullable(),
});

type UserFormData = z.infer<typeof userSchema>;

const fields: FormField<UserFormData>[] = [
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
  { name: 'website', label: 'Website', type: 'text' },
  { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    options: [
      { value: 'MALE', label: 'Male' },
      { value: 'FEMALE', label: 'Female' },
      { value: 'NONBINARY', label: 'Non-binary' },
    ],
  },
  {
    name: 'relationshipStatus',
    label: 'Relationship Status',
    type: 'select',
    options: [
      { value: 'SINGLE', label: 'Single' },
      { value: 'IN_A_RELATIONSHIP', label: 'In a Relationship' },
      { value: 'ENGAGED', label: 'Engaged' },
      { value: 'MARRIED', label: 'Married' },
    ],
  },
];

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (data: UserFormData) => {
    const response = await fetch(`/api/admin/users/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/users');
        router.refresh();
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!user) {
    return <div className="text-red-500">User not found</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit User</h1>
        <Button
          mode="ghost"
          className="text-red-600"
          onPress={handleDelete}
          loading={deleting}
        >
          Delete User
        </Button>
      </div>

      <AdminForm
        fields={fields}
        schema={userSchema}
        defaultValues={user}
        onSubmit={handleSubmit}
        backPath="/admin/users"
        title=""
        submitLabel="Save Changes"
      />
    </div>
  );
}

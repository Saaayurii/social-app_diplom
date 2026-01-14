'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(val) => setEmail(val)}
            placeholder="admin@example.com"
          />

          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={(val) => setPassword(val)}
            placeholder="Enter password"
          />

          <Button
            type="submit"
            expand="full"
            loading={loading}
            className="mt-6"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Default: admin@example.com / admin123
        </p>
      </div>
    </div>
  );
}

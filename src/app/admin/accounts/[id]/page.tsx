'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ViewAccountPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/accounts/${params.id}`).then(r => r.json()).then(d => { setAccount(d); setLoading(false); });
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Delete this account?')) return;
    const res = await fetch(`/api/admin/accounts/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/accounts'); router.refresh(); }
  };

  if (loading) return <div>Loading...</div>;
  if (!account) return <div>Not found</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Details</h1>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Delete</Button>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <dl className="space-y-4">
          <div><dt className="text-sm text-gray-500">ID</dt><dd className="font-mono">{account.id}</dd></div>
          <div><dt className="text-sm text-gray-500">Provider</dt><dd>{account.provider}</dd></div>
          <div><dt className="text-sm text-gray-500">Type</dt><dd>{account.type}</dd></div>
          <div><dt className="text-sm text-gray-500">User</dt><dd>{account.user?.email || account.user?.username || '-'}</dd></div>
          <div><dt className="text-sm text-gray-500">Provider Account ID</dt><dd className="font-mono text-sm">{account.providerAccountId}</dd></div>
        </dl>
      </div>
      <div className="mt-4">
        <Button mode="ghost" onPress={() => router.push('/admin/accounts')}>Back</Button>
      </div>
    </div>
  );
}

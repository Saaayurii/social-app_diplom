'use client';

import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ViewTokenPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Verification Token</h1>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <p className="font-mono text-sm break-all">{params.id}</p>
      </div>
      <div className="mt-4"><Button mode="ghost" onPress={() => router.push('/admin/verification-tokens')}>Back</Button></div>
    </div>
  );
}

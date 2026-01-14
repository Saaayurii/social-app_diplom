'use client';

import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ViewCommentLikePage() {
  const params = useParams();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Remove this like?')) return;
    const res = await fetch(`/api/admin/comment-likes/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/comment-likes'); router.refresh(); }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comment Like #{params.id}</h1>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Remove Like</Button>
      </div>
      <div className="mt-4"><Button mode="ghost" onPress={() => router.push('/admin/comment-likes')}>Back</Button></div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ViewMediaPage() {
  const params = useParams();
  const router = useRouter();
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/visual-media/${params.id}`).then(r => r.json()).then(d => { setMedia(d); setLoading(false); });
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Delete this media?')) return;
    const res = await fetch(`/api/admin/visual-media/${params.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/visual-media'); router.refresh(); }
  };

  if (loading) return <div>Loading...</div>;
  if (!media) return <div>Not found</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media #{media.id}</h1>
        <Button mode="ghost" className="text-red-600" onPress={handleDelete}>Delete</Button>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <dl className="space-y-4">
          <div><dt className="text-sm text-gray-500">Type</dt><dd>{media.type}</dd></div>
          <div><dt className="text-sm text-gray-500">File Name</dt><dd className="font-mono">{media.fileName}</dd></div>
          <div><dt className="text-sm text-gray-500">User</dt><dd>{media.user?.username || '-'}</dd></div>
          <div><dt className="text-sm text-gray-500">Post ID</dt><dd>{media.postId}</dd></div>
          <div><dt className="text-sm text-gray-500">Uploaded</dt><dd>{new Date(media.uploadedAt).toLocaleString()}</dd></div>
        </dl>
      </div>
      <div className="mt-4"><Button mode="ghost" onPress={() => router.push('/admin/visual-media')}>Back</Button></div>
    </div>
  );
}

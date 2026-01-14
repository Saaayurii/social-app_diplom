'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: AdminConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirm error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">{message}</p>

        <div className="flex justify-end gap-4">
          <Button mode="ghost" onPress={onClose} isDisabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onPress={handleConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

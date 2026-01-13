'use client';

import Button from '@/components/ui/Button';
import { Send } from '@/svg_components';
import { useMessagesMutations } from '@/hooks/mutations/useMessagesMutations';
import { useState, useCallback, KeyboardEvent } from 'react';

export function MessageInput({ conversationId }: { conversationId: number }) {
  const [content, setContent] = useState('');
  const { sendMessageMutation } = useMessagesMutations();

  const handleSend = useCallback(() => {
    if (!content.trim()) return;

    sendMessageMutation.mutate(
      { conversationId, content },
      {
        onSuccess: () => setContent(''),
      }
    );
  }, [content, conversationId, sendMessageMutation]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex items-end gap-2 border-t border-border p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        className="flex-1 resize-none rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        rows={1}
        style={{
          minHeight: '42px',
          maxHeight: '120px',
        }}
      />
      <Button
        onPress={handleSend}
        isDisabled={!content.trim() || sendMessageMutation.isPending}
        loading={sendMessageMutation.isPending}
        Icon={Send}
      />
    </div>
  );
}

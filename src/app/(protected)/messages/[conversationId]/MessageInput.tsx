'use client';

import Button from '@/components/ui/Button';
import { Send } from '@/svg_components';
import { useMessagesMutations } from '@/hooks/mutations/useMessagesMutations';
import { useState, useCallback, KeyboardEvent, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';

export function MessageInput({ conversationId }: { conversationId: number }) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { sendMessageMutation } = useMessagesMutations();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [content]);

  return (
    <div className="flex items-end gap-3 border-t border-border bg-background/80 p-4 backdrop-blur-sm">
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Введите сообщение..."
          className={cn(
            'w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200',
            'placeholder:text-muted-foreground',
            'hover:border-muted-foreground/50',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            isFocused && 'border-primary ring-2 ring-primary/20'
          )}
          rows={1}
          style={{
            minHeight: '46px',
            maxHeight: '120px',
          }}
        />
      </div>
      <Button
        onPress={handleSend}
        isDisabled={!content.trim() || sendMessageMutation.isPending}
        loading={sendMessageMutation.isPending}
        Icon={Send}
        className="shrink-0"
      />
    </div>
  );
}

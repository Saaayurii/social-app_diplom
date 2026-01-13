'use client';

import { GetMessage } from '@/types/definitions';
import { GenericLoading } from '@/components/GenericLoading';
import { MessageBubble } from './MessageBubble';
import { useRef, useEffect } from 'react';
import useOnScreen from '@/hooks/useOnScreen';

export function MessageList({
  messages,
  isPending,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: {
  messages: GetMessage[];
  isPending: boolean;
  onLoadMore: () => void;
  hasMore: boolean | undefined;
  isLoadingMore: boolean;
}) {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isTopOnScreen = useOnScreen(topRef);

  useEffect(() => {
    if (isTopOnScreen && hasMore && !isLoadingMore) onLoadMore();
  }, [isTopOnScreen, hasMore, onLoadMore, isLoadingMore]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <GenericLoading>Загрузка сообщений</GenericLoading>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground">
          Начните диалог, отправив сообщение
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div ref={topRef} className="min-h-[1px]">
        {isLoadingMore && <GenericLoading>Загрузка...</GenericLoading>}
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}

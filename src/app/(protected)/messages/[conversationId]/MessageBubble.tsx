'use client';

import { GetMessage } from '@/types/definitions';
import { cn } from '@/lib/cn';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function MessageBubble({ message }: { message: GetMessage }) {
  const { content, createdAt, isOwn } = message;

  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2',
          isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        <p
          className={cn(
            'mt-1 text-right text-xs',
            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {format(new Date(createdAt), 'HH:mm', { locale: ru })}
        </p>
      </div>
    </div>
  );
}

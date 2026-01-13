'use client';

import { GetConversation } from '@/types/definitions';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/cn';

export function ConversationItem({
  conversation,
}: {
  conversation: GetConversation;
}) {
  const { otherParticipant, lastMessage, unreadCount } = conversation;

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={cn(
        'flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
        unreadCount > 0 && 'bg-primary/10'
      )}
    >
      <div className="h-12 w-12 flex-shrink-0">
        <ProfilePhoto
          name={otherParticipant.name}
          username={otherParticipant.username}
          photoUrl={otherParticipant.profilePhoto}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p
            className={cn('font-semibold', unreadCount > 0 && 'text-primary')}
          >
            {otherParticipant.name}
          </p>
          {lastMessage && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(lastMessage.createdAt), {
                addSuffix: true,
                locale: ru,
              })}
            </span>
          )}
        </div>
        {lastMessage && (
          <p className="truncate text-sm text-muted-foreground">
            {lastMessage.isOwn && 'Вы: '}
            {lastMessage.content}
          </p>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
          {unreadCount}
        </div>
      )}
    </Link>
  );
}

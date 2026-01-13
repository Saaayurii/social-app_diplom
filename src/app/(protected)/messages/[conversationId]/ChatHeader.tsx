'use client';

import { BackArrow } from '@/svg_components';
import { ButtonNaked } from '@/components/ui/ButtonNaked';
import { useRouter } from 'next/navigation';
import { GetConversation } from '@/types/definitions';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';

export function ChatHeader({
  conversation,
}: {
  conversation?: GetConversation;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 border-b border-border p-4">
      <ButtonNaked onPress={() => router.push('/messages')}>
        <BackArrow className="h-6 w-6 stroke-muted-foreground" />
      </ButtonNaked>
      {conversation && (
        <>
          <div className="h-10 w-10">
            <ProfilePhoto
              name={conversation.otherParticipant.name}
              username={conversation.otherParticipant.username}
              photoUrl={conversation.otherParticipant.profilePhoto}
            />
          </div>
          <div>
            <h2 className="font-semibold">
              {conversation.otherParticipant.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              @{conversation.otherParticipant.username}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

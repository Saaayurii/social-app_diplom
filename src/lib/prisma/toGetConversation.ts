import { FindConversationResult, GetConversation } from '@/types/definitions';
import { fileNameToUrl } from '../s3/fileNameToUrl';

export function toGetConversation(
  conversation: FindConversationResult,
  currentUserId: string
): GetConversation {
  const currentParticipant = conversation.participants.find(
    (p) => p.userId === currentUserId
  );
  const otherParticipant = conversation.participants.find(
    (p) => p.userId !== currentUserId
  );

  const lastMessage = conversation.messages[0] || null;
  const lastReadAt = currentParticipant?.lastReadAt || new Date(0);

  // Count unread: if last message is from other user and after lastReadAt
  const unreadCount =
    lastMessage &&
    lastMessage.senderId !== currentUserId &&
    new Date(lastMessage.createdAt) > new Date(lastReadAt)
      ? 1
      : 0;

  return {
    id: conversation.id,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    otherParticipant: {
      id: otherParticipant!.user.id,
      username: otherParticipant!.user.username!,
      name: otherParticipant!.user.name!,
      profilePhoto: fileNameToUrl(otherParticipant!.user.profilePhoto),
    },
    lastMessage: lastMessage
      ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          isOwn: lastMessage.senderId === currentUserId,
        }
      : null,
    unreadCount,
  };
}

import { FindMessageResult, GetMessage } from '@/types/definitions';
import { fileNameToUrl } from '../s3/fileNameToUrl';

export function toGetMessage(
  message: FindMessageResult,
  currentUserId: string
): GetMessage {
  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    conversationId: message.conversationId,
    sender: {
      id: message.sender.id,
      username: message.sender.username!,
      name: message.sender.name!,
      profilePhoto: fileNameToUrl(message.sender.profilePhoto),
    },
    isOwn: message.senderId === currentUserId,
  };
}

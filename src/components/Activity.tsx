import { GetActivity } from '@/types/definitions';
import { SemiBold } from '@/components/ui/SemiBold';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotificationsReadStatusMutations } from '@/hooks/mutations/useNotificationsReadStatusMutations';
import { ActivityCard } from './ActivityCard';

/** Use this component to render individual activities or notifications. */
export function Activity({
  id,
  type,
  sourceId,
  sourceUser,
  targetId,
  targetUser,
  createdAt,
  isNotificationRead,
  content,
}: GetActivity) {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();
  const { markAsReadMutation } = useNotificationsReadStatusMutations();

  // If this is an activity, the `sourceUser.id` is guaranteed to equal the `userId`.
  const isActivity = sourceUser.id === userId;
  const isNotification = targetUser.id === userId;
  const userToDisplay = isActivity ? targetUser : sourceUser;

  const sourceProperNoun = isActivity ? 'Вы' : sourceUser.name;

  const targetProperNoun = isNotification ? 'вас' : targetUser.name;
  const targetPossessiveNoun = isNotification ? 'вашу' : `пользователя ${targetUser.name}`;

  const isRead = isActivity || isNotificationRead;
  const navigate = (href: string) => () => {
    router.push(href);

    // Set the notification as read
    if (!isNotification) return;
    markAsReadMutation.mutate({ notificationId: id });
  };

  if (type === 'CREATE_FOLLOW') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/${isActivity ? targetUser.username : sourceUser.username}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> {isActivity ? 'подписались на' : 'подписался(ась) на'} <SemiBold>{targetProperNoun}</SemiBold>!
      </ActivityCard>
    );
  }

  if (type === 'POST_LIKE') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/posts/${targetId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> {isActivity ? 'оценили' : 'оценил(а)'} публикацию {targetPossessiveNoun}: &quot;{content}
        &quot;
      </ActivityCard>
    );
  }
  if (type === 'POST_MENTION') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/posts/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> {isActivity ? 'упомянули' : 'упомянул(а)'} <SemiBold>{targetProperNoun}</SemiBold> в публикации: &quot;{content}&quot;
      </ActivityCard>
    );
  }

  if (type === 'CREATE_COMMENT') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> {isActivity ? 'прокомментировали' : 'прокомментировал(а)'} публикацию {targetPossessiveNoun}: &quot;
        {content}&quot;
      </ActivityCard>
    );
  }
  if (type === 'COMMENT_LIKE') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${targetId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> {isActivity ? 'оценили' : 'оценил(а)'} комментарий {targetPossessiveNoun}: &quot;
        {content}
        &quot;
      </ActivityCard>
    );
  }
  if (type === 'COMMENT_MENTION') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> {isActivity ? 'упомянули' : 'упомянул(а)'} <SemiBold>{targetProperNoun}</SemiBold> в комментарии: &quot;{content}&quot;
      </ActivityCard>
    );
  }

  if (type === 'CREATE_REPLY') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> {isActivity ? 'ответили' : 'ответил(а)'} на комментарий {targetPossessiveNoun}: &quot;
        {content}
        &quot;
      </ActivityCard>
    );
  }
  if (type === 'REPLY_LIKE') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${targetId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> {isActivity ? 'оценили' : 'оценил(а)'} ответ {targetPossessiveNoun}: &quot;{content}
        &quot;
      </ActivityCard>
    );
  }
  if (type === 'REPLY_MENTION') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> {isActivity ? 'упомянули' : 'упомянул(а)'} <SemiBold>{targetProperNoun}</SemiBold> в ответе: &quot;{content}&quot;
      </ActivityCard>
    );
  }

  return null;
}

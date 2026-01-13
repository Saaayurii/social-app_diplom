import { getUnreadMessagesCount } from '@/lib/client_data_fetching/getUnreadMessagesCount';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUnreadMessagesCountQuery() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  return useQuery<number>({
    queryKey: ['conversations', 'unread-count'],
    queryFn: getUnreadMessagesCount,
    refetchInterval: 5000,
    enabled: !!userId,
  });
}

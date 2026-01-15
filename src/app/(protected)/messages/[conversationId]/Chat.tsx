'use client';

import { useInfiniteQuery, InfiniteData, QueryKey, useQuery } from '@tanstack/react-query';
import { GetMessage, GetConversation } from '@/types/definitions';
import { getMessages } from '@/lib/client_data_fetching/getMessages';
import { getConversations } from '@/lib/client_data_fetching/getConversations';
import { useMessagesMutations } from '@/hooks/mutations/useMessagesMutations';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useEffect, useMemo } from 'react';

export function Chat({
  conversationId,
  userId,
}: {
  conversationId: number;
  userId: string;
}) {
  const { markAsReadMutation } = useMessagesMutations();

  // Get conversation details for header
  const { data: conversationsData } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConversations({}),
  });

  const conversation = useMemo(() => {
    if (!conversationsData || !Array.isArray(conversationsData)) return undefined;
    return conversationsData.find((c) => c.id === conversationId);
  }, [conversationsData, conversationId]);

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      GetMessage[],
      Error,
      InfiniteData<GetMessage[], unknown>,
      QueryKey,
      number
    >({
      queryKey: ['conversations', conversationId, 'messages'],
      defaultPageParam: 0,
      queryFn: async ({ pageParam: cursor }) =>
        getMessages({ conversationId, cursor }),
      getNextPageParam: (lastPage) => {
        if (!lastPage.length) return undefined;
        return lastPage.slice(-1)[0].id;
      },
      refetchInterval: 3000, // Poll for new messages
    });

  // Mark as read when entering chat
  useEffect(() => {
    markAsReadMutation.mutate(conversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const messages = useMemo(() => {
    const allMessages = data?.pages.flat() || [];
    // Reverse to show oldest first
    return [...allMessages].reverse();
  }, [data]);

  return (
    <>
      <ChatHeader conversation={conversation} />
      <MessageList
        messages={messages}
        isPending={isPending}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
      />
      <MessageInput conversationId={conversationId} />
    </>
  );
}

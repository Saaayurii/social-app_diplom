'use client';

import { useInfiniteQuery, InfiniteData, QueryKey } from '@tanstack/react-query';
import { GetConversation } from '@/types/definitions';
import { getConversations } from '@/lib/client_data_fetching/getConversations';
import { GenericLoading } from '@/components/GenericLoading';
import { AllCaughtUp } from '@/components/AllCaughtUp';
import { ConversationItem } from './ConversationItem';
import { NewConversationButton } from './NewConversationButton';
import useOnScreen from '@/hooks/useOnScreen';
import { useEffect, useRef, useMemo } from 'react';

export function ConversationsList({ userId }: { userId: string }) {
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);

  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<
      GetConversation[],
      Error,
      InfiniteData<GetConversation[], unknown>,
      QueryKey,
      number
    >({
      queryKey: ['conversations'],
      defaultPageParam: 0,
      queryFn: async ({ pageParam: cursor }) => getConversations({ cursor }),
      getNextPageParam: (lastPage) => {
        if (!lastPage.length) return undefined;
        return lastPage.slice(-1)[0].id;
      },
      refetchInterval: 10000,
      enabled: !!userId,
    });

  useEffect(() => {
    if (isBottomOnScreen && hasNextPage) fetchNextPage();
  }, [isBottomOnScreen, hasNextPage, fetchNextPage]);

  const bottomLoaderStyle = useMemo(
    () => ({ display: data ? 'block' : 'none' }),
    [data]
  );

  const conversations = data?.pages.flat() || [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Сообщения</h1>
        <NewConversationButton />
      </div>

      {isPending ? (
        <GenericLoading>Загрузка диалогов</GenericLoading>
      ) : conversations.length === 0 ? (
        <p className="text-center text-muted-foreground">
          У вас пока нет диалогов. Начните новый диалог!
        </p>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))}
        </div>
      )}

      <div className="min-h-[16px]" ref={bottomElRef} style={bottomLoaderStyle}>
        {isFetchingNextPage && <GenericLoading>Загрузка...</GenericLoading>}
      </div>

      {!isPending && !isFetchingNextPage && !hasNextPage && conversations.length > 0 && (
        <AllCaughtUp />
      )}
    </div>
  );
}

'use client';

import { GenericDialog } from '@/components/GenericDialog';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { Textarea } from '@/components/ui/Textarea';
import { useMessagesMutations } from '@/hooks/mutations/useMessagesMutations';
import { getUsers } from '@/lib/client_data_fetching/getUsers';
import { UserSummaryAfterSetUp } from '@/types/definitions';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import { cn } from '@/lib/cn';
import { GenericLoading } from '@/components/GenericLoading';

export function NewConversationDialog({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSummaryAfterSetUp | null>(
    null
  );
  const [content, setContent] = useState('');
  const { createConversationMutation } = useMessagesMutations();

  const { data: users, isPending: isSearching } = useQuery({
    queryKey: ['users-basic', searchKeyword],
    queryFn: () => getUsers({ searchKeyword }),
    enabled: searchKeyword.length >= 2,
  });

  const handleSelectUser = useCallback((user: UserSummaryAfterSetUp) => {
    setSelectedUser(user);
    setSearchKeyword('');
  }, []);

  const handleCreate = useCallback(() => {
    if (!selectedUser || !content.trim()) return;

    createConversationMutation.mutate(
      { participantId: selectedUser.id, content },
      {
        onSuccess: (data) => {
          router.push(`/messages/${data.conversationId}`);
          handleClose();
        },
      }
    );
  }, [selectedUser, content, createConversationMutation, router, handleClose]);

  return (
    <GenericDialog title="Новый диалог" handleClose={handleClose}>
      <div className="space-y-4 p-4">
        {/* User selection */}
        {selectedUser ? (
          <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <div className="h-10 w-10">
              <ProfilePhoto
                name={selectedUser.name}
                username={selectedUser.username}
                photoUrl={selectedUser.profilePhoto}
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{selectedUser.name}</p>
              <p className="text-sm text-muted-foreground">
                @{selectedUser.username}
              </p>
            </div>
            <Button
              onPress={() => setSelectedUser(null)}
              mode="ghost"
              size="small"
            >
              Изменить
            </Button>
          </div>
        ) : (
          <div>
            <TextInput
              value={searchKeyword}
              onChange={setSearchKeyword}
              placeholder="Поиск пользователя..."
              label="Кому"
            />
            {isSearching && searchKeyword.length >= 2 && (
              <GenericLoading>Поиск...</GenericLoading>
            )}
            {users && users.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className={cn(
                      'flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted'
                    )}
                  >
                    <div className="h-10 w-10">
                      <ProfilePhoto
                        name={user.name}
                        username={user.username}
                        photoUrl={user.profilePhoto}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {users && users.length === 0 && searchKeyword.length >= 2 && (
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Пользователи не найдены
              </p>
            )}
          </div>
        )}

        {/* Message input */}
        {selectedUser && (
          <>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите сообщение..."
              rows={4}
            />
            <Button
              onPress={handleCreate}
              isDisabled={
                !content.trim() || createConversationMutation.isPending
              }
              loading={createConversationMutation.isPending}
              expand="full"
              shape="pill"
            >
              Отправить
            </Button>
          </>
        )}
      </div>
    </GenericDialog>
  );
}

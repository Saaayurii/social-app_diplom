import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetMessage } from '@/types/definitions';
import { useErrorNotifier } from '../useErrorNotifier';
import { useToast } from '../useToast';

export function useMessagesMutations() {
  const qc = useQueryClient();
  const { showToast } = useToast();
  const { notifyError } = useErrorNotifier();

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: number;
      content: string;
    }) => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error(res.statusText);
      return (await res.json()) as GetMessage;
    },
    onSuccess: (newMessage) => {
      // Update messages list
      qc.invalidateQueries({
        queryKey: ['conversations', newMessage.conversationId, 'messages'],
      });
      // Update conversations list
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err) => notifyError(err),
  });

  const createConversationMutation = useMutation({
    mutationFn: async ({
      participantId,
      content,
    }: {
      participantId: string;
      content: string;
    }) => {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, content }),
      });

      if (!res.ok) throw new Error(res.statusText);
      return (await res.json()) as { conversationId: number };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
      showToast({
        title: 'Успешно',
        message: 'Сообщение отправлено.',
        type: 'success',
      });
    },
    onError: (err) => notifyError(err),
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (conversationId: number) => {
      const res = await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error(res.statusText);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations', 'unread-count'] });
    },
  });

  return {
    sendMessageMutation,
    createConversationMutation,
    markAsReadMutation,
  };
}

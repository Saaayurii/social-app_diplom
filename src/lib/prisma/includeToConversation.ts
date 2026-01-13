export const includeToConversation = () => ({
  participants: {
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          profilePhoto: true,
        },
      },
    },
  },
  messages: {
    orderBy: { createdAt: 'desc' as const },
    take: 1,
    select: {
      id: true,
      content: true,
      createdAt: true,
      senderId: true,
    },
  },
  _count: {
    select: {
      messages: true,
    },
  },
});

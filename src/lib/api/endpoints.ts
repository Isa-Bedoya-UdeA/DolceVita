export const endpoints = {
    conversations: "/api/conversations",
    conversation: (id: string) => `/api/conversations/${id}`,
    conversationMessages: (id: string) => `/api/conversations/${id}/messages`,
    message: (id: string) => `/api/messages/${id}`,
    messageRetry: (id: string) => `/api/messages/${id}/retry`,
    messageFeedback: (id: string) => `/api/messages/${id}/feedback`,
} as const;

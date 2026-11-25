export const endpoints = {
    conversations: "/api/conversations",
    conversation: (id: string) => `/api/conversations/${id}`,
    conversationMessages: (id: string) => `/api/conversations/${id}/messages`,
    message: (id: string) => `/api/messages/${id}`,
    messageRetry: (id: string) => `/api/messages/${id}/retry`,
    messageFeedback: (id: string) => `/api/messages/${id}/feedback`,
    register: "/api/auth/register",
    currentUser: "/api/users/me",
    adminUsers: "/api/admin/users",
    adminUser: (id: string) => `/api/admin/users/${id}`,
    adminAssistant: "/api/admin/assistant",
    adminStatistics: "/api/admin/statistics",
} as const;

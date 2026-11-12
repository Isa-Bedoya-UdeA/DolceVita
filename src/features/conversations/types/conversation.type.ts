export interface ConversationItemData {
    id: string;
    title: string;
    userId: string;
    assistantConfigId?: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        messages: number;
    };
}

export interface ConversationDetailData extends ConversationItemData {
    messages?: ChatMessageData[];
}

export interface ChatMessageData {
    id: string;
    conversationId: string;
    role: "USER" | "ASSISTANT" | "SYSTEM";
    content: string;
    status?: "PENDING" | "COMPLETED" | "FAILED" | "SENT" | "STREAMING" | "ERROR" | string;
    metadata?: Record<string, unknown> | null;
    rating?: "positive" | "negative" | null;
    editedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

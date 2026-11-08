import { ChatMessageData, ConversationItemData } from "@/features/conversations/types/conversation.type";

export type { ChatMessageData, ConversationItemData };

export interface SendMessagePayload {
    content: string;
}

export interface ChatSessionState {
    conversationId?: string | null;
    messages: ChatMessageData[];
    isLoading: boolean;
    isGenerating: boolean;
    error: string | null;
}

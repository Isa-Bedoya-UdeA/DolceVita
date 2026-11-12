import type { ChatMessageData } from "@/features/conversations/types/conversation.type";

export interface MessageDto {
    id: string;
    conversationId: string;
    role: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    editedAt?: string | null;
    rating?: "positive" | "negative" | null;
}

/** The API returns lowercase roles ("user"); the chat UI works with uppercase ones. */
export function toChatMessage(dto: MessageDto): ChatMessageData {
    return {
        ...dto,
        role: dto.role.toUpperCase() as ChatMessageData["role"],
        status: "SENT",
        updatedAt: dto.updatedAt ?? dto.createdAt,
    };
}

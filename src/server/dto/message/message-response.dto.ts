export interface MessageResponseDto {
    id: string;
    conversationId: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt: string;
    editedAt?: string | null;
    rating?: "positive" | "negative" | null;
}

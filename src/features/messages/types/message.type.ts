import type { MessageDto } from "@/lib/formatters/message.formatter";
import type { FeedbackRating } from "@/features/feedback/types/feedback.type";

export type MessageRating = FeedbackRating;

export interface EditMessageResult {
    userMessage: MessageDto;
    assistantMessage: MessageDto;
}

export interface RetryMessageResult {
    assistantMessage: MessageDto;
}

export interface MessageActionHandlers {
    onEdit: (messageId: string, content: string) => Promise<boolean>;
    onRetry: (messageId: string) => Promise<void>;
    onRate: (messageId: string, rating: MessageRating) => Promise<void>;
}

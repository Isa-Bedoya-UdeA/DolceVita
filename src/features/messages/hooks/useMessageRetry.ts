"use client";

import { Dispatch, SetStateAction, useCallback } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api/api-client";
import { endpoints } from "@/lib/api/endpoints";
import { toChatMessage } from "@/lib/formatters/message.formatter";
import type { ChatMessageData } from "@/features/conversations/types/conversation.type";
import { RetryMessageResult } from "../types/message.type";

interface UseMessageRetryOptions {
    messages: ChatMessageData[];
    setMessages: Dispatch<SetStateAction<ChatMessageData[]>>;
    setIsGenerating: Dispatch<SetStateAction<boolean>>;
}

/** FR-014: asks George for a new version of his latest answer. */
export function useMessageRetry({
    messages,
    setMessages,
    setIsGenerating,
}: UseMessageRetryOptions) {
    const retryMessage = useCallback(
        async (messageId: string): Promise<void> => {
            const snapshot = messages;
            setMessages(messages.filter((message) => message.id !== messageId));
            setIsGenerating(true);

            try {
                const result = await apiRequest<RetryMessageResult>(
                    endpoints.messageRetry(messageId),
                    { method: "POST" },
                );
                setMessages([
                    ...snapshot.filter((message) => message.id !== messageId),
                    toChatMessage(result.assistantMessage),
                ]);
            } catch (error) {
                setMessages(snapshot);
                toast.error(
                    error instanceof Error ? error.message : "No se pudo regenerar la respuesta",
                );
            } finally {
                setIsGenerating(false);
            }
        },
        [messages, setMessages, setIsGenerating],
    );

    return { retryMessage };
}

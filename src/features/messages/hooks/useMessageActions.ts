"use client";

import { Dispatch, SetStateAction, useCallback } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api/api-client";
import { endpoints } from "@/lib/api/endpoints";
import { toChatMessage } from "@/lib/formatters/message.formatter";
import { submitFeedback } from "@/features/feedback/hooks/useFeedback";
import type { ChatMessageData } from "@/features/conversations/types/conversation.type";
import { editMessageSchema } from "../schemas/message.schema";
import { EditMessageResult, MessageRating } from "../types/message.type";

interface UseMessageActionsOptions {
    messages: ChatMessageData[];
    setMessages: Dispatch<SetStateAction<ChatMessageData[]>>;
    setIsGenerating: Dispatch<SetStateAction<boolean>>;
}

export function useMessageActions({
    messages,
    setMessages,
    setIsGenerating,
}: UseMessageActionsOptions) {
    /** FR-013: edits a user message and replaces everything after it with a new answer. */
    const editMessage = useCallback(
        async (messageId: string, content: string): Promise<boolean> => {
            const parsed = editMessageSchema.safeParse({ content });
            if (!parsed.success) {
                toast.error(parsed.error.issues[0]?.message ?? "Mensaje inválido");
                return false;
            }

            const index = messages.findIndex((message) => message.id === messageId);
            if (index === -1) return false;

            const snapshot = messages;
            setMessages([
                ...messages.slice(0, index),
                { ...messages[index], content: parsed.data.content },
            ]);
            setIsGenerating(true);

            try {
                const result = await apiRequest<EditMessageResult>(endpoints.message(messageId), {
                    method: "PATCH",
                    body: JSON.stringify(parsed.data),
                });
                setMessages([
                    ...snapshot.slice(0, index),
                    toChatMessage(result.userMessage),
                    toChatMessage(result.assistantMessage),
                ]);
                return true;
            } catch (error) {
                setMessages(snapshot);
                toast.error(
                    error instanceof Error ? error.message : "No se pudo editar el mensaje",
                );
                return false;
            } finally {
                setIsGenerating(false);
            }
        },
        [messages, setMessages, setIsGenerating],
    );

    /** FR-015: rates an assistant answer (optimistic update with rollback). */
    const rateMessage = useCallback(
        async (messageId: string, rating: MessageRating): Promise<void> => {
            const previous = messages.find((message) => message.id === messageId)?.rating ?? null;
            if (previous === rating) return;

            const applyRating = (value: MessageRating | null) =>
                setMessages((current) =>
                    current.map((message) =>
                        message.id === messageId ? { ...message, rating: value } : message,
                    ),
                );

            applyRating(rating);
            try {
                await submitFeedback(messageId, rating);
                toast.success("¡Gracias por tu calificación!");
            } catch (error) {
                applyRating(previous);
                toast.error(
                    error instanceof Error ? error.message : "No se pudo guardar la calificación",
                );
            }
        },
        [messages, setMessages],
    );

    return { editMessage, rateMessage };
}

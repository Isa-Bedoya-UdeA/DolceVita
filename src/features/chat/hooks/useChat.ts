"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChatMessageData } from "../types/chat.type";
import { notifyConversationsChanged } from "@/features/conversations/hooks/useConversation";
import { useMessageActions } from "@/features/messages/hooks/useMessageActions";
import { useMessageRetry } from "@/features/messages/hooks/useMessageRetry";
import { MessageDto, toChatMessage } from "@/lib/formatters/message.formatter";

interface UseChatProps {
    conversationId?: string;
}

async function requestMessages(id: string): Promise<ChatMessageData[]> {
    const res = await fetch(`/api/conversations/${id}/messages`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || "Error al cargar mensajes");
    }

    const json = await res.json();
    return Array.isArray(json.data) ? json.data.map((dto: MessageDto) => toChatMessage(dto)) : [];
}

export function useChat({ conversationId }: UseChatProps) {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(Boolean(conversationId));
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [previousConversationId, setPreviousConversationId] = useState(conversationId);

    if (previousConversationId !== conversationId) {
        setPreviousConversationId(conversationId);
        setError(null);
        setIsLoading(Boolean(conversationId));
        if (!conversationId) setMessages([]);
    }

    const fetchMessages = useCallback((id: string) => {
        return requestMessages(id)
            .then((list) => {
                setMessages(list);
                setError(null);
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "Error inesperado");
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (conversationId) {
            fetchMessages(conversationId);
        }
    }, [conversationId, fetchMessages]);

    const sendMessage = useCallback(
        async (content: string) => {
            const trimmed = content.trim();
            if (!trimmed) return;

            // 1. Optimistic user message in UI
            const tempUserMsg: ChatMessageData = {
                id: `temp-user-${Date.now()}`,
                conversationId: conversationId || "",
                role: "USER",
                content: trimmed,
                status: "SENT",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, tempUserMsg]);
            setIsGenerating(true);

            try {
                let targetConvId = conversationId;

                // If not inside an existing conversation, create one first in the database
                if (!targetConvId) {
                    const title = trimmed.length > 42 ? `${trimmed.slice(0, 40)}...` : trimmed;
                    const convRes = await fetch("/api/conversations", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title }),
                    });

                    if (!convRes.ok) {
                        const errData = await convRes.json().catch(() => ({}));
                        throw new Error(errData?.error?.message || "Error al iniciar conversación");
                    }

                    const convJson = await convRes.json();
                    targetConvId = convJson.data?.id;

                    if (!targetConvId) {
                        throw new Error("No se pudo obtener el identificador de la conversación");
                    }
                }

                // Post message to backend route
                const res = await fetch(`/api/conversations/${targetConvId}/messages`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: trimmed }),
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData?.error?.message || "Error al enviar mensaje");
                }

                const json = await res.json();
                const { userMessage, assistantMessage } = json.data;

                // Sync messages with server responses
                setMessages((prev) => [
                    ...prev.filter((m) => m.id !== tempUserMsg.id),
                    {
                        ...userMessage,
                        role: "USER",
                        status: "SENT",
                    },
                    {
                        ...assistantMessage,
                        role: "ASSISTANT",
                        status: "SENT",
                    },
                ]);

                notifyConversationsChanged();

                // If this was initiated from /chat, transition to the concrete /chat/[id] URL
                if (!conversationId && targetConvId) {
                    router.push(`/chat/${targetConvId}`);
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Error al procesar el mensaje";
                toast.error(message);
                // Remove failed optimistic message
                setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
            } finally {
                setIsGenerating(false);
            }
        },
        [conversationId, router]
    );

    const { editMessage, rateMessage } = useMessageActions({
        messages,
        setMessages,
        setIsGenerating,
    });
    const { retryMessage } = useMessageRetry({ messages, setMessages, setIsGenerating });

    return {
        messages,
        isLoading,
        isGenerating,
        error,
        sendMessage,
        editMessage,
        retryMessage,
        rateMessage,
        refetch: () => conversationId && fetchMessages(conversationId),
    };
}

"use client";

import { useEffect, useState } from "react";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatEmptyState } from "./ChatEmptyState";
import { TypingIndicator } from "./TypingIndicator";
import { ChatHeader } from "./ChatHeader";
import { useChat } from "../hooks/useChat";

interface ChatWindowProps {
    conversationId?: string;
    conversationTitle?: string;
}

export function ChatWindow({ conversationId, conversationTitle }: ChatWindowProps) {
    const { messages, isLoading, isGenerating, sendMessage, editMessage, retryMessage, rateMessage } =
        useChat({ conversationId });
    const lastAssistantId = [...messages].reverse().find((msg) => msg.role === "ASSISTANT")?.id;
    const isLastMessageAssistant = messages[messages.length - 1]?.role === "ASSISTANT";
    const { containerRef, handleScroll } = useAutoScroll([messages.length, isGenerating]);
    const [fetchedTitle, setFetchedTitle] = useState<{ id: string; title: string } | null>(null);

    useEffect(() => {
        if (conversationTitle || !conversationId) return;

        fetch(`/api/conversations/${conversationId}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => {
                if (json?.data?.title) setFetchedTitle({ id: conversationId, title: json.data.title });
            })
            .catch(() => {});
    }, [conversationId, conversationTitle]);

    const title =
        conversationTitle ||
        (fetchedTitle && fetchedTitle.id === conversationId ? fetchedTitle.title : null) ||
        "Chef George";

    return (
        <div className="flex h-full w-full flex-col bg-background">
            {/* Header */}
            <ChatHeader title={title} />

            {/* Messages Body */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-6 md:px-8"
            >
                <div className="mx-auto max-w-3xl">
                    {messages.length === 0 && !isLoading ? (
                        <ChatEmptyState onSelectPrompt={sendMessage} />
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    message={msg}
                                    isLastAssistant={isLastMessageAssistant && msg.id === lastAssistantId}
                                    actionsDisabled={isGenerating}
                                    actions={{
                                        onEdit: editMessage,
                                        onRetry: retryMessage,
                                        onRate: rateMessage,
                                    }}
                                />
                            ))}

                            {isGenerating && <TypingIndicator />}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Input */}
            <div className="shrink-0 bg-background/80 backdrop-blur-xs pt-2">
                <ChatInput
                    onSendMessage={sendMessage}
                    isLoading={isGenerating}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
}

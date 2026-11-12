"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { MessageActions } from "@/features/messages/components/MessageActions";
import { MessageEditor } from "@/features/messages/components/MessageEditor";
import type { MessageActionHandlers } from "@/features/messages/types/message.type";
import { ChatMessageData } from "../types/chat.type";

interface ChatMessageProps {
    message: ChatMessageData;
    isLastAssistant?: boolean;
    actionsDisabled?: boolean;
    actions?: MessageActionHandlers;
}

export function ChatMessage({
    message,
    isLastAssistant = false,
    actionsDisabled = false,
    actions,
}: ChatMessageProps) {
    const isUser = message.role === "USER";
    const [isEditing, setIsEditing] = useState(false);
    const handlers = actions && !message.id.startsWith("temp-") ? actions : undefined;

    const formattedTime = message.createdAt
        ? new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

    return (
        <div
            className={`group flex w-full items-start gap-3 py-3 transition-colors ${
                isUser ? "flex-row-reverse" : "flex-row"
            }`}
        >
            {/* Avatar */}
            {isUser ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-secondary text-white font-medium text-xs shadow-xs">
                    <User className="h-4 w-4" />
                </div>
            ) : (
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 overflow-hidden shadow-xs">
                    <Image
                        src="/images/Logo.png"
                        alt="Chef George"
                        width={22}
                        height={22}
                        className="object-contain"
                    />
                </div>
            )}

            {/* Bubble Container */}
            <div
                className={`relative flex max-w-[85%] sm:max-w-[75%] flex-col rounded-2xl px-4 py-3 text-sm shadow-xs ${
                    isUser
                        ? "bg-brand-primary text-text-inverse rounded-tr-xs"
                        : "bg-surface border border-border text-text-primary rounded-tl-xs"
                }`}
            >
                {/* Content */}
                {isUser && isEditing && actions ? (
                    <MessageEditor
                        initialContent={message.content}
                        onSave={(content) => actions.onEdit(message.id, content)}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                    <MarkdownRenderer content={message.content} />
                )}

                {/* Footer details: time + message actions */}
                <div
                    className={`mt-2 flex items-center gap-2 text-[10px] ${
                        isUser ? "text-text-inverse/70 justify-end" : "text-text-secondary justify-between"
                    }`}
                >
                    <span>
                        {formattedTime}
                        {message.editedAt ? " · editado" : ""}
                    </span>

                    {!isEditing && (
                        <MessageActions
                            content={message.content}
                            isUser={isUser}
                            rating={message.rating}
                            canRetry={isLastAssistant}
                            disabled={actionsDisabled}
                            onEdit={handlers && (() => setIsEditing(true))}
                            onRetry={handlers && (() => handlers.onRetry(message.id))}
                            onRate={handlers && ((rating) => handlers.onRate(message.id, rating))}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

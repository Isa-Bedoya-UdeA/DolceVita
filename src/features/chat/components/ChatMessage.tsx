"use client";

import Image from "next/image";
import { Check, Copy, User } from "lucide-react";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { ChatMessageData } from "../types/chat.type";

interface ChatMessageProps {
    message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "USER";
    const { isCopied, copy } = useCopyToClipboard({
        successMessage: "Mensaje copiado",
    });

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
                {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                    <MarkdownRenderer content={message.content} />
                )}

                {/* Footer details: time + copy action */}
                <div
                    className={`mt-2 flex items-center gap-2 text-[10px] ${
                        isUser ? "text-text-inverse/70 justify-end" : "text-text-secondary justify-between"
                    }`}
                >
                    <span>{formattedTime}</span>

                    {!isUser && (
                        <button
                            type="button"
                            onClick={() => copy(message.content)}
                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 opacity-0 transition group-hover:opacity-100 hover:bg-surface-muted hover:text-text-primary"
                            aria-label="Copiar respuesta"
                        >
                            {isCopied ? (
                                <>
                                    <Check className="h-3 w-3 text-brand-primary" />
                                    <span>Copiado</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copiar</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

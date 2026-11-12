"use client";

import { Check, Copy, Pencil, RefreshCw } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { MessageFeedback } from "./MessageFeedback";
import { MessageRating } from "../types/message.type";

interface MessageActionsProps {
    content: string;
    isUser: boolean;
    rating?: MessageRating | null;
    canRetry?: boolean;
    disabled?: boolean;
    onEdit?: () => void;
    onRetry?: () => void;
    onRate?: (rating: MessageRating) => void;
}

const actionClass =
    "inline-flex items-center gap-1 rounded px-1.5 py-0.5 transition disabled:cursor-not-allowed disabled:opacity-50";

export function MessageActions({
    content,
    isUser,
    rating,
    canRetry = false,
    disabled = false,
    onEdit,
    onRetry,
    onRate,
}: MessageActionsProps) {
    const { isCopied, copy } = useCopyToClipboard({ successMessage: "Mensaje copiado" });

    if (isUser) {
        return onEdit ? (
            <button
                type="button"
                onClick={onEdit}
                disabled={disabled}
                className={`${actionClass} opacity-0 group-hover:opacity-100 hover:bg-white/10`}
                aria-label="Editar mensaje"
            >
                <Pencil className="h-3 w-3" />
                <span>Editar</span>
            </button>
        ) : null;
    }

    return (
        <div
            className={`flex items-center gap-1 transition group-hover:opacity-100 focus-within:opacity-100 ${
                rating ? "opacity-100" : "opacity-0"
            }`}
        >
            <button
                type="button"
                onClick={() => copy(content)}
                className={`${actionClass} hover:bg-surface-muted hover:text-text-primary`}
                aria-label="Copiar respuesta"
            >
                {isCopied ? (
                    <>
                        <Check className="text-brand-primary h-3 w-3" />
                        <span>Copiado</span>
                    </>
                ) : (
                    <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar</span>
                    </>
                )}
            </button>

            {canRetry && onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    disabled={disabled}
                    className={`${actionClass} hover:bg-surface-muted hover:text-text-primary`}
                    aria-label="Regenerar respuesta"
                >
                    <RefreshCw className="h-3 w-3" />
                    <span>Regenerar</span>
                </button>
            )}

            {onRate && <MessageFeedback rating={rating} disabled={disabled} onRate={onRate} />}
        </div>
    );
}

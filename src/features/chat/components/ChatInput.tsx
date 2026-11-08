"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSendMessage,
    isLoading = false,
    disabled = false,
    placeholder = "Pregúntale al Chef George sobre una receta o técnica...",
}: ChatInputProps) {
    const [text, setText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
    };

    useEffect(() => {
        adjustHeight();
    }, [text]);

    const handleSubmit = () => {
        const trimmed = text.trim();
        if (!trimmed || isLoading || disabled) return;

        onSendMessage(trimmed);
        setText("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="relative mx-auto w-full max-w-3xl px-4 pb-4">
            <div className="relative flex items-end rounded-2xl border border-border bg-surface shadow-elevation-1 transition-all focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || isLoading}
                    rows={1}
                    placeholder={placeholder}
                    className="max-h-44 min-h-[48px] w-full resize-none bg-transparent px-4 py-3.5 text-sm text-text-primary placeholder:text-text-secondary/70 outline-hidden disabled:opacity-50"
                />

                <div className="pb-2.5 pr-2.5">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!text.trim() || isLoading || disabled}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-primary text-text-inverse transition hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Enviar mensaje"
                    >
                        <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                    </button>
                </div>
            </div>

            <p className="mt-2 text-center text-[11px] text-text-secondary">
                George puede cometer errores. Verifica la información culinaria importante.
            </p>
        </div>
    );
}

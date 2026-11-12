"use client";

import { useState } from "react";

interface MessageEditorProps {
    initialContent: string;
    onSave: (content: string) => Promise<boolean>;
    onCancel: () => void;
}

export function MessageEditor({ initialContent, onSave, onCancel }: MessageEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);
    const unchanged = content.trim() === initialContent.trim();

    const handleSave = async () => {
        if (!content.trim() || unchanged) return;
        setIsSaving(true);
        const saved = await onSave(content);
        setIsSaving(false);
        if (saved) onCancel();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSave();
        }
        if (event.key === "Escape") onCancel();
    };

    return (
        <div className="flex w-full flex-col gap-2">
            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSaving}
                rows={3}
                autoFocus
                aria-label="Editar mensaje"
                className="text-text-inverse placeholder:text-text-inverse/60 w-full min-w-[240px] resize-y rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm outline-hidden focus:border-white/60"
            />
            <div className="flex justify-end gap-2 text-xs">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="text-text-inverse/80 rounded-md px-3 py-1 transition hover:bg-white/10"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !content.trim() || unchanged}
                    className="text-brand-primary rounded-md bg-white px-3 py-1 font-medium transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving ? "Enviando..." : "Guardar y enviar"}
                </button>
            </div>
        </div>
    );
}

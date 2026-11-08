"use client";

import { useEffect, useState } from "react";
import { Edit3, X } from "lucide-react";
import { toast } from "sonner";

interface RenameConversationDialogProps {
    isOpen: boolean;
    initialTitle: string;
    conversationId: string;
    onClose: () => void;
    onRename: (id: string, newTitle: string) => Promise<boolean>;
}

export function RenameConversationDialog({
    isOpen,
    initialTitle,
    conversationId,
    onClose,
    onRename,
}: RenameConversationDialogProps) {
    const [title, setTitle] = useState(initialTitle);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) {
            toast.error("El título no puede estar vacío");
            return;
        }

        setIsSubmitting(true);
        try {
            const success = await onRename(conversationId, trimmed);
            if (success) {
                toast.success("Conversación renombrada");
                onClose();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-elevation-2 animate-in fade-in zoom-in-95 duration-150">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-lg p-1.5 text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
                    aria-label="Cerrar modal"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                        <Edit3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Renombrar chat</h3>
                        <p className="text-xs text-text-secondary">Asigna un nombre descriptivo a esta conversación</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej. Receta Pasta Carbonara"
                            maxLength={100}
                            autoFocus
                            disabled={isSubmitting}
                            className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-sm text-text-primary outline-hidden transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-semibold text-text-inverse transition hover:bg-brand-primary-hover disabled:opacity-50"
                        >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

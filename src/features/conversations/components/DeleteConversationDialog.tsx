"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface DeleteConversationDialogProps {
    isOpen: boolean;
    conversationTitle: string;
    conversationId: string;
    onClose: () => void;
    onDelete: (id: string) => Promise<boolean>;
}

export function DeleteConversationDialog({
    isOpen,
    conversationTitle,
    conversationId,
    onClose,
    onDelete,
}: DeleteConversationDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const success = await onDelete(conversationId);
            if (success) {
                toast.success("Conversación eliminada");
                onClose();
            }
        } finally {
            setIsDeleting(false);
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-error/15 text-status-error">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">¿Eliminar conversación?</h3>
                        <p className="text-xs text-text-secondary">Esta acción no se puede deshacer</p>
                    </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    Se borrará permanentemente la conversación{" "}
                    <span className="font-semibold text-text-primary">&ldquo;{conversationTitle}&rdquo;</span> y
                    todos sus mensajes asociados.
                </p>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-xl px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-2 rounded-xl bg-status-error px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>{isDeleting ? "Eliminando..." : "Eliminar"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ConversationItemData } from "../types/conversation.type";

const CONVERSATIONS_CHANGED_EVENT = "dolce-vita:conversations-changed";

export function notifyConversationsChanged() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(CONVERSATIONS_CHANGED_EVENT));
    }
}

async function requestConversations(): Promise<ConversationItemData[]> {
    const res = await fetch("/api/conversations", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || "Error al cargar conversaciones");
    }

    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
}

export function useConversation() {
    const [conversations, setConversations] = useState<ConversationItemData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConversations = useCallback(() => {
        return requestConversations()
            .then((data) => {
                setConversations(data);
                setError(null);
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "Error inesperado");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const createConversation = useCallback(async (title?: string): Promise<ConversationItemData | null> => {
        try {
            const res = await fetch("/api/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: title || "Nueva conversación" }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.error?.message || "Error al crear conversación");
            }

            const json = await res.json();
            const newConv: ConversationItemData = json.data;
            setConversations((prev) => [newConv, ...prev]);
            notifyConversationsChanged();
            return newConv;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error inesperado";
            toast.error(message);
            return null;
        }
    }, []);

    const renameConversation = useCallback(async (id: string, newTitle: string): Promise<boolean> => {
        try {
            const res = await fetch(`/api/conversations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.error?.message || "Error al renombrar conversación");
            }

            setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
            );
            notifyConversationsChanged();
            return true;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error inesperado";
            toast.error(message);
            return false;
        }
    }, []);

    const deleteConversation = useCallback(async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`/api/conversations/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.error?.message || "Error al eliminar conversación");
            }

            setConversations((prev) => prev.filter((c) => c.id !== id));
            notifyConversationsChanged();
            return true;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error inesperado";
            toast.error(message);
            return false;
        }
    }, []);

    useEffect(() => {
        fetchConversations();

        const handleUpdate = () => {
            fetchConversations();
        };

        window.addEventListener(CONVERSATIONS_CHANGED_EVENT, handleUpdate);
        return () => {
            window.removeEventListener(CONVERSATIONS_CHANGED_EVENT, handleUpdate);
        };
    }, [fetchConversations]);

    return {
        conversations,
        isLoading,
        error,
        fetchConversations,
        createConversation,
        renameConversation,
        deleteConversation,
    };
}

"use client";

import { useMemo, useState } from "react";
import { MessageSquareOff, Search } from "lucide-react";
import { ConversationItemData } from "../types/conversation.type";
import { ConversationItem } from "./ConversationItem";

interface ConversationListProps {
    conversations: ConversationItemData[];
    activeId?: string;
    isLoading?: boolean;
    onRename: (id: string, newTitle: string) => Promise<boolean>;
    onDelete: (id: string) => Promise<boolean>;
    onSelect?: () => void;
}

export function ConversationList({
    conversations,
    activeId,
    isLoading = false,
    onRename,
    onDelete,
    onSelect,
}: ConversationListProps) {
    const [search, setSearch] = useState("");

    const filteredConversations = useMemo(() => {
        if (!search.trim()) return conversations;
        const query = search.toLowerCase();
        return conversations.filter((c) =>
            (c.title || "").toLowerCase().includes(query)
        );
    }, [conversations, search]);

    const groupedConversations = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const yesterday = today - 86400000;
        const lastWeek = today - 86400000 * 7;

        const groups: { [key: string]: ConversationItemData[] } = {
            Hoy: [],
            Ayer: [],
            "Últimos 7 días": [],
            Anteriores: [],
        };

        filteredConversations.forEach((conv) => {
            const time = new Date(conv.updatedAt || conv.createdAt).getTime();
            if (time >= today) {
                groups["Hoy"].push(conv);
            } else if (time >= yesterday) {
                groups["Ayer"].push(conv);
            } else if (time >= lastWeek) {
                groups["Últimos 7 días"].push(conv);
            } else {
                groups["Anteriores"].push(conv);
            }
        });

        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [filteredConversations]);

    if (isLoading) {
        return (
            <div className="space-y-2 p-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-9 w-full animate-pulse rounded-xl bg-surface-muted"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="px-3 pb-2 pt-1">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Buscar chats..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface-muted py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-secondary/70 focus:border-brand-primary focus:outline-hidden"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-4">
                {groupedConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                        <MessageSquareOff className="h-8 w-8 text-text-secondary/50 mb-2" />
                        <p className="text-xs text-text-secondary">
                            {search ? "No se encontraron conversaciones" : "Aún no tienes conversaciones"}
                        </p>
                    </div>
                ) : (
                    groupedConversations.map(([label, items]) => (
                        <div key={label} className="space-y-1">
                            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary/70">
                                {label}
                            </span>
                            <div className="space-y-0.5">
                                {items.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={conv.id === activeId}
                                        onRename={onRename}
                                        onDelete={onDelete}
                                        onSelect={onSelect}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

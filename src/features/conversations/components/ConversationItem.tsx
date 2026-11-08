"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { ConversationItemData } from "../types/conversation.type";
import { RenameConversationDialog } from "./RenameConversationDialog";
import { DeleteConversationDialog } from "./DeleteConversationDialog";

interface ConversationItemProps {
    conversation: ConversationItemData;
    isActive?: boolean;
    onRename: (id: string, newTitle: string) => Promise<boolean>;
    onDelete: (id: string) => Promise<boolean>;
    onSelect?: () => void;
}

export function ConversationItem({
    conversation,
    isActive = false,
    onRename,
    onDelete,
    onSelect,
}: ConversationItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    return (
        <>
            <div
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 transition text-sm ${
                    isActive
                        ? "bg-brand-primary/10 text-brand-primary font-medium"
                        : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                }`}
            >
                <Link
                    href={`/chat/${conversation.id}`}
                    onClick={onSelect}
                    className="flex min-w-0 flex-1 items-center gap-2.5"
                >
                    <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? "text-brand-primary" : "text-text-secondary"}`} />
                    <span className="truncate">{conversation.title || "Nueva conversación"}</span>
                </Link>

                <div className="relative shrink-0">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMenuOpen((prev) => !prev);
                        }}
                        className={`rounded-lg p-1 transition opacity-0 group-hover:opacity-100 ${
                            isMenuOpen ? "!opacity-100 bg-surface-raised" : "hover:bg-surface-raised"
                        }`}
                        aria-label="Opciones de conversación"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsMenuOpen(false);
                                }}
                            />
                            <div className="absolute right-0 top-full z-30 mt-1 w-36 rounded-xl border border-border bg-surface py-1 shadow-elevation-2 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsMenuOpen(false);
                                        setIsRenameOpen(true);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-text-primary transition hover:bg-surface-muted"
                                >
                                    <Pencil className="h-3.5 w-3.5 text-text-secondary" />
                                    <span>Renombrar</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsMenuOpen(false);
                                        setIsDeleteOpen(true);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-status-error transition hover:bg-status-error/10"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <RenameConversationDialog
                isOpen={isRenameOpen}
                initialTitle={conversation.title}
                conversationId={conversation.id}
                onClose={() => setIsRenameOpen(false)}
                onRename={onRename}
            />

            <DeleteConversationDialog
                isOpen={isDeleteOpen}
                conversationTitle={conversation.title}
                conversationId={conversation.id}
                onClose={() => setIsDeleteOpen(false)}
                onDelete={onDelete}
            />
        </>
    );
}

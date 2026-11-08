"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Calendar,
    MessageSquare,
    MessageSquareOff,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { useConversation } from "@/features/conversations/hooks/useConversation";
import { RenameConversationDialog } from "@/features/conversations/components/RenameConversationDialog";
import { DeleteConversationDialog } from "@/features/conversations/components/DeleteConversationDialog";
import { ConversationItemData } from "@/features/conversations/types/conversation.type";

export default function ConversationsHistoryPage() {
    const router = useRouter();
    const { conversations, isLoading, createConversation, renameConversation, deleteConversation } =
        useConversation();

    const [search, setSearch] = useState("");
    const [selectedConv, setSelectedConv] = useState<ConversationItemData | null>(null);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        if (!search.trim()) return conversations;
        const q = search.toLowerCase();
        return conversations.filter((c) => (c.title || "").toLowerCase().includes(q));
    }, [conversations, search]);

    const handleNewChat = async () => {
        const newConv = await createConversation("Nueva conversación");
        if (newConv) {
            router.push(`/chat/${newConv.id}`);
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-background p-6 md:p-10">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl md:text-3xl font-bold text-text-primary">
                            Historial de Conversaciones
                        </h1>
                        <p className="text-sm text-text-secondary">
                            Revisa, gestiona y retoma todas tus interacciones con el Chef George.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleNewChat}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition hover:bg-brand-primary-hover active:scale-[0.98] self-start sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Nuevo Chat</span>
                    </button>
                </div>

                {/* Filter / Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-secondary" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar en el historial de chats..."
                        className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary/70 outline-hidden transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    />
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-32 animate-pulse rounded-2xl border border-border bg-surface-muted"
                            />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                        <MessageSquareOff className="h-10 w-10 text-text-secondary/50 mb-3" />
                        <h3 className="text-base font-semibold text-text-primary">
                            {search ? "No se encontraron coincidencias" : "Sin conversaciones previas"}
                        </h3>
                        <p className="text-xs text-text-secondary mt-1 max-w-sm">
                            {search
                                ? "Intenta con otro término de búsqueda."
                                : "Comienza un nuevo chat con el Chef George para guardar tus recetas y técnicas favoritas."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((conv) => {
                            const dateStr = new Date(conv.updatedAt || conv.createdAt).toLocaleDateString(
                                undefined,
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }
                            );

                            return (
                                <div
                                    key={conv.id}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition hover:border-brand-primary/50 hover:shadow-elevation-1"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                                                <MessageSquare className="h-4 w-4" />
                                            </div>

                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveMenuId(activeMenuId === conv.id ? null : conv.id)
                                                    }
                                                    className="rounded-lg p-1.5 text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
                                                    aria-label="Opciones"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>

                                                {activeMenuId === conv.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-20"
                                                            onClick={() => setActiveMenuId(null)}
                                                        />
                                                        <div className="absolute right-0 top-full z-30 mt-1 w-36 rounded-xl border border-border bg-surface py-1 shadow-elevation-2 animate-in fade-in zoom-in-95 duration-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setActiveMenuId(null);
                                                                    setSelectedConv(conv);
                                                                    setIsRenameOpen(true);
                                                                }}
                                                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-text-primary hover:bg-surface-muted"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5 text-text-secondary" />
                                                                <span>Renombrar</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setActiveMenuId(null);
                                                                    setSelectedConv(conv);
                                                                    setIsDeleteOpen(true);
                                                                }}
                                                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-status-error hover:bg-status-error/10"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                <span>Eliminar</span>
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <Link href={`/chat/${conv.id}`} className="mt-3 block">
                                            <h3 className="font-semibold text-text-primary line-clamp-1 group-hover:text-brand-primary transition-colors">
                                                {conv.title || "Nueva conversación"}
                                            </h3>
                                        </Link>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-text-secondary">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{dateStr}</span>
                                        </div>

                                        <Link
                                            href={`/chat/${conv.id}`}
                                            className="text-xs font-semibold text-brand-primary hover:underline"
                                        >
                                            Abrir &rarr;
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedConv && (
                <>
                    <RenameConversationDialog
                        isOpen={isRenameOpen}
                        initialTitle={selectedConv.title}
                        conversationId={selectedConv.id}
                        onClose={() => {
                            setIsRenameOpen(false);
                            setSelectedConv(null);
                        }}
                        onRename={renameConversation}
                    />
                    <DeleteConversationDialog
                        isOpen={isDeleteOpen}
                        conversationTitle={selectedConv.title}
                        conversationId={selectedConv.id}
                        onClose={() => {
                            setIsDeleteOpen(false);
                            setSelectedConv(null);
                        }}
                        onDelete={deleteConversation}
                    />
                </>
            )}
        </div>
    );
}

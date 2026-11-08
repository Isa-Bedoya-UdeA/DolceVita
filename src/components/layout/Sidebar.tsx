"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { History, Plus, UtensilsCrossed } from "lucide-react";
import { ConversationList } from "@/features/conversations/components/ConversationList";
import { useConversation } from "@/features/conversations/hooks/useConversation";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";

interface SidebarProps {
    onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { conversations, isLoading, createConversation, renameConversation, deleteConversation } =
        useConversation();

    // Extract active conversation id from pathname e.g. /chat/[id]
    const match = pathname.match(/\/chat\/([a-zA-Z0-9-]+)/);
    const activeId = match ? match[1] : undefined;

    const handleNewChat = async () => {
        const newConv = await createConversation("Nueva conversación");
        if (newConv) {
            router.push(`/chat/${newConv.id}`);
            onCloseMobile?.();
        }
    };

    return (
        <aside className="flex h-full w-72 flex-col border-r border-border bg-surface text-text-primary transition-all">
            {/* Top Brand / Logo */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Link
                    href="/"
                    onClick={onCloseMobile}
                    className="flex items-center gap-2.5 transition hover:opacity-85"
                >
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 overflow-hidden">
                        <Image
                            src="/images/Logo.png"
                            alt="Dolce Vita Logo"
                            width={28}
                            height={28}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-lg font-bold tracking-tight text-brand-primary">
                            Dolce Vita
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-text-secondary">
                            Chef George AI
                        </span>
                    </div>
                </Link>
            </div>

            {/* Action Button: Nuevo Chat */}
            <div className="p-3">
                <button
                    type="button"
                    onClick={handleNewChat}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-text-inverse shadow-sm transition hover:bg-brand-primary-hover active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4" />
                    <span>Nuevo Chat</span>
                </button>
            </div>

            {/* Middle: Conversations List */}
            <div className="flex-1 overflow-hidden">
                <ConversationList
                    conversations={conversations}
                    activeId={activeId}
                    isLoading={isLoading}
                    onRename={renameConversation}
                    onDelete={deleteConversation}
                    onSelect={onCloseMobile}
                />
            </div>

            {/* Bottom Actions & Footer */}
            <div className="border-t border-border p-3 space-y-2">
                <Link
                    href="/conversations"
                    onClick={onCloseMobile}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                        pathname === "/conversations"
                            ? "bg-brand-primary/10 text-brand-primary"
                            : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                    }`}
                >
                    <History className="h-4 w-4" />
                    <span>Historial de chats</span>
                </Link>

                <div className="flex items-center justify-between rounded-xl bg-surface-muted px-3 py-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary">
                            <UtensilsCrossed className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-medium text-text-secondary">Tema</span>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}

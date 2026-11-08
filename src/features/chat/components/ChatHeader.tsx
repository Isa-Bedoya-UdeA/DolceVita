"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

interface ChatHeaderProps {
    title?: string;
    subtitle?: string;
}

export function ChatHeader({
    title = "Chef George",
    subtitle = "Experto en alta cocina, técnicas culinarias y maridaje",
}: ChatHeaderProps) {
    return (
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
            <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 overflow-hidden shadow-xs">
                    <Image
                        src="/images/Logo.png"
                        alt="Chef George"
                        width={26}
                        height={26}
                        className="object-contain"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-text-primary">{title}</h2>
                        <span className="flex items-center gap-1 rounded-full bg-status-success/15 px-2 py-0.5 text-[10px] font-semibold text-status-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
                            En línea
                        </span>
                    </div>
                    <p className="text-xs text-text-secondary">{subtitle}</p>
                </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-text-secondary bg-surface-muted px-3 py-1.5 rounded-xl border border-border">
                <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                <span>Modelo Gastronómico George v1.0</span>
            </div>
        </div>
    );
}

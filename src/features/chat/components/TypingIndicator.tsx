"use client";

import Image from "next/image";

export function TypingIndicator() {
    return (
        <div className="flex items-start gap-3 py-3 animate-in fade-in duration-200">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 overflow-hidden">
                <Image
                    src="/images/Logo.png"
                    alt="Chef George"
                    width={22}
                    height={22}
                    className="object-contain"
                />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs bg-surface-muted px-4 py-3 border border-border">
                <span className="h-2 w-2 rounded-full bg-brand-primary/60 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-brand-primary/80 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-brand-primary animate-bounce" />
            </div>
        </div>
    );
}

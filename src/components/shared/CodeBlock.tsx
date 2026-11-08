"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CodeBlockProps {
    language?: string;
    value: string;
}

export function CodeBlock({ language = "text", value }: CodeBlockProps) {
    const { isCopied, copy } = useCopyToClipboard({
        successMessage: "Código copiado",
    });

    return (
        <div className="relative my-4 overflow-hidden rounded-xl border border-border bg-surface-muted">
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2 text-xs font-medium text-text-secondary">
                <span className="uppercase tracking-wider">{language || "código"}</span>
                <button
                    type="button"
                    onClick={() => copy(value)}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-text-secondary transition hover:bg-surface-raised hover:text-text-primary"
                    aria-label="Copiar código"
                >
                    {isCopied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-brand-primary" />
                            <span>Copiado</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copiar</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="overflow-x-auto p-4 text-xs md:text-sm font-mono leading-relaxed text-text-primary">
                <code>{value}</code>
            </pre>
        </div>
    );
}

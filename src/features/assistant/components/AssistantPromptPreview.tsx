"use client";

import { useState } from "react";
import { ChevronDown, Eye } from "lucide-react";

interface AssistantPromptPreviewProps {
    systemPrompt: string;
    guardrails: string;
}

/** Shows the exact system message sent to the model: the editable prompt plus the fixed rules. */
export function AssistantPromptPreview({ systemPrompt, guardrails }: AssistantPromptPreviewProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-border bg-surface rounded-2xl border">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
                <span className="text-text-primary flex items-center gap-2 text-sm font-semibold">
                    <Eye className="text-brand-primary h-4 w-4" />
                    Vista previa del mensaje de sistema completo
                </span>
                <ChevronDown
                    className={`text-text-secondary h-4 w-4 transition ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div className="border-border space-y-3 border-t px-5 py-4">
                    <p className="text-text-secondary text-xs">
                        Las reglas obligatorias se agregan siempre al final y no se pueden editar
                        desde el panel: mantienen el dominio gastronómico, el manejo de la
                        incertidumbre y la protección contra cambios de rol.
                    </p>
                    <pre className="bg-surface-muted text-text-primary max-h-96 overflow-auto rounded-xl p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                        {systemPrompt.trim()}
                        {"\n\n"}
                        <span className="text-brand-primary">{guardrails}</span>
                    </pre>
                </div>
            )}
        </div>
    );
}

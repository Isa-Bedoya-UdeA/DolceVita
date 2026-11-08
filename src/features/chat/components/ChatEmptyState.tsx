"use client";

import Image from "next/image";
import { Sparkles, Utensils, Wine, Clock, Flame } from "lucide-react";

interface ChatEmptyStateProps {
    onSelectPrompt: (prompt: string) => void;
}

const CULINARY_PROMPTS = [
    {
        icon: Utensils,
        title: "Risotto Cremoso",
        prompt: "¿Cuál es el secreto y la técnica paso a paso para lograr un risotto de hongos perfecto?",
    },
    {
        icon: Flame,
        title: "Salsa Holandesa",
        prompt: "Explícame cómo emulsionar una salsa holandesa clásica sin que se corte.",
    },
    {
        icon: Wine,
        title: "Maridaje Gourmet",
        prompt: "¿Qué vino y perfil aromático recomiendas para acompañar un salmón a las finas hierbas?",
    },
    {
        icon: Clock,
        title: "Sustitutos en Cocina",
        prompt: "¿Cuáles son los mejores sustitutos del vino blanco para desglasar una sartén?",
    },
];

export function ChatEmptyState({ onSelectPrompt }: ChatEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 max-w-2xl mx-auto text-center">
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-primary/10 shadow-elevation-1 p-3">
                <Image
                    src="/images/Logo.png"
                    alt="Chef George"
                    width={56}
                    height={56}
                    className="object-contain"
                    priority
                />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Asistente Culinario Experto</span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-2">
                ¿Qué platillo crearemos hoy?
            </h2>
            <p className="text-sm text-text-secondary max-w-md leading-relaxed mb-8">
                Soy el Chef George. Pregúntame sobre técnicas gastronómicas, maridajes, recetas de alta cocina o dudas culinarias.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {CULINARY_PROMPTS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => onSelectPrompt(item.prompt)}
                            className="flex flex-col items-start gap-1.5 rounded-2xl border border-border bg-surface p-4 text-left transition hover:border-brand-primary hover:bg-surface-muted hover:shadow-elevation-1 group"
                        >
                            <div className="flex items-center gap-2 text-brand-primary">
                                <Icon className="h-4 w-4 transition group-hover:scale-110" />
                                <span className="text-xs font-bold uppercase tracking-wider">{item.title}</span>
                            </div>
                            <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                                {item.prompt}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

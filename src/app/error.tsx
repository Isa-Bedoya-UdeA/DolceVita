"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Registrar el error para observabilidad sin exponer trazas en producción
        console.error("Error capturado por error boundary:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
            <div className="bg-error/15 text-error-foreground shadow-elevation-1 flex h-20 w-20 items-center justify-center rounded-2xl">
                <AlertTriangle className="text-error-foreground h-10 w-10" />
            </div>
            <span className="bg-error/10 text-error-foreground mt-6 rounded-full px-3 py-1 font-mono text-xs font-semibold tracking-wider uppercase">
                Imprevisto en la cocina
            </span>
            <h1 className="font-heading text-text-primary mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Ocurrió un error inesperado
            </h1>
            <p className="text-text-secondary mt-3 max-w-md text-base">
                Tuvimos un fallo técnico procesando tu solicitud culinaria. Puedes intentar de nuevo
                la acción o regresar al inicio.
            </p>
            {error.digest && (
                <p className="text-text-secondary mt-2 font-mono text-xs opacity-70">
                    Código de referencia: {error.digest}
                </p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-brand-primary text-text-inverse shadow-elevation-1 duration-normal hover:bg-brand-primary-hover focus:ring-brand-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                    <RotateCcw className="h-4 w-4" />
                    Intentar nuevamente
                </button>
                <Link
                    href="/"
                    className="border-border bg-surface text-text-primary shadow-elevation-0 duration-normal hover:bg-surface-muted focus:ring-border inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                    <Home className="h-4 w-4" />
                    Volver al inicio
                </Link>
            </div>
        </main>
    );
}

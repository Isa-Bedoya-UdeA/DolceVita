"use client";

import { AlertOctagon, RotateCcw } from "lucide-react";

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    return (
        <html lang="es" className="h-full">
            <body className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F6] p-6 text-center font-sans text-[#29231F] antialiased">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FCE9E7] text-[#A63228] shadow-md">
                    <AlertOctagon className="h-10 w-10 text-[#A63228]" />
                </div>
                <span className="mt-6 rounded-full bg-[#FCE9E7] px-3 py-1 font-mono text-xs font-semibold tracking-wider text-[#A63228] uppercase">
                    Error crítico del sistema
                </span>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#29231F] sm:text-4xl">
                    Fallo global en la aplicación
                </h1>
                <p className="mt-3 max-w-md text-base text-[#766B63]">
                    No se pudo renderizar la estructura raíz de Dolce Vita. Por favor reintenta la
                    carga o recarga la página.
                </p>
                {error.digest && (
                    <p className="mt-2 font-mono text-xs text-[#766B63] opacity-70">
                        Código de referencia: {error.digest}
                    </p>
                )}
                <div className="mt-8">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#F54900] px-6 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-[#D93F00] focus:ring-2 focus:ring-[#F54900] focus:ring-offset-2 focus:outline-none"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reiniciar aplicación
                    </button>
                </div>
            </body>
        </html>
    );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquare, ShieldAlert } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes.constants";

export const metadata: Metadata = {
    title: "Acceso denegado | Dolce Vita",
};

export default function ForbiddenPage() {
    return (
        <main className="bg-background flex min-h-screen items-center justify-center p-4">
            <div className="border-border bg-surface shadow-elevation-1 w-full max-w-md rounded-2xl border p-8 text-center">
                <div className="bg-error text-error-foreground mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl">
                    <ShieldAlert className="h-7 w-7" aria-hidden="true" />
                </div>
                <p className="text-brand-primary font-mono text-xs font-semibold tracking-widest uppercase">
                    Error 403
                </p>
                <h1 className="font-heading text-text-primary mt-1 text-2xl font-bold tracking-tight">
                    Acceso denegado
                </h1>
                <p className="text-text-secondary mt-2 text-sm">
                    Esta sección está reservada para administradores. Si crees que deberías tener
                    acceso, pide a un administrador que revise tu rol.
                </p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Link
                        href={ROUTES.CHAT}
                        className="bg-brand-primary text-text-inverse hover:bg-brand-primary-hover inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Ir al chat
                    </Link>
                    <Link
                        href={ROUTES.HOME}
                        className="border-border text-text-primary hover:bg-surface-muted inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </main>
    );
}

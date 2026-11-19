"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bot, LayoutDashboard, Loader2, ShieldAlert, Users } from "lucide-react";
import { useCurrentUser } from "@/features/session/hooks/useCurrentUser";

const TABS = [
    { href: "/admin", label: "Resumen", icon: LayoutDashboard },
    { href: "/admin/users", label: "Usuarios", icon: Users },
    { href: "/admin/assistant", label: "Asistente", icon: Bot },
    { href: "/admin/statistics", label: "Estadísticas", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isAdmin, isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2
                    className="text-brand-primary h-6 w-6 animate-spin"
                    aria-label="Cargando"
                />
            </div>
        );
    }

    // UX only: the API validates the ADMIN role on every request.
    if (!isAdmin) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <div className="max-w-sm text-center">
                    <div className="bg-error text-error-foreground mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <h1 className="text-text-primary text-lg font-bold">Acceso restringido</h1>
                    <p className="text-text-secondary mt-1 text-sm">
                        El panel de administración solo está disponible para usuarios con rol de
                        administrador.
                    </p>
                    <Link
                        href="/chat"
                        className="bg-brand-primary text-text-inverse hover:bg-brand-primary-hover mt-5 inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                    >
                        Volver al chat
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background h-full overflow-y-auto">
            <nav
                aria-label="Secciones de administración"
                className="border-border bg-surface/90 sticky top-0 z-10 border-b backdrop-blur-sm"
            >
                <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 md:px-10">
                    {TABS.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? "page" : undefined}
                                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3.5 text-sm font-medium transition ${
                                    active
                                        ? "border-brand-primary text-brand-primary"
                                        : "text-text-secondary hover:text-text-primary border-transparent"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
            <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-10">{children}</div>
        </div>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronsUpDown, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "@/features/session/hooks/useCurrentUser";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLE_LABELS } from "@/lib/constants/roles.constants";
import { ROUTES } from "@/lib/constants/routes.constants";

function initials(name: string | null | undefined, email: string | undefined): string {
    const source = name?.trim() || email || "?";
    const parts = source.split(/\s+/).filter(Boolean);
    const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
    return letters.toUpperCase();
}

interface UserMenuProps {
    onNavigate?: () => void;
}

export function UserMenu({ onNavigate }: UserMenuProps) {
    const { user, isLoading, isAdmin } = useCurrentUser();
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
    };

    if (isLoading) {
        return (
            <div className="bg-surface-muted flex h-12 items-center gap-2.5 rounded-xl px-3">
                <div className="bg-border h-8 w-8 animate-pulse rounded-full" />
                <div className="bg-border h-3 w-24 animate-pulse rounded" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div ref={containerRef} className="relative">
            {open && (
                <div
                    role="menu"
                    aria-label="Menú de usuario"
                    className="border-border bg-surface-raised shadow-elevation-2 absolute right-0 bottom-full left-0 z-20 mb-2 overflow-hidden rounded-xl border p-1.5"
                >
                    <div className="border-border mb-1 border-b px-2.5 pt-1.5 pb-2.5">
                        <p className="text-text-primary truncate text-sm font-semibold">
                            {user.name || "Sin nombre"}
                        </p>
                        <p className="text-text-secondary truncate text-xs">{user.email}</p>
                    </div>

                    {isAdmin && (
                        <Link
                            href={ROUTES.ADMIN}
                            role="menuitem"
                            onClick={() => {
                                setOpen(false);
                                onNavigate?.();
                            }}
                            className="text-text-primary hover:bg-surface-muted flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition"
                        >
                            <ShieldCheck className="text-brand-primary h-4 w-4" />
                            Panel de administración
                        </Link>
                    )}

                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="text-error-foreground hover:bg-error flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition disabled:opacity-60"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4" />
                        )}
                        {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                    </button>
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="hover:bg-surface-muted focus-visible:ring-brand-primary flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition focus-visible:ring-2 focus-visible:outline-none"
            >
                <span
                    aria-hidden="true"
                    className="bg-brand-primary/15 text-brand-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                >
                    {initials(user.name, user.email)}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="text-text-primary block truncate text-sm font-medium">
                        {user.name || user.email}
                    </span>
                    <span
                        className={`mt-0.5 inline-flex rounded-md px-1.5 py-px text-[10px] font-semibold tracking-wide uppercase ${
                            isAdmin
                                ? "bg-brand-primary/15 text-brand-primary"
                                : "bg-surface-muted text-text-secondary"
                        }`}
                    >
                        {ROLE_LABELS[user.role]}
                    </span>
                </span>
                <ChevronsUpDown className="text-text-secondary h-4 w-4 shrink-0" />
            </button>
        </div>
    );
}

export default UserMenu;

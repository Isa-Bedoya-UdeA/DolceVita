"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-text-primary">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:h-full md:shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Drawer Backdrop & Sidebar */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out md:hidden ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="relative h-full">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="absolute right-3 top-4 z-10 rounded-lg p-1 text-text-secondary hover:bg-surface-muted"
                        aria-label="Cerrar barra lateral"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <Sidebar onCloseMobile={() => setMobileOpen(false)} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Mobile Topbar */}
                <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="rounded-lg p-1.5 text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
                        aria-label="Abrir menú"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/Logo.png"
                            alt="Dolce Vita"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                        <span className="font-serif text-base font-bold text-brand-primary">Dolce Vita</span>
                    </Link>

                    <div className="w-8" />
                </header>

                <main className="flex-1 overflow-hidden relative">{children}</main>
            </div>
        </div>
    );
}

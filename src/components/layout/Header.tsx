"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, UserCheck } from "lucide-react";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";

interface NavItem {
    label: string;
    href: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: "Especialidades", href: "#especialidades" },
    { label: "Sobre George", href: "#asistente" },
    { label: "Consultas", href: "#consultas" },
    { label: "Evaluación", href: "#evaluacion" },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header className="border-border bg-surface/85 sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand / Logo with Logo.png and text */}
                <Link
                    href="/"
                    className="focus:ring-brand-primary group flex items-center gap-3 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    aria-label="Dolce Vita - Inicio"
                >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                        <Image
                            src="/images/Logo.png"
                            alt="Dolce Vita Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10 object-contain drop-shadow-xs transition-transform group-hover:scale-105"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-heading text-text-primary text-xl font-bold tracking-tight">
                            Dolce Vita
                        </span>
                        <span className="text-text-secondary -mt-1 font-mono text-[10px] tracking-wide uppercase">
                            AI Gastronomic Expert
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav
                    className="hidden items-center gap-1 md:flex"
                    aria-label="Navegación principal de la landing"
                >
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-text-secondary hover:text-text-primary hover:bg-surface-muted/60 focus:ring-brand-primary rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Right Actions: Theme Toggle & Auth Buttons */}
                <div className="hidden items-center gap-3 md:flex">
                    {/* Theme Selector Toggle */}
                    <ThemeToggle />

                    <div className="bg-border h-5 w-px" aria-hidden="true" />

                    <Link
                        href="/login"
                        className="text-text-primary hover:text-brand-primary hover:bg-surface-muted/60 focus:ring-brand-primary inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
                    >
                        <UserCheck className="text-brand-secondary h-4 w-4" />
                        <span>Iniciar Sesión</span>
                    </Link>

                    <Link
                        href="/register"
                        className="bg-brand-primary text-text-inverse hover:bg-brand-primary-hover shadow-elevation-1 focus:ring-brand-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    >
                        <span>Comenzar</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {/* Mobile Controls: Theme Toggle & Hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="border-border bg-surface text-text-primary hover:bg-surface-muted focus:ring-brand-primary inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus:ring-2 focus:outline-none"
                        aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="border-border bg-surface border-b px-4 pt-2 pb-6 md:hidden">
                    <nav className="flex flex-col space-y-1" aria-label="Menú móvil">
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className="text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-lg px-3 py-2.5 text-base font-medium transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="border-border mt-4 border-t pt-4">
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/login"
                                onClick={closeMobileMenu}
                                className="border-border bg-surface text-text-primary hover:bg-surface-muted inline-flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors"
                            >
                                <UserCheck className="text-brand-secondary h-4 w-4" />
                                <span>Iniciar Sesión</span>
                            </Link>

                            <Link
                                href="/register"
                                onClick={closeMobileMenu}
                                className="bg-brand-primary text-text-inverse hover:bg-brand-primary-hover shadow-elevation-1 inline-flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors"
                            >
                                <span>Comenzar gratis</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;

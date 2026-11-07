"use client";

import { useTheme } from "../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
    const { resolvedTheme, toggleTheme, mounted } = useTheme();

    if (!mounted) {
        return (
            <button
                type="button"
                className={`border-border bg-surface text-text-muted inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${className}`}
                aria-label="Cambiando tema..."
                disabled
            >
                <span className="h-4 w-4" />
            </button>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`border-border bg-surface text-text-primary hover:bg-surface-elevated hover:text-primary focus:ring-primary inline-flex h-9 w-9 items-center justify-center rounded-lg border shadow-xs transition-colors focus:ring-2 focus:outline-hidden ${className}`}
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            {isDark ? (
                <Sun className="h-4 w-4 scale-100 rotate-0 transition-transform" />
            ) : (
                <Moon className="h-4 w-4 scale-100 rotate-0 transition-transform" />
            )}
        </button>
    );
}

export default ThemeToggle;

"use client";

import { useEffect, useState, useCallback } from "react";
import type { Theme, ResolvedTheme } from "../types/theme.type";

const THEME_STORAGE_KEY = "dolce-vita-theme";

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeToDocument(resolved: ResolvedTheme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (resolved === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
        root.setAttribute("data-theme", "dark");
        root.style.colorScheme = "dark";
    } else {
        root.classList.remove("dark");
        root.classList.add("light");
        root.setAttribute("data-theme", "light");
        root.style.colorScheme = "light";
    }
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const storedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || "system";
        setThemeState(storedTheme);

        const initialResolved: ResolvedTheme =
            storedTheme === "system" ? getSystemTheme() : storedTheme;
        setResolvedTheme(initialResolved);
        applyThemeToDocument(initialResolved);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleSystemChange = (e: MediaQueryListEvent) => {
            if (theme === "system") {
                const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
                setResolvedTheme(newResolved);
                applyThemeToDocument(newResolved);
            }
        };

        mediaQuery.addEventListener("change", handleSystemChange);
        return () => mediaQuery.removeEventListener("change", handleSystemChange);
    }, [theme, mounted]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        if (typeof window !== "undefined") {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            const resolved: ResolvedTheme = newTheme === "system" ? getSystemTheme() : newTheme;
            setResolvedTheme(resolved);
            applyThemeToDocument(resolved);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        const nextTheme: Theme = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
    }, [resolvedTheme, setTheme]);

    return {
        theme,
        resolvedTheme,
        mounted,
        setTheme,
        toggleTheme,
    };
}

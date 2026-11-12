"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { Theme, ResolvedTheme } from "../types/theme.type";

const THEME_STORAGE_KEY = "dolce-vita-theme";
const THEME_CHANGED_EVENT = "dolce-vita:theme-changed";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
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

function readStoredTheme(): Theme {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return stored === "light" || stored === "dark" ? stored : "system";
    } catch {
        return "system";
    }
}

function subscribeToTheme(onChange: () => void) {
    const mediaQuery = window.matchMedia(DARK_QUERY);
    window.addEventListener("storage", onChange);
    window.addEventListener(THEME_CHANGED_EVENT, onChange);
    mediaQuery.addEventListener("change", onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(THEME_CHANGED_EVENT, onChange);
        mediaQuery.removeEventListener("change", onChange);
    };
}

const noopSubscribe = () => () => {};

export function useTheme() {
    const theme = useSyncExternalStore<Theme>(subscribeToTheme, readStoredTheme, () => "system");
    const systemTheme = useSyncExternalStore<ResolvedTheme>(
        subscribeToTheme,
        getSystemTheme,
        () => "light",
    );
    const mounted = useSyncExternalStore(
        noopSubscribe,
        () => true,
        () => false,
    );
    const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

    useEffect(() => {
        if (mounted) applyThemeToDocument(resolvedTheme);
    }, [resolvedTheme, mounted]);

    const setTheme = useCallback((newTheme: Theme) => {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        window.dispatchEvent(new Event(THEME_CHANGED_EVENT));
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

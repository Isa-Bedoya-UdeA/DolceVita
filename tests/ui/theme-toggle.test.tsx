import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";

vi.mock("@/features/theme/hooks/useTheme", () => ({
    useTheme: vi.fn().mockReturnValue({
        theme: "dark",
        resolvedTheme: "dark",
        toggleTheme: vi.fn(),
        mounted: true,
    }),
}));

describe("ThemeToggle Component (UI)", () => {
    it("should render theme button in dark mode", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button", { name: /Cambiar a modo claro/i });
        expect(button).toBeInTheDocument();
    });

    it("should call toggleTheme when clicked", async () => {
        const { useTheme } = await import("@/features/theme/hooks/useTheme");
        const mockToggle = vi.fn();
        vi.mocked(useTheme).mockReturnValue({
            theme: "light",
            resolvedTheme: "light",
            toggleTheme: mockToggle,
            setTheme: vi.fn(),
            mounted: true,
        });

        render(<ThemeToggle />);
        const button = screen.getByRole("button", { name: /Cambiar a modo oscuro/i });
        await userEvent.click(button);

        expect(mockToggle).toHaveBeenCalledTimes(1);
    });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

// Mock next/image & navigation
vi.mock("next/image", () => ({
    default: (props: any) => <img {...props} />,
}));

vi.mock("next/navigation", () => ({
    usePathname: () => "/chat",
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));

vi.mock("@/features/conversations/hooks/useConversation", () => ({
    useConversation: () => ({
        conversations: [
            {
                id: "c-1",
                title: "Risotto de Hongos",
                userId: "user-1",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ],
        isLoading: false,
        createConversation: vi.fn(),
        renameConversation: vi.fn(),
        deleteConversation: vi.fn(),
    }),
}));

describe("Sidebar Navigation (UI)", () => {
    it("should render Dolce Vita brand, New Chat button, and active conversations", () => {
        render(<Sidebar />);

        expect(screen.getByText("Dolce Vita")).toBeInTheDocument();
        expect(screen.getByText("Nuevo Chat")).toBeInTheDocument();
        expect(screen.getByText("Risotto de Hongos")).toBeInTheDocument();
        expect(screen.getByText("Historial de chats")).toBeInTheDocument();
    });
});

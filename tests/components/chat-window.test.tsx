import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ChatEmptyState } from "@/features/chat/components/ChatEmptyState";
import { ChatHeader } from "@/features/chat/components/ChatHeader";

// Mock next/image
vi.mock("next/image", () => ({
    default: (props: any) => <img {...props} />,
}));

describe("Chat Components (UI)", () => {
    describe("ChatHeader", () => {
        it("should render the title and online status indicator", () => {
            render(<ChatHeader title="Risotto de Hongos" />);

            expect(screen.getByText("Risotto de Hongos")).toBeInTheDocument();
            expect(screen.getByText("En línea")).toBeInTheDocument();
            expect(screen.getByText(/Experto en alta cocina/i)).toBeInTheDocument();
        });
    });

    describe("ChatEmptyState", () => {
        it("should render welcome title and culinary prompt suggestions", () => {
            const onSelect = vi.fn();
            render(<ChatEmptyState onSelectPrompt={onSelect} />);

            expect(screen.getByText("¿Qué platillo crearemos hoy?")).toBeInTheDocument();
            expect(screen.getByText("Risotto Cremoso")).toBeInTheDocument();
            expect(screen.getByText("Salsa Holandesa")).toBeInTheDocument();
            expect(screen.getByText("Maridaje Gourmet")).toBeInTheDocument();
        });
    });
});

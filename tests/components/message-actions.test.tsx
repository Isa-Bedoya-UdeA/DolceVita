import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageActions } from "@/features/messages/components/MessageActions";
import { MessageEditor } from "@/features/messages/components/MessageEditor";

describe("MessageActions", () => {
    it("should show retry and feedback for the latest assistant answer", async () => {
        const onRetry = vi.fn();
        const onRate = vi.fn();
        render(
            <MessageActions
                content="Respuesta"
                isUser={false}
                canRetry
                rating="positive"
                onRetry={onRetry}
                onRate={onRate}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Regenerar respuesta" }));
        await userEvent.click(screen.getByRole("button", { name: "Respuesta poco útil" }));

        expect(onRetry).toHaveBeenCalledTimes(1);
        expect(onRate).toHaveBeenCalledWith("negative");
        expect(screen.getByRole("button", { name: "Respuesta útil" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
    });

    it("should hide retry on older answers and show edit on user messages", () => {
        const { rerender } = render(
            <MessageActions content="Respuesta" isUser={false} onRetry={vi.fn()} />,
        );
        expect(screen.queryByRole("button", { name: "Regenerar respuesta" })).toBeNull();

        rerender(<MessageActions content="Pregunta" isUser onEdit={vi.fn()} />);
        expect(screen.getByRole("button", { name: "Editar mensaje" })).toBeInTheDocument();
    });
});

describe("MessageEditor", () => {
    it("should submit the edited content and close on success", async () => {
        const onSave = vi.fn().mockResolvedValue(true);
        const onCancel = vi.fn();
        render(<MessageEditor initialContent="Hola" onSave={onSave} onCancel={onCancel} />);

        const textarea = screen.getByRole("textbox", { name: "Editar mensaje" });
        await userEvent.clear(textarea);
        await userEvent.type(textarea, "¿Cómo hago un risotto?");
        await userEvent.click(screen.getByRole("button", { name: "Guardar y enviar" }));

        expect(onSave).toHaveBeenCalledWith("¿Cómo hago un risotto?");
        expect(onCancel).toHaveBeenCalled();
    });
});

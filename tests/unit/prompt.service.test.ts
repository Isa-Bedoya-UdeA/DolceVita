import { describe, it, expect } from "vitest";
import { PromptService, HistoryMessage } from "@/server/services/prompt.service";
import { MessageRole } from "@/server/domain/enums/message-role.enum";
import { MessageStatus } from "@/server/domain/enums/message-status.enum";
import { ASSISTANT_GUARDRAILS } from "@/lib/constants/assistant.constants";

const turn = (
    role: MessageRole,
    content: string,
    status = MessageStatus.COMPLETED,
): HistoryMessage => ({
    role,
    content,
    status,
});

describe("PromptService (Unit)", () => {
    it("should prepend the configured system prompt with the mandatory guardrails", () => {
        const messages = new PromptService().buildMessages("Eres George", [
            turn(MessageRole.USER, "Hola"),
        ]);

        expect(messages[0].role).toBe("system");
        expect(messages[0].content.startsWith("Eres George")).toBe(true);
        expect(messages[0].content).toContain(ASSISTANT_GUARDRAILS);
        expect(messages[1]).toEqual({ role: "user", content: "Hola" });
    });

    it("should keep chronological order and map roles to the provider format", () => {
        const messages = new PromptService().buildMessages("Eres George", [
            turn(MessageRole.USER, "¿Qué es un sofrito?"),
            turn(MessageRole.ASSISTANT, "Es una base aromática..."),
            turn(MessageRole.USER, "¿Y cómo lo uso en un risotto?"),
        ]);

        expect(messages.slice(1).map((m) => m.role)).toEqual(["user", "assistant", "user"]);
    });

    it("should exclude failed, pending and empty messages", () => {
        const messages = new PromptService().buildMessages("Eres George", [
            turn(MessageRole.USER, "Pregunta 1"),
            turn(MessageRole.ASSISTANT, "Error", MessageStatus.FAILED),
            turn(MessageRole.ASSISTANT, "   "),
            turn(MessageRole.USER, "Pregunta 2"),
        ]);

        expect(messages.slice(1).map((m) => m.content)).toEqual(["Pregunta 1", "Pregunta 2"]);
    });

    it("should limit the context to the most recent turns", () => {
        const history = Array.from({ length: 10 }, (_, i) =>
            turn(i % 2 === 0 ? MessageRole.USER : MessageRole.ASSISTANT, `m${i}`),
        );

        const messages = new PromptService(4).buildMessages("Eres George", history);

        expect(messages.slice(1).map((m) => m.content)).toEqual(["m6", "m7", "m8", "m9"]);
    });

    it("should never start the context with an assistant turn", () => {
        const history = [
            turn(MessageRole.USER, "m0"),
            turn(MessageRole.ASSISTANT, "m1"),
            turn(MessageRole.USER, "m2"),
        ];

        const messages = new PromptService(2).buildMessages("Eres George", history);

        expect(messages.slice(1).map((m) => m.content)).toEqual(["m2"]);
    });
});

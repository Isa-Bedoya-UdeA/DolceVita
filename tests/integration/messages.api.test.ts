import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    GET as getMessages,
    POST as sendMessage,
} from "@/app/api/conversations/[id]/messages/route";

vi.mock("@/server/services/conversation.service", () => ({
    conversationService: {
        getConversationMessages: vi.fn().mockResolvedValue([
            {
                id: "msg-1",
                conversationId: "conv-1",
                role: "user",
                content: "Hola George",
                createdAt: "2026-01-01T00:00:00.000Z",
            },
        ]),
        addMessage: vi.fn().mockResolvedValue({
            userMessage: {
                id: "msg-user-1",
                conversationId: "conv-1",
                role: "user",
                content: "¿Cómo se hace una reducción de aceto balsámico?",
                createdAt: "2026-01-01T00:00:00.000Z",
            },
            assistantMessage: {
                id: "msg-ast-1",
                conversationId: "conv-1",
                role: "assistant",
                content: "La reducción de aceto balsámico requiere fuego muy bajo...",
                createdAt: "2026-01-01T00:00:01.000Z",
            },
        }),
    },
}));

vi.mock("@/server/auth/guards/auth.guard", () => ({
    AuthGuard: {
        authenticate: vi.fn().mockResolvedValue({
            id: "test-user-id",
            email: "user@dolcevita.com",
            name: "Usuario Gastrónomo",
            role: "USER",
        }),
    },
}));

describe("Conversation Messages API Route (Integration)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /api/conversations/[id]/messages", () => {
        it("should return 200 with list of messages", async () => {
            const req = new Request("http://localhost:3000/api/conversations/conv-1/messages", {
                method: "GET",
            });

            const res = await getMessages(req, {
                params: Promise.resolve({ id: "conv-1" }),
            });

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.data).toHaveLength(1);
            expect(json.data[0].content).toBe("Hola George");
        });
    });

    describe("POST /api/conversations/[id]/messages", () => {
        it("should return 201 with created user and assistant messages", async () => {
            const req = new Request("http://localhost:3000/api/conversations/conv-1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: "¿Cómo se hace una reducción de aceto balsámico?" }),
            });

            const res = await sendMessage(req, {
                params: Promise.resolve({ id: "conv-1" }),
            });

            expect(res.status).toBe(201);
            const json = await res.json();
            expect(json.data.userMessage).toBeDefined();
            expect(json.data.assistantMessage).toBeDefined();
            expect(json.data.assistantMessage.content).toContain("reducción");
        });
    });
});

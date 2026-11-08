import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as listConversations, POST as createConversation } from "@/app/api/conversations/route";
import {
    GET as getConversation,
    PATCH as renameConversation,
    DELETE as deleteConversation,
} from "@/app/api/conversations/[id]/route";

// Mock conversationService
vi.mock("@/server/services/conversation.service", () => {
    const dummy = {
        id: "conv-test-1",
        title: "Test Conversation",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
    };

    return {
        conversationService: {
            listConversations: vi.fn().mockResolvedValue([dummy]),
            createConversation: vi.fn().mockResolvedValue(dummy),
            getConversation: vi.fn().mockResolvedValue(dummy),
            renameConversation: vi.fn().mockResolvedValue({ ...dummy, title: "Renamed" }),
            deleteConversation: vi.fn().mockResolvedValue(undefined),
        },
    };
});

// Mock AuthGuard to avoid database dependency during API integration testing
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

describe("Conversations API Routes (Integration)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /api/conversations", () => {
        it("should return status 200 with list of conversations", async () => {
            const req = new Request("http://localhost:3000/api/conversations", {
                method: "GET",
            });

            const res = await listConversations(req);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.data).toHaveLength(1);
            expect(json.data[0].id).toBe("conv-test-1");
        });
    });

    describe("POST /api/conversations", () => {
        it("should return status 201 with newly created conversation", async () => {
            const req = new Request("http://localhost:3000/api/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Nueva Conversación Culinaria" }),
            });

            const res = await createConversation(req);
            expect(res.status).toBe(201);

            const json = await res.json();
            expect(json.data.id).toBe("conv-test-1");
        });
    });

    describe("GET /api/conversations/[id]", () => {
        it("should return status 200 with conversation details", async () => {
            const req = new Request("http://localhost:3000/api/conversations/conv-test-1", {
                method: "GET",
            });

            const res = await getConversation(req, {
                params: Promise.resolve({ id: "conv-test-1" }),
            });

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.data.id).toBe("conv-test-1");
        });
    });

    describe("PATCH /api/conversations/[id]", () => {
        it("should update conversation title and return 200", async () => {
            const req = new Request("http://localhost:3000/api/conversations/conv-test-1", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Renamed" }),
            });

            const res = await renameConversation(req, {
                params: Promise.resolve({ id: "conv-test-1" }),
            });

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.data.title).toBe("Renamed");
        });
    });

    describe("DELETE /api/conversations/[id]", () => {
        it("should delete conversation and return 204", async () => {
            const req = new Request("http://localhost:3000/api/conversations/conv-test-1", {
                method: "DELETE",
            });

            const res = await deleteConversation(req, {
                params: Promise.resolve({ id: "conv-test-1" }),
            });

            expect(res.status).toBe(204);
        });
    });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { MessageService } from "@/server/services/message.service";
import { FeedbackService } from "@/server/services/feedback.service";
import { AIProviderService } from "@/server/services/ai-provider.service";
import { IMessageRepository } from "@/server/domain/contracts/message-repository.contract";
import { IFeedbackRepository } from "@/server/repositories/feedback.repository";
import { MessageEntity } from "@/server/domain/entities/message.entity";
import { MessageRole } from "@/server/domain/enums/message-role.enum";
import { MessageStatus } from "@/server/domain/enums/message-status.enum";
import { AIProvider } from "@/server/domain/enums/ai-provider.enum";
import { prisma } from "@/server/infrastructure/database/prisma";

const record = (id: string, role: MessageRole, content: string, minute: number): MessageEntity => ({
    id,
    conversationId: "conv-1",
    senderId: role === MessageRole.USER ? "user-1" : null,
    role,
    content,
    status: MessageStatus.COMPLETED,
    provider: null,
    model: null,
    createdAt: new Date(`2026-11-11T10:0${minute}:00Z`),
    updatedAt: new Date(`2026-11-11T10:0${minute}:00Z`),
    editedAt: null,
});

const history = [
    record("u1", MessageRole.USER, "¿Cómo hago pasta fresca?", 0),
    record("a1", MessageRole.ASSISTANT, "Usa harina 00...", 1),
    record("u2", MessageRole.USER, "¿Y la salsa?", 2),
    record("a2", MessageRole.ASSISTANT, "Una carbonara...", 3),
];

vi.mock("@/server/infrastructure/database/prisma", () => {
    const echo = vi.fn(({ data, where }) =>
        Promise.resolve({
            id: where?.id ?? "new-id",
            conversationId: "conv-1",
            senderId: null,
            role: data.role ?? "USER",
            content: data.content ?? "",
            status: "COMPLETED",
            provider: data.provider ?? null,
            model: data.model ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
            editedAt: data.editedAt ?? null,
        }),
    );
    return {
        prisma: {
            $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
            message: {
                findUnique: vi.fn(),
                update: echo,
                create: echo,
                deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
            },
            messageRevision: { create: vi.fn().mockResolvedValue({}) },
            messageFeedback: { deleteMany: vi.fn().mockResolvedValue({ count: 0 }) },
            conversation: { update: vi.fn().mockResolvedValue({}) },
        },
    };
});

function mockLookup(id: string, ownerId = "user-1") {
    const found = history.find((m) => m.id === id);
    vi.mocked(prisma.message.findUnique).mockResolvedValueOnce(
        found ? ({ ...found, conversation: { userId: ownerId } } as never) : null,
    );
}

describe("MessageService (Unit) — edit and retry", () => {
    let service: MessageService;
    let aiService: AIProviderService;

    beforeEach(() => {
        vi.clearAllMocks();
        const messageRepo: IMessageRepository = {
            findByConversationId: vi.fn().mockResolvedValue(history),
            findById: vi.fn(),
        };
        aiService = {
            generateReply: vi.fn().mockResolvedValue({
                content: "Nueva respuesta de George",
                provider: AIProvider.GROQ,
                model: "llama",
                latencyMs: 50,
                fallbackUsed: true,
            }),
        } as unknown as AIProviderService;
        service = new MessageService(messageRepo, aiService);
    });

    it("should regenerate from the edited message and discard later turns", async () => {
        mockLookup("u1");

        const result = await service.editUserMessage("u1", "user-1", {
            content: "¿Cómo hago pasta sin huevo?",
        });

        const context = vi.mocked(aiService.generateReply).mock.calls[0][0];
        expect(context.map((m) => m.content)).toEqual(["¿Cómo hago pasta sin huevo?"]);
        expect(prisma.message.deleteMany).toHaveBeenCalledWith({
            where: { id: { in: ["a1", "u2", "a2"] } },
        });
        expect(prisma.messageRevision.create).toHaveBeenCalledWith({
            data: { messageId: "u1", previousContent: "¿Cómo hago pasta fresca?" },
        });
        expect(result.userMessage.content).toBe("¿Cómo hago pasta sin huevo?");
        expect(result.assistantMessage.content).toBe("Nueva respuesta de George");
    });

    it("should reject editing assistant messages and empty content", async () => {
        mockLookup("a1");
        await expect(service.editUserMessage("a1", "user-1", { content: "x" })).rejects.toThrow(
            "Solo se pueden editar",
        );
        await expect(service.editUserMessage("u1", "user-1", { content: "   " })).rejects.toThrow(
            "no puede estar vacío",
        );
    });

    it("should hide messages from other users behind a 404", async () => {
        mockLookup("u1", "someone-else");
        await expect(
            service.editUserMessage("u1", "user-1", { content: "Hola" }),
        ).rejects.toMatchObject({ statusCode: 404 });
        expect(aiService.generateReply).not.toHaveBeenCalled();
    });

    it("should retry the latest answer with the preceding context and clear its feedback", async () => {
        mockLookup("a2");

        const result = await service.retryAssistantMessage("a2", "user-1");

        const context = vi.mocked(aiService.generateReply).mock.calls[0][0];
        expect(context.map((m) => m.content)).toEqual([
            "¿Cómo hago pasta fresca?",
            "Usa harina 00...",
            "¿Y la salsa?",
        ]);
        expect(prisma.messageFeedback.deleteMany).toHaveBeenCalledWith({
            where: { messageId: "a2" },
        });
        expect(result.assistantMessage.id).toBe("a2");
        expect(result.assistantMessage.content).toBe("Nueva respuesta de George");
    });

    it("should only allow retrying the last assistant answer", async () => {
        mockLookup("a1");
        await expect(service.retryAssistantMessage("a1", "user-1")).rejects.toMatchObject({
            statusCode: 409,
        });
    });
});

describe("FeedbackService (Unit)", () => {
    let feedbackRepo: IFeedbackRepository;
    let service: FeedbackService;

    beforeEach(() => {
        vi.clearAllMocks();
        feedbackRepo = { upsert: vi.fn(), findRatingsByUser: vi.fn() };
        const messages = new MessageService({
            findByConversationId: vi.fn().mockResolvedValue(history),
            findById: vi.fn(),
        });
        service = new FeedbackService(feedbackRepo, messages);
    });

    it("should store the user's rating for an assistant answer", async () => {
        mockLookup("a1");
        const result = await service.submit("a1", "user-1", { rating: "positive" });

        expect(feedbackRepo.upsert).toHaveBeenCalledWith("a1", "user-1", "positive");
        expect(result).toEqual({ messageId: "a1", rating: "positive" });
    });

    it("should reject invalid ratings and user messages", async () => {
        await expect(service.submit("a1", "user-1", { rating: "meh" })).rejects.toThrow();
        mockLookup("u1");
        await expect(service.submit("u1", "user-1", { rating: "negative" })).rejects.toThrow(
            "Solo se pueden calificar",
        );
        expect(feedbackRepo.upsert).not.toHaveBeenCalled();
    });
});

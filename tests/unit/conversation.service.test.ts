import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConversationService } from "@/server/services/conversation.service";
import { IConversationRepository } from "@/server/domain/contracts/conversation-repository.contract";
import { IMessageRepository } from "@/server/domain/contracts/message-repository.contract";
import { ConversationEntity } from "@/server/domain/entities/conversation.entity";
import { MessageEntity } from "@/server/domain/entities/message.entity";
import { MessageRole } from "@/server/domain/enums/message-role.enum";
import { MessageStatus } from "@/server/domain/enums/message-status.enum";

// Mock prisma
vi.mock("@/server/infrastructure/database/prisma", () => ({
    prisma: {
        assistantConfig: {
            findFirst: vi.fn().mockResolvedValue({ id: "ast-123" }),
        },
        conversation: {
            findMany: vi.fn().mockResolvedValue([]),
            update: vi.fn().mockResolvedValue({}),
        },
        message: {
            create: vi.fn().mockImplementation(({ data }) =>
                Promise.resolve({
                    id: "msg-created-id",
                    conversationId: data.conversationId,
                    senderId: data.senderId ?? null,
                    role: data.role,
                    content: data.content,
                    status: data.status,
                    provider: null,
                    model: data.model ?? null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    editedAt: null,
                })
            ),
        },
    },
}));

describe("ConversationService (Unit)", () => {
    let service: ConversationService;
    let mockConversationRepo: IConversationRepository;
    let mockMessageRepo: IMessageRepository;

    const dummyConversation: ConversationEntity = {
        id: "conv-1",
        userId: "user-1",
        assistantConfigId: "ast-123",
        title: "Receta Risotto",
        createdAt: new Date("2026-01-01T10:00:00Z"),
        updatedAt: new Date("2026-01-01T10:00:00Z"),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockConversationRepo = {
            findById: vi.fn().mockResolvedValue(dummyConversation),
            findByUserId: vi.fn().mockResolvedValue([dummyConversation]),
            create: vi.fn().mockResolvedValue(dummyConversation),
            updateTitle: vi.fn().mockImplementation((id, title) =>
                Promise.resolve({ ...dummyConversation, title })
            ),
            delete: vi.fn().mockResolvedValue(undefined),
        };

        mockMessageRepo = {
            findByConversationId: vi.fn().mockResolvedValue([]),
            findById: vi.fn().mockResolvedValue(null),
        };

        service = new ConversationService(mockConversationRepo, mockMessageRepo);
    });

    describe("listConversations", () => {
        it("should return mapped conversation DTOs for the given user", async () => {
            const result = await service.listConversations("user-1");

            expect(mockConversationRepo.findByUserId).toHaveBeenCalledWith("user-1");
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("conv-1");
            expect(result[0].title).toBe("Receta Risotto");
        });
    });

    describe("createConversation", () => {
        it("should create a conversation with the provided title", async () => {
            const result = await service.createConversation("user-1", {
                title: "Maridaje para Salmón",
            });

            expect(mockConversationRepo.create).toHaveBeenCalledWith({
                userId: "user-1",
                title: "Maridaje para Salmón",
                assistantConfigId: "ast-123",
            });
            expect(result.id).toBe("conv-1");
        });

        it("should default title to 'New conversation' if none is passed", async () => {
            await service.createConversation("user-1", undefined);

            expect(mockConversationRepo.create).toHaveBeenCalledWith({
                userId: "user-1",
                title: "New conversation",
                assistantConfigId: "ast-123",
            });
        });

        it("should reject creation if title exceeds 100 characters", async () => {
            const longTitle = "a".repeat(101);

            await expect(
                service.createConversation("user-1", { title: longTitle })
            ).rejects.toThrow("Title must not exceed 100 characters");
        });
    });

    describe("renameConversation", () => {
        it("should update conversation title when valid", async () => {
            const result = await service.renameConversation("conv-1", "user-1", {
                title: "Nuevo Título Gourmet",
            });

            expect(mockConversationRepo.updateTitle).toHaveBeenCalledWith(
                "conv-1",
                "Nuevo Título Gourmet"
            );
            expect(result.title).toBe("Nuevo Título Gourmet");
        });

        it("should throw validation error if title is empty or only whitespace", async () => {
            await expect(
                service.renameConversation("conv-1", "user-1", { title: "   " })
            ).rejects.toThrow();
        });
    });

    describe("deleteConversation", () => {
        it("should delete existing conversation", async () => {
            await expect(
                service.deleteConversation("conv-1", "user-1")
            ).resolves.toBeUndefined();

            expect(mockConversationRepo.delete).toHaveBeenCalledWith("conv-1");
        });

        it("should throw NotFoundException if conversation does not exist", async () => {
            (mockConversationRepo.findById as any).mockResolvedValueOnce(null);

            await expect(
                service.deleteConversation("non-existent", "user-1")
            ).rejects.toThrow("does not exist");
        });
    });

    describe("addMessage", () => {
        it("should persist user message and generate Chef George response", async () => {
            const result = await service.addMessage(
                "conv-1",
                "user-1",
                "¿Cómo hacer un risotto perfecto?"
            );

            expect(result.userMessage).toBeDefined();
            expect(result.userMessage.content).toBe("¿Cómo hacer un risotto perfecto?");
            expect(result.assistantMessage).toBeDefined();
            expect(result.assistantMessage.content).toContain("Risotto");
        });

        it("should reject empty message content", async () => {
            await expect(
                service.addMessage("conv-1", "user-1", "   ")
            ).rejects.toThrow("Message content cannot be empty");
        });
    });
});

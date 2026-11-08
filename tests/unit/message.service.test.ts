import { describe, it, expect } from "vitest";
import { MessageMapper } from "@/server/mappers/message.mapper";
import { MessageRole } from "@/server/domain/enums/message-role.enum";
import { MessageStatus } from "@/server/domain/enums/message-status.enum";

describe("MessageMapper (Unit)", () => {
    it("should correctly map Prisma message record to Domain Entity and Response DTO", () => {
        const prismaRecord = {
            id: "msg-123",
            conversationId: "conv-456",
            senderId: "user-789",
            role: "USER" as any,
            content: "Receta de salsa carbonara clásica",
            status: "COMPLETED" as any,
            provider: null,
            model: "George-Culinary-v1.0",
            createdAt: new Date("2026-03-01T12:00:00Z"),
            updatedAt: new Date("2026-03-01T12:00:00Z"),
            editedAt: null,
        };

        const entity = MessageMapper.toEntity(prismaRecord);
        expect(entity.id).toBe("msg-123");
        expect(entity.role).toBe(MessageRole.USER);
        expect(entity.status).toBe(MessageStatus.COMPLETED);

        const dto = MessageMapper.toResponseDto(entity);
        expect(dto.id).toBe("msg-123");
        expect(dto.role).toBe("user");
        expect(dto.content).toBe("Receta de salsa carbonara clásica");
        expect(dto.createdAt).toBe("2026-03-01T12:00:00.000Z");
    });
});

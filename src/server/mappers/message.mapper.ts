import type { Message as PrismaMessage } from "@prisma/client";
import { MessageEntity } from "../domain/entities/message.entity";
import { MessageRole } from "../domain/enums/message-role.enum";
import { MessageStatus } from "../domain/enums/message-status.enum";
import { AIProvider } from "../domain/enums/ai-provider.enum";
import { MessageResponseDto } from "../dto/message/message-response.dto";

export class MessageMapper {
    static toEntity(record: PrismaMessage): MessageEntity {
        return {
            id: record.id,
            conversationId: record.conversationId,
            senderId: record.senderId,
            role: record.role as unknown as MessageRole,
            content: record.content,
            status: record.status as unknown as MessageStatus,
            provider: record.provider as unknown as AIProvider | null,
            model: record.model,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            editedAt: record.editedAt,
        };
    }

    static toResponseDto(entity: MessageEntity): MessageResponseDto {
        return {
            id: entity.id,
            conversationId: entity.conversationId,
            role: entity.role.toLowerCase() as "user" | "assistant" | "system",
            content: entity.content,
            createdAt: entity.createdAt.toISOString(),
            editedAt: entity.editedAt ? entity.editedAt.toISOString() : null,
        };
    }

    static toResponseDtoList(entities: MessageEntity[]): MessageResponseDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }
}

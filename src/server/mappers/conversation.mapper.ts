import type { Conversation as PrismaConversation } from "@prisma/client";
import { ConversationEntity } from "../domain/entities/conversation.entity";
import { ConversationResponseDto } from "../dto/conversations/create-conversation.dto";

export class ConversationMapper {
    static toEntity(record: PrismaConversation): ConversationEntity {
        return {
            id: record.id,
            userId: record.userId,
            assistantConfigId: record.assistantConfigId,
            title: record.title,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }

    static toResponseDto(entity: ConversationEntity): ConversationResponseDto {
        return {
            id: entity.id,
            title: entity.title,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
        };
    }

    static toResponseDtoList(entities: ConversationEntity[]): ConversationResponseDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }
}

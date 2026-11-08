import { prisma } from "../infrastructure/database/prisma";
import {
    IConversationRepository,
    CreateConversationParams,
} from "../domain/contracts/conversation-repository.contract";
import { ConversationEntity } from "../domain/entities/conversation.entity";
import { ConversationMapper } from "../mappers/conversation.mapper";

export class ConversationRepository implements IConversationRepository {
    async findById(id: string): Promise<ConversationEntity | null> {
        const record = await prisma.conversation.findUnique({
            where: { id },
        });

        if (!record) return null;
        return ConversationMapper.toEntity(record);
    }

    async findByUserId(userId: string): Promise<ConversationEntity[]> {
        const records = await prisma.conversation.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
        });

        return records.map((record) => ConversationMapper.toEntity(record));
    }

    async create(params: CreateConversationParams): Promise<ConversationEntity> {
        const record = await prisma.conversation.create({
            data: {
                userId: params.userId,
                title: params.title,
                assistantConfigId: params.assistantConfigId ?? null,
            },
        });

        return ConversationMapper.toEntity(record);
    }

    async updateTitle(id: string, title: string): Promise<ConversationEntity> {
        const record = await prisma.conversation.update({
            where: { id },
            data: { title },
        });

        return ConversationMapper.toEntity(record);
    }

    async delete(id: string): Promise<void> {
        await prisma.conversation.delete({
            where: { id },
        });
    }
}

export const conversationRepository = new ConversationRepository();

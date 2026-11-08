import { prisma } from "../infrastructure/database/prisma";
import { IMessageRepository } from "../domain/contracts/message-repository.contract";
import { MessageEntity } from "../domain/entities/message.entity";
import { MessageMapper } from "../mappers/message.mapper";

export class MessageRepository implements IMessageRepository {
    async findByConversationId(conversationId: string): Promise<MessageEntity[]> {
        const records = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
        });

        return records.map((record) => MessageMapper.toEntity(record));
    }

    async findById(id: string): Promise<MessageEntity | null> {
        const record = await prisma.message.findUnique({
            where: { id },
        });

        if (!record) return null;
        return MessageMapper.toEntity(record);
    }
}

export const messageRepository = new MessageRepository();

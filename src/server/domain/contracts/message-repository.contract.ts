import { MessageEntity } from "../entities/message.entity";

export interface IMessageRepository {
    findByConversationId(conversationId: string): Promise<MessageEntity[]>;
    findById(id: string): Promise<MessageEntity | null>;
}

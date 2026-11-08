import { ConversationEntity } from "../entities/conversation.entity";

export interface CreateConversationParams {
    userId: string;
    title: string;
    assistantConfigId?: string | null;
}

export interface IConversationRepository {
    findById(id: string): Promise<ConversationEntity | null>;
    findByUserId(userId: string): Promise<ConversationEntity[]>;
    create(params: CreateConversationParams): Promise<ConversationEntity>;
    updateTitle(id: string, title: string): Promise<ConversationEntity>;
    delete(id: string): Promise<void>;
}

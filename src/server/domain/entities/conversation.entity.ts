export interface ConversationEntity {
    id: string;
    userId: string;
    assistantConfigId: string | null;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AssistantConfigEntity {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    isActive: boolean;
    updatedAt: Date;
}

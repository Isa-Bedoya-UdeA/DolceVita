export interface AssistantConfigEntity {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    isActive: boolean;
    updatedAt: Date;
}

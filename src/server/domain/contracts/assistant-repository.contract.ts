import { AssistantConfigEntity } from "../entities/assistant-config.entity";

export type AssistantConfigUpdate = Partial<
    Pick<
        AssistantConfigEntity,
        "name" | "description" | "systemPrompt" | "temperature" | "maxTokens"
    >
>;

export type AssistantConfigCreate = Pick<
    AssistantConfigEntity,
    "name" | "description" | "systemPrompt" | "temperature" | "maxTokens"
>;

export interface IAssistantRepository {
    findActive(): Promise<AssistantConfigEntity | null>;
    findById(id: string): Promise<AssistantConfigEntity | null>;
    update(id: string, data: AssistantConfigUpdate): Promise<AssistantConfigEntity>;
    create(data: AssistantConfigCreate): Promise<AssistantConfigEntity>;
}

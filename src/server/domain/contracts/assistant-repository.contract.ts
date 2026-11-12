import { AssistantConfigEntity } from "../entities/assistant-config.entity";

export interface IAssistantRepository {
    findActive(): Promise<AssistantConfigEntity | null>;
    findById(id: string): Promise<AssistantConfigEntity | null>;
}

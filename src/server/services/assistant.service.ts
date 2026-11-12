import { IAssistantRepository } from "../domain/contracts/assistant-repository.contract";
import { assistantRepository } from "../repositories/assistant.repository";
import { ASSISTANT_NAME, DEFAULT_SYSTEM_PROMPT } from "../../lib/constants/assistant.constants";

export interface ActiveAssistant {
    id: string | null;
    name: string;
    systemPrompt: string;
}

export class AssistantService {
    constructor(private readonly assistantRepo: IAssistantRepository = assistantRepository) {}

    /** Every conversation uses the single active configuration (FR-018, AC-05). */
    async getActiveAssistant(): Promise<ActiveAssistant> {
        const config = await this.assistantRepo.findActive();

        if (!config || !config.systemPrompt.trim()) {
            return { id: null, name: ASSISTANT_NAME, systemPrompt: DEFAULT_SYSTEM_PROMPT };
        }

        return { id: config.id, name: config.name, systemPrompt: config.systemPrompt };
    }
}

export const assistantService = new AssistantService();

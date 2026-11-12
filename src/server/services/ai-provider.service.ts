import { AssistantService, assistantService } from "./assistant.service";
import { HistoryMessage, PromptService, promptService } from "./prompt.service";
import {
    AIOrchestrator,
    OrchestratedResult,
    aiOrchestrator,
} from "../integrations/ai/orchestrator/ai-orchestrator";

/** Application service that turns a conversation history into George's next reply. */
export class AIProviderService {
    constructor(
        private readonly assistants: AssistantService = assistantService,
        private readonly prompts: PromptService = promptService,
        private readonly orchestrator: AIOrchestrator = aiOrchestrator,
    ) {}

    async generateReply(history: HistoryMessage[]): Promise<OrchestratedResult> {
        const assistant = await this.assistants.getActiveAssistant();
        const messages = this.prompts.buildMessages(assistant.systemPrompt, history);
        return this.orchestrator.generate({ messages });
    }
}

export const aiProviderService = new AIProviderService();

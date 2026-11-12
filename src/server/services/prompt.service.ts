import { aiConfig } from "../../lib/config/ai.config";
import { ASSISTANT_GUARDRAILS } from "../../lib/constants/assistant.constants";
import { MessageEntity } from "../domain/entities/message.entity";
import { MessageRole } from "../domain/enums/message-role.enum";
import { MessageStatus } from "../domain/enums/message-status.enum";
import { AIChatMessage } from "../integrations/ai/contracts/ai-provider.interface";

export type HistoryMessage = Pick<MessageEntity, "role" | "status" | "content">;

export class PromptService {
    constructor(private readonly historyLimit: number = aiConfig.historyLimit) {}

    buildSystemPrompt(basePrompt: string): string {
        return `${basePrompt.trim()}\n\n${ASSISTANT_GUARDRAILS}`;
    }

    /**
     * Builds the conversational context sent to the model: system prompt plus the
     * most recent completed user/assistant turns, in chronological order.
     */
    buildMessages(basePrompt: string, history: HistoryMessage[]): AIChatMessage[] {
        const turns = history
            .filter(
                (message) =>
                    (message.role === MessageRole.USER || message.role === MessageRole.ASSISTANT) &&
                    message.status === MessageStatus.COMPLETED &&
                    message.content.trim().length > 0,
            )
            .slice(-this.historyLimit)
            .map<AIChatMessage>((message) => ({
                role: message.role === MessageRole.USER ? "user" : "assistant",
                content: message.content,
            }));

        while (turns.length > 0 && turns[0].role === "assistant") {
            turns.shift();
        }

        return [{ role: "system", content: this.buildSystemPrompt(basePrompt) }, ...turns];
    }
}

export const promptService = new PromptService();

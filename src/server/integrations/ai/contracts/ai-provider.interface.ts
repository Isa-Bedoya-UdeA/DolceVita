import { AIProvider } from "../../../domain/enums/ai-provider.enum";

export type AIChatRole = "system" | "user" | "assistant";

export interface AIChatMessage {
    role: AIChatRole;
    content: string;
}

export interface AIGenerationRequest {
    messages: AIChatMessage[];
    temperature?: number;
    maxTokens?: number;
}

export interface AIGenerationResult {
    content: string;
    provider: AIProvider;
    model: string;
    latencyMs: number;
    usage?: {
        promptTokens: number;
        completionTokens: number;
    };
}

export interface IAIProvider {
    readonly name: AIProvider;
    readonly model: string;
    isConfigured(): boolean;
    generate(request: AIGenerationRequest): Promise<AIGenerationResult>;
}

import { AIProvider } from "../../../domain/enums/ai-provider.enum";
import { AIProviderException } from "../../../exceptions/ai-provider.exception";
import {
    AIGenerationRequest,
    AIGenerationResult,
    IAIProvider,
} from "../contracts/ai-provider.interface";

export interface OpenAICompatibleOptions {
    apiKey: string;
    baseUrl: string;
    model: string;
    timeoutMs: number;
    defaultTemperature: number;
    defaultMaxTokens: number;
}

interface ChatCompletionResponse {
    model?: string;
    choices?: { message?: { content?: string | null } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    error?: { message?: string };
}

/**
 * Base adapter for providers that expose the OpenAI Chat Completions contract
 * (OpenRouter and Groq). Subclasses only define identity and extra headers.
 */
export abstract class OpenAICompatibleAdapter implements IAIProvider {
    abstract readonly name: AIProvider;

    constructor(protected readonly options: OpenAICompatibleOptions) {}

    get model(): string {
        return this.options.model;
    }

    isConfigured(): boolean {
        return this.options.apiKey.trim().length > 0;
    }

    protected extraHeaders(): Record<string, string> {
        return {};
    }

    async generate(request: AIGenerationRequest): Promise<AIGenerationResult> {
        if (!this.isConfigured()) {
            throw new AIProviderException(`${this.name} API key is not configured`, {
                provider: this.name,
            });
        }

        const startedAt = Date.now();
        let response: Response;

        try {
            response = await fetch(`${this.options.baseUrl}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.options.apiKey}`,
                    ...this.extraHeaders(),
                },
                body: JSON.stringify({
                    model: this.options.model,
                    messages: request.messages,
                    temperature: request.temperature ?? this.options.defaultTemperature,
                    max_tokens: request.maxTokens ?? this.options.defaultMaxTokens,
                }),
                signal: AbortSignal.timeout(this.options.timeoutMs),
            });
        } catch (error) {
            const timedOut = error instanceof Error && error.name === "TimeoutError";
            throw new AIProviderException(
                timedOut
                    ? `${this.name} did not respond within ${this.options.timeoutMs} ms`
                    : `${this.name} request failed: ${(error as Error).message}`,
                { provider: this.name },
            );
        }

        const payload = (await response.json().catch(() => ({}))) as ChatCompletionResponse;

        if (!response.ok) {
            throw new AIProviderException(
                `${this.name} responded with HTTP ${response.status}: ${payload.error?.message ?? response.statusText}`,
                { provider: this.name, upstreamStatus: response.status },
            );
        }

        const content = payload.choices?.[0]?.message?.content?.trim();

        if (!content) {
            throw new AIProviderException(`${this.name} returned an empty response`, {
                provider: this.name,
            });
        }

        return {
            content,
            provider: this.name,
            model: payload.model ?? this.options.model,
            latencyMs: Date.now() - startedAt,
            usage: payload.usage
                ? {
                      promptTokens: payload.usage.prompt_tokens ?? 0,
                      completionTokens: payload.usage.completion_tokens ?? 0,
                  }
                : undefined,
        };
    }
}

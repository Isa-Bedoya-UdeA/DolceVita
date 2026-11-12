import { AIProvider } from "../../server/domain/enums/ai-provider.enum";

// Server-only configuration. Never import this module from client components.

function readNumber(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readProvider(value: string | undefined): AIProvider {
    return value === AIProvider.GROQ ? AIProvider.GROQ : AIProvider.OPENROUTER;
}

export interface ProviderSettings {
    apiKey: string;
    baseUrl: string;
    model: string;
}

export const aiConfig = {
    defaultProvider: readProvider(process.env.DEFAULT_AI_PROVIDER),
    timeoutMs: readNumber(process.env.AI_TIMEOUT_MS, 30_000),
    temperature: readNumber(process.env.AI_TEMPERATURE, 0.7),
    maxTokens: readNumber(process.env.AI_MAX_TOKENS, 1500),
    historyLimit: readNumber(process.env.AI_HISTORY_LIMIT, 20),
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    providers: {
        [AIProvider.OPENROUTER]: {
            apiKey: process.env.OPENROUTER_API_KEY ?? "",
            baseUrl: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
            model: process.env.DEFAULT_AI_MODEL ?? "openai/gpt-4o-mini",
        },
        [AIProvider.GROQ]: {
            apiKey: process.env.GROQ_API_KEY ?? "",
            baseUrl: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
            model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        },
    } satisfies Record<AIProvider, ProviderSettings>,
};

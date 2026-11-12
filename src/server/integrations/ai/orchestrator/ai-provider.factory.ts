import { aiConfig } from "../../../../lib/config/ai.config";
import { AIProvider } from "../../../domain/enums/ai-provider.enum";
import { IAIProvider } from "../contracts/ai-provider.interface";
import { GroqAdapter } from "../adapters/groq.adapter";
import { OpenRouterAdapter } from "../adapters/openrouter.adapter";
import { OpenAICompatibleOptions } from "../adapters/openai-compatible.adapter";

function optionsFor(provider: AIProvider): OpenAICompatibleOptions {
    const settings = aiConfig.providers[provider];
    return {
        ...settings,
        timeoutMs: aiConfig.timeoutMs,
        defaultTemperature: aiConfig.temperature,
        defaultMaxTokens: aiConfig.maxTokens,
    };
}

export class AIProviderFactory {
    static create(provider: AIProvider): IAIProvider {
        switch (provider) {
            case AIProvider.OPENROUTER:
                return new OpenRouterAdapter(optionsFor(provider), aiConfig.appUrl);
            case AIProvider.GROQ:
                return new GroqAdapter(optionsFor(provider));
        }
    }

    /** Returns the primary provider followed by the remaining ones as fallbacks. */
    static createChain(primary: AIProvider = aiConfig.defaultProvider): IAIProvider[] {
        const order = [primary, ...Object.values(AIProvider).filter((p) => p !== primary)];
        return order.map((provider) => AIProviderFactory.create(provider));
    }
}

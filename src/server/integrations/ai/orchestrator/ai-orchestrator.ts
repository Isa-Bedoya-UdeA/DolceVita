import { AIProviderException } from "../../../exceptions/ai-provider.exception";
import {
    AIGenerationRequest,
    AIGenerationResult,
    IAIProvider,
} from "../contracts/ai-provider.interface";
import { AIProviderFactory } from "./ai-provider.factory";

export interface OrchestratedResult extends AIGenerationResult {
    fallbackUsed: boolean;
}

export const AI_UNAVAILABLE_MESSAGE =
    "George no está disponible en este momento. Intenta de nuevo en unos segundos.";

/**
 * Sends the request to the primary provider and, if it fails for any reason
 * (timeout, network error, 429, 5xx, invalid model or missing key), retries the
 * same context with the next provider in the chain.
 */
export class AIOrchestrator {
    constructor(private readonly providers: IAIProvider[] = AIProviderFactory.createChain()) {}

    async generate(request: AIGenerationRequest): Promise<OrchestratedResult> {
        const failures: string[] = [];

        for (const [index, provider] of this.providers.entries()) {
            if (!provider.isConfigured()) {
                failures.push(`${provider.name}: not configured`);
                continue;
            }

            try {
                const result = await provider.generate(request);
                if (index > 0) {
                    console.warn(`[AIOrchestrator] Fallback served by ${provider.name}`);
                }
                return { ...result, fallbackUsed: index > 0 };
            } catch (error) {
                const reason = error instanceof Error ? error.message : String(error);
                failures.push(`${provider.name}: ${reason}`);
                console.warn(`[AIOrchestrator] ${provider.name} failed: ${reason}`);
            }
        }

        console.error(`[AIOrchestrator] All providers failed -> ${failures.join(" | ")}`);
        throw new AIProviderException(AI_UNAVAILABLE_MESSAGE);
    }
}

export const aiOrchestrator = new AIOrchestrator();

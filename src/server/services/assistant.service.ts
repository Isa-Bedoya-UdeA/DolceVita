import { IAssistantRepository } from "../domain/contracts/assistant-repository.contract";
import { AssistantConfigEntity } from "../domain/entities/assistant-config.entity";
import { assistantRepository } from "../repositories/assistant.repository";
import {
    ASSISTANT_CONFIG_LIMITS,
    ASSISTANT_GUARDRAILS,
    ASSISTANT_NAME,
    DEFAULT_SYSTEM_PROMPT,
} from "../../lib/constants/assistant.constants";
import { aiConfig } from "../../lib/config/ai.config";
import { AIProvider } from "../domain/enums/ai-provider.enum";
import {
    AssistantConfigResponseDto,
    updateAssistantConfigSchema,
} from "../dto/admin/update-assistant-config.dto";

export interface ActiveAssistant {
    id: string | null;
    name: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
}

const DEFAULT_DESCRIPTION =
    "Chef ejecutivo y sumiller experto en gastronomía internacional, técnicas culinarias y maridaje.";

export class AssistantService {
    constructor(private readonly assistantRepo: IAssistantRepository = assistantRepository) {}

    /** Every conversation uses the single active configuration (FR-018, AC-05). */
    async getActiveAssistant(): Promise<ActiveAssistant> {
        const config = await this.assistantRepo.findActive();

        if (!config || !config.systemPrompt.trim()) {
            return {
                id: null,
                name: ASSISTANT_NAME,
                systemPrompt: DEFAULT_SYSTEM_PROMPT,
                temperature: aiConfig.temperature,
                maxTokens: aiConfig.maxTokens,
            };
        }

        return {
            id: config.id,
            name: config.name,
            systemPrompt: config.systemPrompt,
            temperature: config.temperature ?? aiConfig.temperature,
            maxTokens: config.maxTokens ?? aiConfig.maxTokens,
        };
    }

    /** FR-020 / API-014 (GET) */
    async getAdminConfig(): Promise<AssistantConfigResponseDto> {
        const config = await this.assistantRepo.findActive();
        return this.toResponse(config);
    }

    /** FR-020 / API-014 (PATCH). Creates the configuration if the database has none. */
    async updateAdminConfig(input: unknown): Promise<AssistantConfigResponseDto> {
        const data = updateAssistantConfigSchema.parse(input);
        const current = await this.assistantRepo.findActive();

        const saved = current
            ? await this.assistantRepo.update(current.id, data)
            : await this.assistantRepo.create({
                  name: data.name ?? ASSISTANT_NAME,
                  description: data.description ?? DEFAULT_DESCRIPTION,
                  systemPrompt: data.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
                  temperature: data.temperature ?? ASSISTANT_CONFIG_LIMITS.temperature.default,
                  maxTokens: data.maxTokens ?? ASSISTANT_CONFIG_LIMITS.maxTokens.default,
              });

        return this.toResponse(saved);
    }

    private toResponse(config: AssistantConfigEntity | null): AssistantConfigResponseDto {
        const fallbackProvider =
            aiConfig.defaultProvider === AIProvider.OPENROUTER
                ? AIProvider.GROQ
                : AIProvider.OPENROUTER;
        const providerInfo = (provider: AIProvider) => ({
            name: provider,
            model: aiConfig.providers[provider].model,
            configured: aiConfig.providers[provider].apiKey.trim().length > 0,
        });

        return {
            id: config?.id ?? null,
            name: config?.name ?? ASSISTANT_NAME,
            description: config?.description ?? DEFAULT_DESCRIPTION,
            systemPrompt: config?.systemPrompt?.trim()
                ? config.systemPrompt
                : DEFAULT_SYSTEM_PROMPT,
            temperature: config?.temperature ?? aiConfig.temperature,
            maxTokens: config?.maxTokens ?? aiConfig.maxTokens,
            guardrails: ASSISTANT_GUARDRAILS,
            updatedAt: config?.updatedAt ? config.updatedAt.toISOString() : null,
            providers: {
                primary: providerInfo(aiConfig.defaultProvider),
                fallback: providerInfo(fallbackProvider),
            },
        };
    }
}

export const assistantService = new AssistantService();

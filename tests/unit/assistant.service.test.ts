import { describe, it, expect, vi, beforeEach } from "vitest";
import { ZodError } from "zod";
import { AssistantService } from "@/server/services/assistant.service";
import { AIProviderService } from "@/server/services/ai-provider.service";
import { PromptService } from "@/server/services/prompt.service";
import { AIOrchestrator } from "@/server/integrations/ai/orchestrator/ai-orchestrator";
import { IAssistantRepository } from "@/server/domain/contracts/assistant-repository.contract";
import { AssistantConfigEntity } from "@/server/domain/entities/assistant-config.entity";
import { AIProvider } from "@/server/domain/enums/ai-provider.enum";
import { ASSISTANT_GUARDRAILS, DEFAULT_SYSTEM_PROMPT } from "@/lib/constants/assistant.constants";

vi.mock("@/server/infrastructure/database/prisma", () => ({ prisma: {} }));

const stored: AssistantConfigEntity = {
    id: "cfg-1",
    name: "George",
    description: "Chef ejecutivo",
    systemPrompt: "Eres George, chef ejecutivo. ".repeat(4),
    temperature: 0.4,
    maxTokens: 900,
    isActive: true,
    updatedAt: new Date("2026-11-15T10:00:00Z"),
};

function makeRepo(active: AssistantConfigEntity | null): IAssistantRepository {
    return {
        findActive: vi.fn().mockResolvedValue(active),
        findById: vi.fn().mockResolvedValue(active),
        update: vi.fn((id: string, data) => Promise.resolve({ ...stored, ...data, id })),
        create: vi.fn((data) => Promise.resolve({ ...stored, ...data, id: "cfg-new" })),
    };
}

describe("AssistantService (FR-020)", () => {
    let repo: IAssistantRepository;
    let service: AssistantService;

    beforeEach(() => {
        repo = makeRepo(stored);
        service = new AssistantService(repo);
    });

    it("returns the active configuration with its generation parameters", async () => {
        const active = await service.getActiveAssistant();
        expect(active).toMatchObject({ id: "cfg-1", temperature: 0.4, maxTokens: 900 });
    });

    it("falls back to the default prompt when there is no configuration", async () => {
        service = new AssistantService(makeRepo(null));
        const config = await service.getAdminConfig();
        expect(config.id).toBeNull();
        expect(config.systemPrompt).toBe(DEFAULT_SYSTEM_PROMPT);
    });

    it("exposes a sanitized configuration without API keys", async () => {
        const config = await service.getAdminConfig();
        expect(config.guardrails).toBe(ASSISTANT_GUARDRAILS);
        expect(config.providers.primary).toHaveProperty("configured");
        expect(JSON.stringify(config)).not.toMatch(/apiKey|sk-or|gsk_/);
    });

    it("updates only the submitted fields of the active configuration", async () => {
        const result = await service.updateAdminConfig({ temperature: 1.1, maxTokens: 2000 });
        expect(repo.update).toHaveBeenCalledWith("cfg-1", { temperature: 1.1, maxTokens: 2000 });
        expect(result.temperature).toBe(1.1);
    });

    it("creates the configuration when none exists", async () => {
        repo = makeRepo(null);
        service = new AssistantService(repo);
        await service.updateAdminConfig({ name: "George" });
        expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ name: "George" }));
    });

    it("rejects invalid values, unknown fields and empty payloads", async () => {
        await expect(service.updateAdminConfig({ temperature: 3 })).rejects.toBeInstanceOf(
            ZodError,
        );
        await expect(service.updateAdminConfig({ maxTokens: 10.5 })).rejects.toBeInstanceOf(
            ZodError,
        );
        await expect(service.updateAdminConfig({ systemPrompt: "corto" })).rejects.toBeInstanceOf(
            ZodError,
        );
        await expect(service.updateAdminConfig({ apiKey: "sk-123" })).rejects.toBeInstanceOf(
            ZodError,
        );
        await expect(service.updateAdminConfig({})).rejects.toBeInstanceOf(ZodError);
        expect(repo.update).not.toHaveBeenCalled();
    });
});

describe("AIProviderService uses the admin parameters (FR-020-05)", () => {
    it("sends the configured temperature and max tokens to the orchestrator", async () => {
        const orchestrator = {
            generate: vi.fn().mockResolvedValue({
                content: "ok",
                provider: AIProvider.OPENROUTER,
                model: "m",
                latencyMs: 1,
                fallbackUsed: false,
            }),
        } as unknown as AIOrchestrator;

        const service = new AIProviderService(
            new AssistantService(makeRepo(stored)),
            new PromptService(),
            orchestrator,
        );
        await service.generateReply([]);

        expect(orchestrator.generate).toHaveBeenCalledWith(
            expect.objectContaining({ temperature: 0.4, maxTokens: 900 }),
        );
    });
});

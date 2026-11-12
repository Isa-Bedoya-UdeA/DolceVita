import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    AIOrchestrator,
    AI_UNAVAILABLE_MESSAGE,
} from "@/server/integrations/ai/orchestrator/ai-orchestrator";
import {
    IAIProvider,
    AIGenerationRequest,
} from "@/server/integrations/ai/contracts/ai-provider.interface";
import { AIProvider } from "@/server/domain/enums/ai-provider.enum";
import { AIProviderException } from "@/server/exceptions/ai-provider.exception";
import { OpenRouterAdapter } from "@/server/integrations/ai/adapters/openrouter.adapter";
import { GroqAdapter } from "@/server/integrations/ai/adapters/groq.adapter";

const request: AIGenerationRequest = {
    messages: [
        { role: "system", content: "Eres George" },
        { role: "user", content: "¿Cómo hago un risotto?" },
    ],
};

function fakeProvider(
    name: AIProvider,
    behavior: () => Promise<string>,
    configured = true,
): IAIProvider {
    return {
        name,
        model: `${name.toLowerCase()}-model`,
        isConfigured: () => configured,
        generate: vi.fn(async () => ({
            content: await behavior(),
            provider: name,
            model: `${name.toLowerCase()}-model`,
            latencyMs: 10,
        })),
    };
}

describe("AI Orchestrator (Feature/ai-dual-provider)", () => {
    beforeEach(() => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should route prompt to OpenRouter as primary provider", async () => {
        const openRouter = fakeProvider(AIProvider.OPENROUTER, async () => "Respuesta primaria");
        const groq = fakeProvider(AIProvider.GROQ, async () => "Respuesta Groq");

        const result = await new AIOrchestrator([openRouter, groq]).generate(request);

        expect(result.content).toBe("Respuesta primaria");
        expect(result.provider).toBe(AIProvider.OPENROUTER);
        expect(result.fallbackUsed).toBe(false);
        expect(groq.generate).not.toHaveBeenCalled();
    });

    it("should fall back automatically to Groq on 429 or timeout", async () => {
        const openRouter = fakeProvider(AIProvider.OPENROUTER, async () => {
            throw new AIProviderException("HTTP 429", { upstreamStatus: 429 });
        });
        const groq = fakeProvider(AIProvider.GROQ, async () => "Respuesta Groq");

        const result = await new AIOrchestrator([openRouter, groq]).generate(request);

        expect(result.provider).toBe(AIProvider.GROQ);
        expect(result.fallbackUsed).toBe(true);
        expect(groq.generate).toHaveBeenCalledWith(request);
    });

    it("should skip providers without an API key", async () => {
        const openRouter = fakeProvider(AIProvider.OPENROUTER, async () => "no", false);
        const groq = fakeProvider(AIProvider.GROQ, async () => "Respuesta Groq");

        const result = await new AIOrchestrator([openRouter, groq]).generate(request);

        expect(openRouter.generate).not.toHaveBeenCalled();
        expect(result.provider).toBe(AIProvider.GROQ);
    });

    it("should throw a user-friendly error when every provider fails", async () => {
        const failing = async () => {
            throw new Error("down");
        };
        const orchestrator = new AIOrchestrator([
            fakeProvider(AIProvider.OPENROUTER, failing),
            fakeProvider(AIProvider.GROQ, failing),
        ]);

        await expect(orchestrator.generate(request)).rejects.toThrow(AI_UNAVAILABLE_MESSAGE);
    });
});

describe("OpenAI-compatible adapters", () => {
    const options = {
        apiKey: "test-key",
        baseUrl: "https://example.test/v1",
        model: "test-model",
        timeoutMs: 1000,
        defaultTemperature: 0.7,
        defaultMaxTokens: 500,
    };

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("should send the chat completion request and normalize the response", async () => {
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(
                JSON.stringify({
                    model: "test-model",
                    choices: [{ message: { content: "  Hola, soy George  " } }],
                    usage: { prompt_tokens: 12, completion_tokens: 5 },
                }),
                { status: 200 },
            ),
        );
        vi.stubGlobal("fetch", fetchMock);

        const result = await new OpenRouterAdapter(options, "http://localhost:3000").generate(
            request,
        );

        const [url, init] = fetchMock.mock.calls[0];
        const body = JSON.parse(init.body);
        expect(url).toBe("https://example.test/v1/chat/completions");
        expect(init.headers.Authorization).toBe("Bearer test-key");
        expect(body.messages).toEqual(request.messages);
        expect(body.max_tokens).toBe(500);
        expect(result.content).toBe("Hola, soy George");
        expect(result.usage).toEqual({ promptTokens: 12, completionTokens: 5 });
    });

    it("should raise AIProviderException with the upstream status on HTTP errors", async () => {
        vi.stubGlobal(
            "fetch",
            vi
                .fn()
                .mockResolvedValue(
                    new Response(JSON.stringify({ error: { message: "Rate limit" } }), {
                        status: 429,
                    }),
                ),
        );

        const error = await new GroqAdapter(options).generate(request).catch((e) => e);

        expect(error).toBeInstanceOf(AIProviderException);
        expect(error.upstreamStatus).toBe(429);
        expect(error.provider).toBe(AIProvider.GROQ);
    });

    it("should report itself as not configured without an API key", () => {
        expect(new GroqAdapter({ ...options, apiKey: "" }).isConfigured()).toBe(false);
    });
});

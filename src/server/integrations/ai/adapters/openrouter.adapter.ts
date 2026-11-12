import { AIProvider } from "../../../domain/enums/ai-provider.enum";
import { OpenAICompatibleAdapter, OpenAICompatibleOptions } from "./openai-compatible.adapter";

export class OpenRouterAdapter extends OpenAICompatibleAdapter {
    readonly name = AIProvider.OPENROUTER;

    constructor(
        options: OpenAICompatibleOptions,
        private readonly appUrl: string,
    ) {
        super(options);
    }

    protected extraHeaders(): Record<string, string> {
        return {
            "HTTP-Referer": this.appUrl,
            "X-Title": "Dolce Vita",
        };
    }
}

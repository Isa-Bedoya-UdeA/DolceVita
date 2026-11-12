import { AIProvider } from "../../../domain/enums/ai-provider.enum";
import { OpenAICompatibleAdapter } from "./openai-compatible.adapter";

export class GroqAdapter extends OpenAICompatibleAdapter {
    readonly name = AIProvider.GROQ;
}

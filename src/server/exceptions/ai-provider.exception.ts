import { AppException } from "./app.exception";
import { AIProvider } from "../domain/enums/ai-provider.enum";

export class AIProviderException extends AppException {
    readonly statusCode = 503;
    readonly code = "AI_PROVIDER_ERROR";
    readonly provider?: AIProvider;
    readonly upstreamStatus?: number;

    constructor(message: string, options: { provider?: AIProvider; upstreamStatus?: number } = {}) {
        super(message);
        this.provider = options.provider;
        this.upstreamStatus = options.upstreamStatus;
    }
}

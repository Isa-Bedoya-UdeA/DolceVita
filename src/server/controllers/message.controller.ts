import { NextResponse } from "next/server";
import { AuthGuard } from "../auth/guards/auth.guard";
import { MessageService, messageService } from "../services/message.service";
import { toErrorResponse } from "../../lib/utils/error.utils";

export class MessageController {
    constructor(private readonly service: MessageService = messageService) {}

    /** PATCH /api/messages/[messageId] — API-009 */
    async edit(req: Request, messageId: string): Promise<NextResponse> {
        try {
            const user = await AuthGuard.authenticate(req);
            const body = await req.json().catch(() => ({}));
            const data = await this.service.editUserMessage(messageId, user.id, body);
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "MessageController");
        }
    }

    /** POST /api/messages/[messageId]/retry — API-010 */
    async retry(req: Request, messageId: string): Promise<NextResponse> {
        try {
            const user = await AuthGuard.authenticate(req);
            const data = await this.service.retryAssistantMessage(messageId, user.id);
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "MessageController");
        }
    }
}

export const messageController = new MessageController();

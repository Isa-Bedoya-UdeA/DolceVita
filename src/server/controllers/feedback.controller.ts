import { NextResponse } from "next/server";
import { AuthGuard } from "../auth/guards/auth.guard";
import { FeedbackService, feedbackService } from "../services/feedback.service";
import { toErrorResponse } from "../../lib/utils/error.utils";

export class FeedbackController {
    constructor(private readonly service: FeedbackService = feedbackService) {}

    /** POST /api/messages/[messageId]/feedback — API-011 */
    async submit(req: Request, messageId: string): Promise<NextResponse> {
        try {
            const user = await AuthGuard.authenticate(req);
            const body = await req.json().catch(() => ({}));
            const data = await this.service.submit(messageId, user.id, body);
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "FeedbackController");
        }
    }
}

export const feedbackController = new FeedbackController();

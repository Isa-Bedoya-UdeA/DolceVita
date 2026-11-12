import { feedbackController } from "@/server/controllers/feedback.controller";

interface RouteParams {
    params: Promise<{ messageId: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
    const { messageId } = await params;
    return feedbackController.submit(req, messageId);
}

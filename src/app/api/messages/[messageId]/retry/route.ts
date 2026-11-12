import { messageController } from "@/server/controllers/message.controller";

interface RouteParams {
    params: Promise<{ messageId: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
    const { messageId } = await params;
    return messageController.retry(req, messageId);
}

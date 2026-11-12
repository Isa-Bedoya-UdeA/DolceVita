import { messageController } from "@/server/controllers/message.controller";

interface RouteParams {
    params: Promise<{ messageId: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
    const { messageId } = await params;
    return messageController.edit(req, messageId);
}

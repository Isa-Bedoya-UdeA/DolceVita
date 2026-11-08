import { conversationController } from "@/server/controllers/conversation.controller";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    const { id } = await params;
    return conversationController.getById(req, id);
}

export async function PATCH(req: Request, { params }: RouteParams) {
    const { id } = await params;
    return conversationController.rename(req, id);
}

export async function DELETE(req: Request, { params }: RouteParams) {
    const { id } = await params;
    return conversationController.delete(req, id);
}

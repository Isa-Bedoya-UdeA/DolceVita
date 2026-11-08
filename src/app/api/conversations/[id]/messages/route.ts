import { conversationController } from "@/server/controllers/conversation.controller";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    const { id } = await params;
    return conversationController.getMessages(req, id);
}

export async function POST(req: Request, { params }: RouteParams) {
    const { id } = await params;
    return conversationController.addMessage(req, id);
}

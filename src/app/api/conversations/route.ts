import { conversationController } from "@/server/controllers/conversation.controller";

export async function GET(req: Request) {
    return conversationController.list(req);
}

export async function POST(req: Request) {
    return conversationController.create(req);
}

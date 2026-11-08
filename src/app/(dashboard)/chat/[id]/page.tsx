import { notFound } from "next/navigation";
import { ChatWindow } from "@/features/chat/components/ChatWindow";

interface ChatPageProps {
    params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: ChatPageProps) {
    const { id } = await params;

    if (!id) {
        notFound();
    }

    return <ChatWindow conversationId={id} />;
}

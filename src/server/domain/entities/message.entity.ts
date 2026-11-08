import { MessageRole } from "../enums/message-role.enum";
import { MessageStatus } from "../enums/message-status.enum";
import { AIProvider } from "../enums/ai-provider.enum";

export interface MessageEntity {
    id: string;
    conversationId: string;
    senderId: string | null;
    role: MessageRole;
    content: string;
    status: MessageStatus;
    provider: AIProvider | null;
    model: string | null;
    createdAt: Date;
    updatedAt: Date;
    editedAt: Date | null;
}

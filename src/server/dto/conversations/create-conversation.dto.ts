import { z } from "zod";

export const createConversationSchema = z
    .object({
        title: z.string().trim().max(100, "Title must not exceed 100 characters").optional(),
    })
    .strict();

export type CreateConversationDto = z.infer<typeof createConversationSchema>;

export interface ConversationResponseDto {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

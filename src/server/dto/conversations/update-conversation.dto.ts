import { z } from "zod";

export const updateConversationSchema = z
    .object({
        title: z
            .string({
                error: "Title is required",
            })
            .trim()
            .min(1, "The field must contain non-whitespace text.")
            .max(100, "Title must not exceed 100 characters"),
    })
    .strict();

export type UpdateConversationDto = z.infer<typeof updateConversationSchema>;

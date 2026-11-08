import { z } from "zod";

export const conversationTitleSchema = z
    .string()
    .trim()
    .min(1, "El título no puede estar vacío")
    .max(100, "El título no puede tener más de 100 caracteres");

export const createConversationSchema = z.object({
    title: conversationTitleSchema.optional(),
});

export const updateConversationSchema = z.object({
    title: conversationTitleSchema,
});

import { z } from "zod";

export const editMessageSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "El mensaje no puede estar vacío")
        .max(4000, "El mensaje no puede superar 4000 caracteres"),
});

export type EditMessageValues = z.infer<typeof editMessageSchema>;

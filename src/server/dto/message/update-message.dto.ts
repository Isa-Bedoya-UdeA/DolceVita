import { z } from "zod";

export const updateMessageSchema = z.object({
    content: z
        .string({ error: "El contenido es obligatorio" })
        .trim()
        .min(1, "El mensaje no puede estar vacío")
        .max(4000, "El mensaje no puede superar 4000 caracteres"),
});

export type UpdateMessageDto = z.infer<typeof updateMessageSchema>;

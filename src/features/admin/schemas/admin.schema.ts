import { z } from "zod";
import { ASSISTANT_CONFIG_LIMITS as L } from "@/lib/constants/assistant.constants";

export const assistantConfigFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(L.name.min, `Mínimo ${L.name.min} caracteres`)
        .max(L.name.max, `Máximo ${L.name.max} caracteres`),
    description: z.string().trim().max(L.description.max, `Máximo ${L.description.max} caracteres`),
    systemPrompt: z
        .string()
        .trim()
        .min(
            L.systemPrompt.min,
            `El System Prompt debe tener al menos ${L.systemPrompt.min} caracteres`,
        )
        .max(L.systemPrompt.max, `Máximo ${L.systemPrompt.max} caracteres`),
    temperature: z
        .number({ error: "Ingresa un número" })
        .min(L.temperature.min, `Mínimo ${L.temperature.min}`)
        .max(L.temperature.max, `Máximo ${L.temperature.max}`),
    maxTokens: z
        .number({ error: "Ingresa un número" })
        .int("Debe ser un número entero")
        .min(L.maxTokens.min, `Mínimo ${L.maxTokens.min}`)
        .max(L.maxTokens.max, `Máximo ${L.maxTokens.max}`),
});

export type AssistantConfigFormValues = z.infer<typeof assistantConfigFormSchema>;

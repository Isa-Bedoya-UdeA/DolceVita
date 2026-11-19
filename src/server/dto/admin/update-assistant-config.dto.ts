import { z } from "zod";
import { ASSISTANT_CONFIG_LIMITS as L } from "../../../lib/constants/assistant.constants";

export const updateAssistantConfigSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(L.name.min, `El nombre debe tener al menos ${L.name.min} caracteres`)
            .max(L.name.max, `El nombre no puede superar ${L.name.max} caracteres`),
        description: z
            .string()
            .trim()
            .max(
                L.description.max,
                `La descripción no puede superar ${L.description.max} caracteres`,
            ),
        systemPrompt: z
            .string()
            .trim()
            .min(
                L.systemPrompt.min,
                `El System Prompt debe tener al menos ${L.systemPrompt.min} caracteres`,
            )
            .max(
                L.systemPrompt.max,
                `El System Prompt no puede superar ${L.systemPrompt.max} caracteres`,
            ),
        temperature: z
            .number({ error: "La temperatura debe ser un número" })
            .min(L.temperature.min, `La temperatura mínima es ${L.temperature.min}`)
            .max(L.temperature.max, `La temperatura máxima es ${L.temperature.max}`),
        maxTokens: z
            .number({ error: "El máximo de tokens debe ser un número" })
            .int("El máximo de tokens debe ser un número entero")
            .min(L.maxTokens.min, `El mínimo permitido es ${L.maxTokens.min} tokens`)
            .max(L.maxTokens.max, `El máximo permitido es ${L.maxTokens.max} tokens`),
    })
    .partial()
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
        message: "Debes enviar al menos un campo para actualizar",
    });

export type UpdateAssistantConfigDto = z.infer<typeof updateAssistantConfigSchema>;

export interface AIProviderInfo {
    name: string;
    model: string;
    configured: boolean;
}

/** Sanitized configuration exposed to administrators (API-014). Never includes credentials. */
export interface AssistantConfigResponseDto {
    id: string | null;
    name: string;
    description: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    guardrails: string;
    updatedAt: string | null;
    providers: {
        primary: AIProviderInfo;
        fallback: AIProviderInfo;
    };
}

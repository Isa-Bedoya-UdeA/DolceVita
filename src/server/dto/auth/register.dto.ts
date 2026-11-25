import { z } from "zod";

/** FR-001 — Server-side (authoritative) validation of the registration payload. */
export const registerSchema = z
    .object({
        name: z
            .string({ error: "El nombre es obligatorio" })
            .trim()
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .max(80, "El nombre no puede superar 80 caracteres"),
        email: z
            .string({ error: "El correo es obligatorio" })
            .trim()
            .toLowerCase()
            .pipe(z.email("Ingresa un correo electrónico válido"))
            .pipe(z.string().max(254, "El correo es demasiado largo")),
        password: z
            .string({ error: "La contraseña es obligatoria" })
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .max(72, "La contraseña no puede superar 72 caracteres")
            .regex(/[a-z]/, "La contraseña debe incluir una letra minúscula")
            .regex(/[A-Z]/, "La contraseña debe incluir una letra mayúscula")
            .regex(/\d/, "La contraseña debe incluir un número"),
    })
    .strict();

export type RegisterDto = z.infer<typeof registerSchema>;

export interface RegisteredUserResponseDto {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
}

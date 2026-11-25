import { z } from "zod";

/**
 * Client-side validation for a better UX. The server (register.dto.ts / login.dto.ts)
 * applies the same rules and is the authoritative check.
 */
const emailField = z
    .string()
    .trim()
    .min(1, "Ingresa tu correo electrónico")
    .pipe(z.email("Ingresa un correo electrónico válido"));

export const loginFormSchema = z.object({
    email: emailField,
    password: z.string().min(1, "Ingresa tu contraseña"),
});

export const passwordRules = [
    { id: "length", label: "Al menos 8 caracteres", test: (v: string) => v.length >= 8 },
    { id: "lower", label: "Una letra minúscula", test: (v: string) => /[a-z]/.test(v) },
    { id: "upper", label: "Una letra mayúscula", test: (v: string) => /[A-Z]/.test(v) },
    { id: "number", label: "Un número", test: (v: string) => /\d/.test(v) },
] as const;

export const registerFormSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .max(80, "El nombre no puede superar 80 caracteres"),
        email: emailField,
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .max(72, "La contraseña no puede superar 72 caracteres")
            .regex(/[a-z]/, "La contraseña debe incluir una letra minúscula")
            .regex(/[A-Z]/, "La contraseña debe incluir una letra mayúscula")
            .regex(/\d/, "La contraseña debe incluir un número"),
        confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden",
    });

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;

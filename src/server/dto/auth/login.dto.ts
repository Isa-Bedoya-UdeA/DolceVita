import { z } from "zod";

/** FR-002 — Credentials accepted by the Auth.js credentials provider. */
export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    // bcrypt only uses the first 72 bytes; longer inputs are rejected outright.
    password: z.string().min(1).max(72),
});

export type LoginDto = z.infer<typeof loginSchema>;

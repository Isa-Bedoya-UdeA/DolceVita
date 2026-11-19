import { z } from "zod";

export const updateRoleSchema = z
    .object({
        role: z.enum(["ADMIN", "USER"], { error: "El rol debe ser 'ADMIN' o 'USER'" }),
    })
    .strict();

export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;

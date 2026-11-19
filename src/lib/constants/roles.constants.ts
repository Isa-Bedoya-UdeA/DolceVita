export const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
} as const;

export type RoleValue = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<RoleValue, string> = {
    ADMIN: "Administrador",
    USER: "Usuario",
};

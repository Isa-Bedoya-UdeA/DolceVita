import { AuthUserRecord } from "@/server/domain/contracts/user-repository.contract";
import { Role } from "@/server/domain/enums/role.enum";

export const VALID_PASSWORD = "Chef1234!";

export function makeAuthUser(overrides: Partial<AuthUserRecord> = {}): AuthUserRecord {
    return {
        id: "user-1",
        name: "Usuario Gastrónomo",
        email: "user@dolcevita.com",
        role: Role.USER,
        image: null,
        passwordHash: null,
        ...overrides,
    };
}

import { Role } from "../enums/role.enum";

export interface AdminUserRecord {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    createdAt: Date;
    conversationCount: number;
}

/** Auth view of a user. Includes the password hash, so it must never leave the server. */
export interface AuthUserRecord {
    id: string;
    name: string;
    email: string;
    role: Role;
    image: string | null;
    passwordHash: string | null;
}

export interface CreateUserWithPasswordInput {
    name: string;
    email: string;
    passwordHash: string;
}

export interface IUserRepository {
    findAllForAdmin(): Promise<AdminUserRecord[]>;
    findByIdForAdmin(id: string): Promise<AdminUserRecord | null>;
    updateRole(id: string, role: Role): Promise<{ id: string; role: Role }>;
    countByRole(role: Role): Promise<number>;
    findByEmail(email: string): Promise<AuthUserRecord | null>;
    createWithPassword(input: CreateUserWithPasswordInput): Promise<AuthUserRecord>;
}

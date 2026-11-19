import { Role } from "../enums/role.enum";

export interface AdminUserRecord {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    createdAt: Date;
    conversationCount: number;
}

export interface IUserRepository {
    findAllForAdmin(): Promise<AdminUserRecord[]>;
    findByIdForAdmin(id: string): Promise<AdminUserRecord | null>;
    updateRole(id: string, role: Role): Promise<{ id: string; role: Role }>;
    countByRole(role: Role): Promise<number>;
}

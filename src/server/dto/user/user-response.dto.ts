import { Role } from "../../domain/enums/role.enum";

/** AdminUserResponse (API.md §9). Password hashes and sessions are never exposed. */
export interface AdminUserResponseDto {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    createdAt: string;
    conversationCount: number;
}

export interface CurrentUserResponseDto {
    id: string;
    name: string | null;
    email: string;
    role: Role;
}

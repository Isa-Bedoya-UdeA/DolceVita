import { RoleValue } from "@/lib/constants/roles.constants";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: RoleValue;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

import { Role } from "../enums/role.enum";

export interface UserEntity {
    id: string;
    name: string;
    email: string;
    role: Role;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

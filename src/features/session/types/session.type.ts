import { RoleValue } from "@/lib/constants/roles.constants";

export interface CurrentUser {
    id: string;
    name: string | null;
    email: string;
    role: RoleValue;
}

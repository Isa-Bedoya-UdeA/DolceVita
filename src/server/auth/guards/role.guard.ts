import { AuthGuard, AuthenticatedUser } from "./auth.guard";
import { ForbiddenException } from "../../exceptions/authorization.exception";
import { Role } from "../../domain/enums/role.enum";

export class RoleGuard {
    /** Resolves the current user and rejects the request unless the role is allowed. */
    static async require(request: Request, ...roles: Role[]): Promise<AuthenticatedUser> {
        const user = await AuthGuard.authenticate(request);
        const role = String(user.role).toUpperCase();

        if (!roles.some((allowed) => allowed === role)) {
            throw new ForbiddenException("Esta operación requiere permisos de administrador");
        }

        return user;
    }

    static requireAdmin(request: Request): Promise<AuthenticatedUser> {
        return RoleGuard.require(request, Role.ADMIN);
    }
}

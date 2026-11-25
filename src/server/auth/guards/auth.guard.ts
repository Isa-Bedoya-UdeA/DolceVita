import { auth } from "../auth";
import { prisma } from "../../infrastructure/database/prisma";
import { UnauthorizedException } from "../../exceptions/auth.exception";

export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

/**
 * FR-002 / FR-003 — Server-side session validation for every protected Route Handler.
 *
 * The identity always comes from the Auth.js session cookie, never from the request body
 * or custom headers. The user is re-read from the database on each request so that a
 * deleted account loses access immediately and a role change made by an ADMIN applies
 * without waiting for the session token to expire.
 */
export class AuthGuard {
    // The request is kept in the signature for the controllers; Auth.js reads the
    // session cookie from the current request context.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async authenticate(_request?: Request): Promise<AuthenticatedUser> {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new UnauthorizedException("Debes iniciar sesión para acceder a este recurso");
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true },
        });

        if (!user) {
            throw new UnauthorizedException("Tu sesión ya no es válida. Inicia sesión de nuevo");
        }

        return user;
    }
}

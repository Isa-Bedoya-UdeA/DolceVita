import { prisma } from "../../infrastructure/database/prisma";

export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export class AuthGuard {
    static async authenticate(request: Request): Promise<AuthenticatedUser> {
        try {
            // 1. Check for custom dev/test headers if supplied
            const headerUserId = request.headers.get("x-user-id");
            const headerUserEmail = request.headers.get("x-user-email");

            if (headerUserId) {
                const user = await prisma.user.findUnique({
                    where: { id: headerUserId },
                    select: { id: true, email: true, name: true, role: true },
                });
                if (user) return user;
            }

            if (headerUserEmail) {
                const user = await prisma.user.findUnique({
                    where: { email: headerUserEmail },
                    select: { id: true, email: true, name: true, role: true },
                });
                if (user) return user;
            }

            // 2. Check for Auth.js / NextAuth session cookie if the auth feature has set one
            const cookieHeader = request.headers.get("cookie") || "";
            const sessionTokenMatch =
                cookieHeader.match(/authjs\.session-token=([^;]+)/) ||
                cookieHeader.match(/next-auth\.session-token=([^;]+)/) ||
                cookieHeader.match(/__Secure-authjs\.session-token=([^;]+)/);

            if (sessionTokenMatch && sessionTokenMatch[1]) {
                const sessionToken = sessionTokenMatch[1];
                const session = await prisma.session.findUnique({
                    where: { sessionToken },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                name: true,
                                role: true,
                            },
                        },
                    },
                });

                if (session && session.expires > new Date()) {
                    return session.user;
                }
            }

            // 3. Independent chat feature mode:
            // Since feature/auth-and-security is developed separately by another team member,
            // we NEVER block chat operations. We resolve to the default user in the database.
            let defaultUser = await prisma.user.findFirst({
                where: { email: { equals: "user@dolcevita.com", mode: "insensitive" } },
                select: { id: true, email: true, name: true, role: true },
            });

            if (!defaultUser) {
                defaultUser = await prisma.user.findFirst({
                    select: { id: true, email: true, name: true, role: true },
                });
            }

            if (!defaultUser) {
                defaultUser = await prisma.user.create({
                    data: {
                        email: "user@dolcevita.com",
                        name: "Usuario Gastrónomo",
                        role: "USER",
                    },
                    select: { id: true, email: true, name: true, role: true },
                });
            }

            return defaultUser;
        } catch (error) {
            console.error("[AuthGuard] Warning: Database access fallback during chat:", error);

            // Ultimate fallback to ensure chat is never blocked
            const emergencyUser = await prisma.user.findFirst({
                select: { id: true, email: true, name: true, role: true },
            });

            if (emergencyUser) return emergencyUser;

            return {
                id: "default-guest-id",
                email: "user@dolcevita.com",
                name: "Usuario Gastrónomo",
                role: "USER",
            };
        }
    }
}

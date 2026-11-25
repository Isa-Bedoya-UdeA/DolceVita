import type { NextAuthConfig } from "next-auth";
import { ROUTES } from "@/lib/constants/routes.constants";
import { SESSION_MAX_AGE_SECONDS, SESSION_UPDATE_AGE_SECONDS } from "@/lib/config/auth.config";

/**
 * Auth.js configuration shared by `auth.ts` and `proxy.ts`.
 * It must not import Prisma or bcrypt so the proxy stays light; the credentials
 * provider (which needs the database) is added in `auth.ts`.
 */
export const authConfig = {
    trustHost: true,
    session: {
        // The credentials provider only supports JWT sessions. The token lives in an
        // HTTP-only, SameSite=lax cookie (Secure in production) managed by Auth.js.
        strategy: "jwt",
        maxAge: SESSION_MAX_AGE_SECONDS,
        updateAge: SESSION_UPDATE_AGE_SECONDS,
    },
    pages: {
        signIn: ROUTES.LOGIN,
        error: ROUTES.LOGIN,
    },
    providers: [],
    callbacks: {
        jwt({ token, user }) {
            // `user` is only present right after a successful sign-in.
            if (user?.id) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && typeof token.id === "string") {
                session.user.id = token.id;
                session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
            }
            return session;
        },
    },
} satisfies NextAuthConfig;

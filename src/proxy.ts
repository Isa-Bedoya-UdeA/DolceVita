import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/server/auth/config";
import {
    ADMIN_ROUTE_PREFIXES,
    DEFAULT_AUTHENTICATED_ROUTE,
    GUEST_ONLY_ROUTES,
    PUBLIC_API_PREFIXES,
    PUBLIC_ROUTES,
    ROUTES,
} from "@/lib/constants/routes.constants";

/**
 * FR-002 / FR-003 — Route protection before rendering.
 *
 * - Visitors can open the landing, /login, /register and the public Auth.js API.
 * - Signed-in users are sent from /login and /register to the chat.
 * - Any other page requires a session (redirect to /login?callbackUrl=...).
 * - /admin and /api/admin require the ADMIN role (redirect to /forbidden or 403).
 *
 * This is the first layer only: every Route Handler still validates the session and
 * role on the server through AuthGuard / RoleGuard, which re-read the user from the DB.
 */
const { auth } = NextAuth(authConfig);

const matchesPrefix = (pathname: string, prefixes: readonly string[]) =>
    prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

const jsonError = (status: 401 | 403, code: string, message: string) =>
    NextResponse.json({ error: { code, message } }, { status });

export const proxy = auth((req) => {
    const { pathname, search } = req.nextUrl;
    const user = req.auth?.user;
    const isLoggedIn = Boolean(user?.id);
    const isApi = pathname.startsWith("/api/");

    if (isApi) {
        if (matchesPrefix(pathname, PUBLIC_API_PREFIXES)) return NextResponse.next();

        if (!isLoggedIn) {
            return jsonError(
                401,
                "UNAUTHORIZED",
                "Debes iniciar sesión para acceder a este recurso",
            );
        }
        if (matchesPrefix(pathname, ADMIN_ROUTE_PREFIXES) && user?.role !== "ADMIN") {
            return jsonError(403, "FORBIDDEN", "No tienes permisos para realizar esta operación");
        }
        return NextResponse.next();
    }

    if (GUEST_ONLY_ROUTES.includes(pathname)) {
        return isLoggedIn
            ? NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_ROUTE, req.nextUrl))
            : NextResponse.next();
    }

    if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

    if (!isLoggedIn) {
        const loginUrl = new URL(ROUTES.LOGIN, req.nextUrl);
        loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
    }

    if (matchesPrefix(pathname, ADMIN_ROUTE_PREFIXES) && user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL(ROUTES.FORBIDDEN, req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    // Skip Next.js internals and static files (anything with a file extension, e.g. /images/Logo.png).
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};

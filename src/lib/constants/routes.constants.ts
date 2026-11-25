export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    FORBIDDEN: "/forbidden",
    CHAT: "/chat",
    CONVERSATIONS: "/conversations",
    ADMIN: "/admin",
} as const;

/** Where users land after signing in when no callbackUrl is provided. */
export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.CHAT;

/** Pages anyone can open, signed in or not. */
export const PUBLIC_ROUTES: readonly string[] = [ROUTES.HOME, ROUTES.FORBIDDEN];

/** Pages only for visitors; signed-in users are sent to the app instead. */
export const GUEST_ONLY_ROUTES: readonly string[] = [ROUTES.LOGIN, ROUTES.REGISTER];

/** API paths that do not require a session (Auth.js endpoints, registration, health check). */
export const PUBLIC_API_PREFIXES: readonly string[] = ["/api/auth", "/api/health"];

/** Page and API prefixes reserved for the ADMIN role. */
export const ADMIN_ROUTE_PREFIXES: readonly string[] = [ROUTES.ADMIN, "/api/admin"];

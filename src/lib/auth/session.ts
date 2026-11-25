// Server-only helper: never import this file from a Client Component.
import { auth } from "@/server/auth/auth";

/** Server Components / Route Handlers: returns the current Auth.js session or null. */
export async function getSession() {
    return auth();
}

export async function getSessionUser() {
    const session = await auth();
    return session?.user ?? null;
}

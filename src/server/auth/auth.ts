import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./config";
import { authService } from "../services/auth.service";

/**
 * Auth.js entry point (FR-002). Exposes the route handlers, `auth()` to read the
 * session on the server, and `signIn` / `signOut` for server actions.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Correo electrónico", type: "email" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {
                const user = await authService.verifyCredentials(credentials);
                if (!user) {
                    console.warn("[Auth] Failed sign-in attempt");
                    return null;
                }
                return user;
            },
        }),
    ],
});

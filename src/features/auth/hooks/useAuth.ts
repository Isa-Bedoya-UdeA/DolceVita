"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "@/lib/auth/auth-client";
import { apiRequest } from "@/lib/api/api-client";
import { endpoints } from "@/lib/api/endpoints";
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/lib/constants/routes.constants";
import { AuthUser, RegisterPayload } from "../types/user.type";

export const INVALID_CREDENTIALS_MESSAGE = "Correo o contraseña incorrectos";

/** Only same-origin relative paths are accepted, to avoid open redirects. */
export function sanitizeCallbackUrl(value: string | null | undefined): string {
    if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
        return DEFAULT_AUTHENTICATED_ROUTE;
    }
    if (value === ROUTES.LOGIN || value === ROUTES.REGISTER) return DEFAULT_AUTHENTICATED_ROUTE;
    return value;
}

export function useAuth() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(
        async (email: string, password: string, callbackUrl?: string | null) => {
            setIsSubmitting(true);
            setError(null);
            try {
                const result = await signIn("credentials", { email, password, redirect: false });
                if (!result || result.error) {
                    setError(INVALID_CREDENTIALS_MESSAGE);
                    return false;
                }
                router.replace(sanitizeCallbackUrl(callbackUrl));
                router.refresh();
                return true;
            } catch {
                setError("No se pudo iniciar sesión. Intenta de nuevo en unos segundos");
                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [router],
    );

    const register = useCallback(
        async (payload: RegisterPayload) => {
            setIsSubmitting(true);
            setError(null);
            try {
                await apiRequest<AuthUser>(endpoints.register, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
                setIsSubmitting(false);
                return false;
            }

            // Account created: sign in straight away with the same credentials.
            const result = await signIn("credentials", {
                email: payload.email,
                password: payload.password,
                redirect: false,
            }).catch(() => null);
            setIsSubmitting(false);

            if (!result || result.error) {
                router.replace(`${ROUTES.LOGIN}?registered=1`);
                return true;
            }
            router.replace(DEFAULT_AUTHENTICATED_ROUTE);
            router.refresh();
            return true;
        },
        [router],
    );

    const logout = useCallback(async () => {
        await signOut({ redirectTo: ROUTES.LOGIN });
    }, []);

    return { login, register, logout, isSubmitting, error, setError };
}

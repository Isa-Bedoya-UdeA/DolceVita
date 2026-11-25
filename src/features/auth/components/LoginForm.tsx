"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChefHat, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes.constants";
import { loginFormSchema, LoginFormValues } from "../schemas/auth.schema";
import { INVALID_CREDENTIALS_MESSAGE, useAuth } from "../hooks/useAuth";
import { PasswordInput } from "./PasswordInput";
import { FormField } from "./FormField";
import { FormAlert } from "./FormAlert";
import { authInputClass, authPrimaryButtonClass } from "./auth-styles";

interface DemoAccount {
    label: string;
    email?: string;
    password?: string;
    icon: typeof ChefHat;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
    {
        label: "Usuario demo",
        email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL,
        password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD,
        icon: ChefHat,
    },
    {
        label: "Administrador demo",
        email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL,
        password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD,
        icon: ShieldCheck,
    },
];

export function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const justRegistered = searchParams.get("registered") === "1";
    // Auth.js redirects here with ?error=... when a sign-in fails outside this form.
    const authError = searchParams.get("error") ? INVALID_CREDENTIALS_MESSAGE : null;

    const { login, isSubmitting, error } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = handleSubmit(({ email, password }) => login(email, password, callbackUrl));

    const signInWithDemo = (account: DemoAccount) => {
        if (!account.email || !account.password) return;
        setValue("email", account.email, { shouldValidate: true });
        setValue("password", account.password, { shouldValidate: true });
        void login(account.email, account.password, callbackUrl);
    };

    const availableDemos = DEMO_ACCOUNTS.filter((a) => a.email && a.password);
    const message = error ?? authError;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-text-primary text-2xl font-bold tracking-tight">
                    Bienvenido de nuevo
                </h1>
                <p className="text-text-secondary mt-1 text-sm">
                    Inicia sesión para seguir cocinando con George.
                </p>
            </div>

            {justRegistered && !message && (
                <FormAlert
                    variant="success"
                    message="Tu cuenta fue creada. Ya puedes iniciar sesión."
                />
            )}
            {message && <FormAlert message={message} />}

            <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Iniciar sesión">
                <FormField id="email" label="Correo electrónico" error={errors.email?.message}>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="tu@correo.com"
                        aria-invalid={Boolean(errors.email) || undefined}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={authInputClass}
                        disabled={isSubmitting}
                        {...register("email")}
                    />
                </FormField>

                <FormField id="password" label="Contraseña" error={errors.password?.message}>
                    <PasswordInput
                        id="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        hasError={Boolean(errors.password)}
                        aria-describedby={errors.password ? "password-error" : undefined}
                        disabled={isSubmitting}
                        {...register("password")}
                    />
                </FormField>

                <button type="submit" className={authPrimaryButtonClass} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <LogIn className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
                </button>
            </form>

            {availableDemos.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="bg-border h-px flex-1" />
                        <span className="text-text-secondary text-xs font-medium tracking-wide uppercase">
                            Acceso rápido de evaluación
                        </span>
                        <span className="bg-border h-px flex-1" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {availableDemos.map((account) => (
                            <button
                                key={account.label}
                                type="button"
                                onClick={() => signInWithDemo(account)}
                                disabled={isSubmitting}
                                className="border-border bg-surface text-text-primary hover:bg-surface-muted hover:border-brand-primary/40 focus-visible:ring-brand-primary flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
                            >
                                <account.icon className="text-brand-primary h-4 w-4 shrink-0" />
                                <span className="min-w-0">
                                    <span className="block font-medium">{account.label}</span>
                                    <span className="text-text-secondary block truncate text-xs">
                                        {account.email}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-text-secondary text-center text-sm">
                ¿Aún no tienes cuenta?{" "}
                <Link
                    href={ROUTES.REGISTER}
                    className="text-brand-primary font-semibold hover:underline"
                >
                    Regístrate
                </Link>
            </p>
        </div>
    );
}

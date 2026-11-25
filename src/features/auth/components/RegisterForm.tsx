"use client";

import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, UserPlus } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes.constants";
import { passwordRules, registerFormSchema, RegisterFormValues } from "../schemas/auth.schema";
import { useAuth } from "../hooks/useAuth";
import { PasswordInput } from "./PasswordInput";
import { FormField } from "./FormField";
import { FormAlert } from "./FormAlert";
import { authInputClass, authPrimaryButtonClass } from "./auth-styles";

export function RegisterForm() {
    const { register: registerAccount, isSubmitting, error } = useAuth();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

    const password = useWatch({ control, name: "password" }) ?? "";

    const onSubmit = handleSubmit(({ name, email, password }) =>
        registerAccount({ name, email, password }),
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-text-primary text-2xl font-bold tracking-tight">
                    Crea tu cuenta
                </h1>
                <p className="text-text-secondary mt-1 text-sm">
                    Guarda tus conversaciones con George y retómalas cuando quieras.
                </p>
            </div>

            {error && <FormAlert message={error} />}

            <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Crear cuenta">
                <FormField id="name" label="Nombre" error={errors.name?.message}>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Tu nombre"
                        aria-invalid={Boolean(errors.name) || undefined}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={authInputClass}
                        disabled={isSubmitting}
                        {...register("name")}
                    />
                </FormField>

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
                        autoComplete="new-password"
                        placeholder="••••••••"
                        hasError={Boolean(errors.password)}
                        aria-describedby="password-rules"
                        disabled={isSubmitting}
                        {...register("password")}
                    />
                    <ul id="password-rules" className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                        {passwordRules.map((rule) => {
                            const ok = rule.test(password);
                            return (
                                <li
                                    key={rule.id}
                                    className={`flex items-center gap-1.5 text-xs ${
                                        ok ? "text-success-foreground" : "text-text-secondary"
                                    }`}
                                >
                                    <Check
                                        className={`h-3.5 w-3.5 ${ok ? "opacity-100" : "opacity-30"}`}
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {rule.label}
                                        <span className="sr-only">
                                            {ok ? " (cumple)" : " (pendiente)"}
                                        </span>
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </FormField>

                <FormField
                    id="confirmPassword"
                    label="Confirmar contraseña"
                    error={errors.confirmPassword?.message}
                >
                    <PasswordInput
                        id="confirmPassword"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        hasError={Boolean(errors.confirmPassword)}
                        aria-describedby={
                            errors.confirmPassword ? "confirmPassword-error" : undefined
                        }
                        disabled={isSubmitting}
                        {...register("confirmPassword")}
                    />
                </FormField>

                <button type="submit" className={authPrimaryButtonClass} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <UserPlus className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                </button>
            </form>

            <p className="text-text-secondary text-center text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link
                    href={ROUTES.LOGIN}
                    className="text-brand-primary font-semibold hover:underline"
                >
                    Inicia sesión
                </Link>
            </p>
        </div>
    );
}

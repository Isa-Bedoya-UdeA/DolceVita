"use client";

import { ComponentProps, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authInputClass } from "./auth-styles";

type PasswordInputProps = Omit<ComponentProps<"input">, "type"> & { hasError?: boolean };

export function PasswordInput({ className, hasError, ref, ...props }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                ref={ref}
                type={visible ? "text" : "password"}
                aria-invalid={hasError || undefined}
                className={[
                    authInputClass,
                    "pr-11",
                    hasError ? "border-error-border" : "",
                    className ?? "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                {...props}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="text-text-secondary hover:text-text-primary focus-visible:ring-brand-primary absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl transition focus-visible:ring-2 focus-visible:outline-none"
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={visible}
            >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}

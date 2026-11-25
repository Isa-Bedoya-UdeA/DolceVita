import { ReactNode } from "react";
import { authLabelClass } from "./auth-styles";

interface FormFieldProps {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
    return (
        <div>
            <label htmlFor={id} className={authLabelClass}>
                {label}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} role="alert" className="text-error-foreground mt-1.5 text-xs">
                    {error}
                </p>
            )}
        </div>
    );
}

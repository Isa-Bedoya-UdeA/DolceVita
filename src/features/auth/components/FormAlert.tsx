import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormAlertProps {
    message: string;
    variant?: "error" | "success";
}

export function FormAlert({ message, variant = "error" }: FormAlertProps) {
    const Icon = variant === "error" ? AlertCircle : CheckCircle2;
    const styles =
        variant === "error"
            ? "border-error-border bg-error text-error-foreground"
            : "border-success-border bg-success text-success-foreground";

    return (
        <div
            role={variant === "error" ? "alert" : "status"}
            className={`flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm ${styles}`}
        >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
}

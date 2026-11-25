import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Iniciar sesión | Dolce Vita",
};

export default function LoginPage() {
    return (
        // LoginForm reads ?callbackUrl / ?error, so it renders inside a Suspense boundary.
        <Suspense
            fallback={
                <div className="flex justify-center py-16">
                    <Loader2
                        className="text-brand-primary h-6 w-6 animate-spin"
                        aria-label="Cargando"
                    />
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}

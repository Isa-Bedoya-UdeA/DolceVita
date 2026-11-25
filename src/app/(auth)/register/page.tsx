import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
    title: "Crear cuenta | Dolce Vita",
};

export default function RegisterPage() {
    return <RegisterForm />;
}

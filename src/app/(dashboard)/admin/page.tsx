"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Users } from "lucide-react";
import { useAdminStatistics } from "@/features/admin/hooks/useAdminStatistics";
import { StatisticsCards } from "@/features/admin/components/StatisticsCards";
import { ActivityChart } from "@/features/admin/components/ActivityChart";
import { AdminErrorState, AdminPageHeader } from "@/features/admin/components/AdminPageHeader";

const SECTIONS = [
    {
        href: "/admin/users",
        title: "Usuarios y roles",
        description: "Consulta las cuentas registradas y asigna el rol de administrador o usuario.",
        icon: Users,
    },
    {
        href: "/admin/assistant",
        title: "Configuración de George",
        description:
            "Edita el System Prompt, la temperatura y la longitud máxima de las respuestas.",
        icon: Bot,
    },
    {
        href: "/admin/statistics",
        title: "Estadísticas",
        description: "Actividad de la plataforma, uso de proveedores de IA y satisfacción.",
        icon: BarChart3,
    },
];

export default function AdminPage() {
    const { statistics, isLoading, error, refetch } = useAdminStatistics();

    return (
        <>
            <AdminPageHeader
                title="Panel de administración"
                description="Gestiona usuarios, la configuración del asistente y el uso de la plataforma."
            />

            {error ? (
                <AdminErrorState message={error} onRetry={refetch} />
            ) : (
                <StatisticsCards statistics={statistics} isLoading={isLoading} />
            )}

            <div className="grid gap-4 md:grid-cols-3">
                {SECTIONS.map(({ href, title, description, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group border-border bg-surface hover:border-brand-primary/50 hover:shadow-elevation-1 flex flex-col rounded-2xl border p-5 transition"
                    >
                        <div className="bg-brand-primary/10 text-brand-primary mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
                            <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="text-text-primary text-base font-semibold">{title}</h2>
                        <p className="text-text-secondary mt-1 flex-1 text-sm">{description}</p>
                        <span className="text-brand-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
                            Abrir
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </span>
                    </Link>
                ))}
            </div>

            {statistics && <ActivityChart activity={statistics.activity} />}
        </>
    );
}

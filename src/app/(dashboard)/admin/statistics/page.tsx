"use client";

import { RefreshCw } from "lucide-react";
import { useAdminStatistics } from "@/features/admin/hooks/useAdminStatistics";
import { StatisticsCards } from "@/features/admin/components/StatisticsCards";
import { ActivityChart } from "@/features/admin/components/ActivityChart";
import { DistributionCard } from "@/features/admin/components/DistributionCard";
import { AdminErrorState, AdminPageHeader } from "@/features/admin/components/AdminPageHeader";

export default function AdminStatisticsPage() {
    const { statistics, isLoading, error, refetch } = useAdminStatistics();

    return (
        <>
            <AdminPageHeader
                title="Estadísticas"
                description={
                    statistics
                        ? `Datos calculados el ${new Date(statistics.generatedAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}`
                        : "Indicadores generales de la plataforma"
                }
                action={
                    <button
                        type="button"
                        onClick={refetch}
                        disabled={isLoading}
                        className="border-border bg-surface text-text-primary hover:bg-surface-muted inline-flex items-center gap-2 self-start rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 sm:self-auto"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        Actualizar
                    </button>
                }
            />

            {error ? (
                <AdminErrorState message={error} onRetry={refetch} />
            ) : (
                <>
                    <StatisticsCards statistics={statistics} isLoading={isLoading} />

                    {statistics && (
                        <>
                            <ActivityChart activity={statistics.activity} />

                            <div className="grid gap-4 md:grid-cols-2">
                                <DistributionCard
                                    title="Mensajes por autor"
                                    items={[
                                        { label: "Usuarios", value: statistics.messages.fromUsers },
                                        {
                                            label: "George",
                                            value: statistics.messages.fromAssistant,
                                        },
                                        { label: "Fallidos", value: statistics.messages.failed },
                                    ]}
                                />
                                <DistributionCard
                                    title="Respuestas por proveedor de IA"
                                    items={[
                                        {
                                            label: "OpenRouter (principal)",
                                            value: statistics.messages.byProvider.OPENROUTER,
                                        },
                                        {
                                            label: "Groq (respaldo)",
                                            value: statistics.messages.byProvider.GROQ,
                                        },
                                    ]}
                                />
                                <DistributionCard
                                    title="Calificaciones de las respuestas"
                                    items={[
                                        { label: "Positivas", value: statistics.feedback.positive },
                                        { label: "Negativas", value: statistics.feedback.negative },
                                    ]}
                                    emptyText="Aún no hay respuestas calificadas"
                                />
                                <div className="border-border bg-surface rounded-2xl border p-5 md:p-6">
                                    <h2 className="text-text-primary mb-4 text-base font-semibold">
                                        Uso de conversaciones
                                    </h2>
                                    <dl className="grid grid-cols-2 gap-4">
                                        {[
                                            [
                                                "Promedio de mensajes",
                                                statistics.conversations.averageMessages,
                                            ],
                                            [
                                                "Activas en 7 días",
                                                statistics.conversations.activeLast7Days,
                                            ],
                                            ["Mensajes en 7 días", statistics.messages.last7Days],
                                            [
                                                "Usuarios nuevos en 7 días",
                                                statistics.users.newLast7Days,
                                            ],
                                        ].map(([label, value]) => (
                                            <div
                                                key={label}
                                                className="bg-surface-muted rounded-xl px-4 py-3"
                                            >
                                                <dt className="text-text-secondary text-[11px] tracking-wide uppercase">
                                                    {label}
                                                </dt>
                                                <dd className="font-heading text-text-primary mt-1 text-2xl font-bold">
                                                    {value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}

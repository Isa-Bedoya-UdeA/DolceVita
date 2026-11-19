"use client";

import { useAdminAssistant } from "@/features/admin/hooks/useAdminAssistant";
import { AssistantConfigForm } from "@/features/admin/components/AssistantConfigForm";
import { AdminErrorState, AdminPageHeader } from "@/features/admin/components/AdminPageHeader";

function formatUpdatedAt(iso: string | null) {
    if (!iso)
        return "Usando la configuración por defecto (aún no se ha guardado en la base de datos)";
    return `Última actualización: ${new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}`;
}

export default function AdminAssistantPage() {
    const { config, isLoading, isSaving, error, saveConfig, refetch } = useAdminAssistant();

    return (
        <>
            <AdminPageHeader
                title="Configuración de George"
                description={
                    config
                        ? formatUpdatedAt(config.updatedAt)
                        : "Instrucciones y parámetros del asistente"
                }
            />

            {error ? (
                <AdminErrorState message={error} onRetry={refetch} />
            ) : isLoading || !config ? (
                <div className="space-y-4">
                    <div className="border-border bg-surface-muted h-36 animate-pulse rounded-2xl border" />
                    <div className="border-border bg-surface-muted h-80 animate-pulse rounded-2xl border" />
                </div>
            ) : (
                <AssistantConfigForm config={config} isSaving={isSaving} onSubmit={saveConfig} />
            )}
        </>
    );
}

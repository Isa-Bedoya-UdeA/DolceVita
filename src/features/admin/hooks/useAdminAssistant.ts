"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api/api-client";
import { endpoints } from "@/lib/api/endpoints";
import { AssistantConfig } from "../types/admin.type";
import { AssistantConfigFormValues } from "../schemas/admin.schema";

export function useAdminAssistant() {
    const [config, setConfig] = useState<AssistantConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConfig = useCallback(() => {
        return apiRequest<AssistantConfig>(endpoints.adminAssistant)
            .then((data) => {
                setConfig(data);
                setError(null);
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "No se pudo cargar la configuración");
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        void fetchConfig();
    }, [fetchConfig]);

    const refetch = useCallback(() => {
        setIsLoading(true);
        void fetchConfig();
    }, [fetchConfig]);

    const saveConfig = useCallback(
        async (values: AssistantConfigFormValues): Promise<AssistantConfig | null> => {
            setIsSaving(true);
            try {
                const saved = await apiRequest<AssistantConfig>(endpoints.adminAssistant, {
                    method: "PATCH",
                    body: JSON.stringify(values),
                });
                setConfig(saved);
                toast.success("Configuración de George guardada");
                return saved;
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "No se pudo guardar la configuración",
                );
                return null;
            } finally {
                setIsSaving(false);
            }
        },
        [],
    );

    return { config, isLoading, isSaving, error, saveConfig, refetch };
}

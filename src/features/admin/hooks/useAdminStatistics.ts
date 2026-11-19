"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/api-client";
import { endpoints } from "@/lib/api/endpoints";
import { AdminStatistics } from "../types/admin.type";

export function useAdminStatistics() {
    const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatistics = useCallback(() => {
        return apiRequest<AdminStatistics>(endpoints.adminStatistics)
            .then((data) => {
                setStatistics(data);
                setError(null);
            })
            .catch((err: unknown) => {
                setError(
                    err instanceof Error ? err.message : "No se pudieron cargar las estadísticas",
                );
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        void fetchStatistics();
    }, [fetchStatistics]);

    const refetch = useCallback(() => {
        setIsLoading(true);
        void fetchStatistics();
    }, [fetchStatistics]);

    return { statistics, isLoading, error, refetch };
}

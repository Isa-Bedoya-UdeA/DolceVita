"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api/api-client";
import { endpoints } from "@/lib/api/endpoints";
import { ROLE_LABELS, RoleValue } from "@/lib/constants/roles.constants";
import { AdminUser } from "../types/admin.type";

export function useAdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchUsers = useCallback(() => {
        return apiRequest<AdminUser[]>(endpoints.adminUsers)
            .then((data) => {
                setUsers(data);
                setError(null);
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "No se pudieron cargar los usuarios");
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        void fetchUsers();
    }, [fetchUsers]);

    const refetch = useCallback(() => {
        setIsLoading(true);
        void fetchUsers();
    }, [fetchUsers]);

    const updateRole = useCallback(async (userId: string, role: RoleValue): Promise<boolean> => {
        setUpdatingId(userId);
        try {
            const updated = await apiRequest<{ id: string; role: RoleValue }>(
                endpoints.adminUser(userId),
                {
                    method: "PATCH",
                    body: JSON.stringify({ role }),
                },
            );
            setUsers((prev) =>
                prev.map((u) => (u.id === updated.id ? { ...u, role: updated.role } : u)),
            );
            toast.success(`Rol actualizado a ${ROLE_LABELS[updated.role]}`);
            return true;
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "No se pudo actualizar el rol");
            return false;
        } finally {
            setUpdatingId(null);
        }
    }, []);

    return { users, isLoading, error, updatingId, updateRole, refetch };
}

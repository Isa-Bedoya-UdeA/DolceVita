"use client";

import { useMemo, useState } from "react";
import { Search, UserX } from "lucide-react";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { useCurrentUser } from "@/features/session/hooks/useCurrentUser";
import { UserTable } from "@/features/admin/components/UserTable";
import { AdminErrorState, AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ROLES } from "@/lib/constants/roles.constants";

type RoleFilter = "ALL" | (typeof ROLES)[keyof typeof ROLES];

export default function AdminUsersPage() {
    const { users, isLoading, error, updatingId, updateRole, refetch } = useAdminUsers();
    const { user: currentUser } = useCurrentUser();
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter((u) => {
            const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
            const matchesSearch =
                !q || u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q);
            return matchesRole && matchesSearch;
        });
    }, [users, search, roleFilter]);

    const admins = users.filter((u) => u.role === ROLES.ADMIN).length;

    return (
        <>
            <AdminPageHeader
                title="Usuarios y roles"
                description={
                    isLoading
                        ? "Cargando usuarios..."
                        : `${users.length} usuarios registrados · ${admins} ${admins === 1 ? "administrador" : "administradores"}`
                }
            />

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="text-text-secondary absolute top-3 left-3.5 h-4 w-4" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre o correo..."
                        aria-label="Buscar usuarios"
                        className="border-border bg-surface text-text-primary placeholder:text-text-secondary/70 focus:border-brand-primary focus:ring-brand-primary/20 w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-hidden transition focus:ring-2"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                    aria-label="Filtrar por rol"
                    className="border-border bg-surface text-text-primary focus:border-brand-primary focus:ring-brand-primary/20 rounded-xl border px-3.5 py-2.5 text-sm outline-hidden focus:ring-2"
                >
                    <option value="ALL">Todos los roles</option>
                    <option value={ROLES.ADMIN}>Administradores</option>
                    <option value={ROLES.USER}>Usuarios</option>
                </select>
            </div>

            {error ? (
                <AdminErrorState message={error} onRetry={refetch} />
            ) : isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="border-border bg-surface-muted h-16 animate-pulse rounded-xl border"
                        />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="border-border flex flex-col items-center rounded-2xl border border-dashed py-14 text-center">
                    <UserX className="text-text-secondary/50 mb-3 h-10 w-10" />
                    <p className="text-text-primary text-sm font-semibold">
                        No hay usuarios que coincidan
                    </p>
                    <p className="text-text-secondary mt-1 text-xs">
                        Prueba con otro término o filtro.
                    </p>
                </div>
            ) : (
                <UserTable
                    users={filtered}
                    currentUserId={currentUser?.id}
                    updatingId={updatingId}
                    onRoleChange={updateRole}
                />
            )}

            <p className="text-text-secondary text-xs">
                No puedes cambiar tu propio rol y siempre debe quedar al menos un administrador.
            </p>
        </>
    );
}

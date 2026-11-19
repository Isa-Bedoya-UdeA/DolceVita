"use client";

import { Loader2 } from "lucide-react";
import { ROLES, ROLE_LABELS, RoleValue } from "@/lib/constants/roles.constants";
import { AdminUser } from "../types/admin.type";
import { RoleSelector } from "./RoleSelector";

interface UserTableProps {
    users: AdminUser[];
    currentUserId?: string;
    updatingId: string | null;
    onRoleChange: (userId: string, role: RoleValue) => void;
}

function RoleBadge({ role }: { role: RoleValue }) {
    const styles =
        role === ROLES.ADMIN
            ? "bg-brand-primary/10 text-brand-primary border-brand-primary/30"
            : "bg-surface-muted text-text-secondary border-border";
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${styles}`}
        >
            {ROLE_LABELS[role]}
        </span>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function UserTable({ users, currentUserId, updatingId, onRoleChange }: UserTableProps) {
    const renderSelector = (user: AdminUser) => {
        const isSelf = user.id === currentUserId;
        const isUpdating = updatingId === user.id;
        return (
            <div className="flex items-center gap-2">
                <RoleSelector
                    value={user.role}
                    disabled={isSelf || isUpdating}
                    onChange={(role) => onRoleChange(user.id, role)}
                    label={`Rol de ${user.email}`}
                />
                {isUpdating && (
                    <Loader2
                        className="text-brand-primary h-4 w-4 animate-spin"
                        aria-label="Guardando"
                    />
                )}
            </div>
        );
    };

    const renderName = (user: AdminUser) => (
        <>
            <p className="text-text-primary font-medium">
                {user.name || "Sin nombre"}
                {user.id === currentUserId && (
                    <span className="text-text-secondary ml-2 text-xs">(tú)</span>
                )}
            </p>
            <p className="text-text-secondary text-xs break-all">{user.email}</p>
        </>
    );

    return (
        <>
            <ul className="space-y-3 md:hidden">
                {users.map((user) => (
                    <li key={user.id} className="border-border bg-surface rounded-2xl border p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">{renderName(user)}</div>
                            <RoleBadge role={user.role} />
                        </div>
                        <p className="text-text-secondary mt-2 text-xs">
                            {user.conversationCount} conversaciones · registro{" "}
                            {formatDate(user.createdAt)}
                        </p>
                        <div className="border-border mt-3 border-t pt-3">
                            {renderSelector(user)}
                        </div>
                    </li>
                ))}
            </ul>

            <div className="border-border bg-surface hidden overflow-x-auto rounded-2xl border md:block">
                <table className="w-full text-left text-sm">
                    <thead className="border-border bg-surface-muted/60 text-text-secondary border-b text-xs tracking-wide uppercase">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Usuario
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Rol
                            </th>
                            <th scope="col" className="px-4 py-3 text-center font-medium">
                                Conversaciones
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Registro
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Cambiar rol
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-surface-muted/40 transition">
                                <td className="px-4 py-3">{renderName(user)}</td>
                                <td className="px-4 py-3">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="text-text-primary px-4 py-3 text-center">
                                    {user.conversationCount}
                                </td>
                                <td className="text-text-secondary px-4 py-3">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="px-4 py-3">{renderSelector(user)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

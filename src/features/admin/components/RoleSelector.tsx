"use client";

import { ROLE_LABELS, ROLES, RoleValue } from "@/lib/constants/roles.constants";

interface RoleSelectorProps {
    value: RoleValue;
    disabled?: boolean;
    onChange: (role: RoleValue) => void;
    label: string;
}

export function RoleSelector({ value, disabled, onChange, label }: RoleSelectorProps) {
    return (
        <select
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value as RoleValue)}
            aria-label={label}
            className="border-border bg-surface text-text-primary focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg border px-2.5 py-1.5 text-xs font-medium outline-hidden transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {Object.values(ROLES).map((role) => (
                <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                </option>
            ))}
        </select>
    );
}

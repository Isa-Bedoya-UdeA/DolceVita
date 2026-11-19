import type { LucideIcon } from "lucide-react";

interface StatisticsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    hint?: string;
}

export function StatisticsCard({ label, value, icon: Icon, hint }: StatisticsCardProps) {
    return (
        <div className="border-border bg-surface hover:shadow-elevation-1 rounded-2xl border p-5 transition">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-text-secondary text-xs font-medium tracking-wide uppercase">
                        {label}
                    </p>
                    <p className="font-heading text-text-primary mt-2 text-3xl font-bold">
                        {value}
                    </p>
                </div>
                <div className="bg-brand-primary/10 text-brand-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
            </div>
            {hint && <p className="text-text-secondary mt-3 text-xs">{hint}</p>}
        </div>
    );
}

export function StatisticsCardSkeleton() {
    return <div className="border-border bg-surface-muted h-32 animate-pulse rounded-2xl border" />;
}

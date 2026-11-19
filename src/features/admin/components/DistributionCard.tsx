interface DistributionItem {
    label: string;
    value: number;
}

interface DistributionCardProps {
    title: string;
    items: DistributionItem[];
    emptyText?: string;
}

export function DistributionCard({
    title,
    items,
    emptyText = "Sin datos todavía",
}: DistributionCardProps) {
    const total = items.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="border-border bg-surface rounded-2xl border p-5 md:p-6">
            <h2 className="text-text-primary mb-4 text-base font-semibold">{title}</h2>
            {total === 0 ? (
                <p className="text-text-secondary text-sm">{emptyText}</p>
            ) : (
                <ul className="space-y-4">
                    {items.map((item) => {
                        const percent = Math.round((item.value / total) * 100);
                        return (
                            <li key={item.label}>
                                <div className="mb-1.5 flex justify-between text-sm">
                                    <span className="text-text-primary">{item.label}</span>
                                    <span className="text-text-secondary">
                                        {item.value} ({percent}%)
                                    </span>
                                </div>
                                <div className="bg-surface-muted h-2 overflow-hidden rounded-full">
                                    <div
                                        className="bg-brand-primary h-full rounded-full"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

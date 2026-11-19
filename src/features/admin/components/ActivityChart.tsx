import { DailyActivity } from "../types/admin.type";

interface ActivityChartProps {
    activity: DailyActivity[];
}

function dayLabel(date: string) {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-CO", { weekday: "short", day: "numeric" });
}

export function ActivityChart({ activity }: ActivityChartProps) {
    const max = Math.max(1, ...activity.map((d) => d.messages));
    const total = activity.reduce((sum, d) => sum + d.messages, 0);

    return (
        <div className="border-border bg-surface rounded-2xl border p-5 md:p-6">
            <div className="mb-5 flex items-baseline justify-between gap-2">
                <h2 className="text-text-primary text-base font-semibold">Mensajes por día</h2>
                <span className="text-text-secondary text-xs">{total} en los últimos 7 días</span>
            </div>
            <div
                className="flex h-48 items-end gap-2 sm:gap-4"
                role="img"
                aria-label="Mensajes por día en los últimos 7 días"
            >
                {activity.map((day) => (
                    <div
                        key={day.date}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                        <span className="text-text-primary text-xs font-semibold">
                            {day.messages}
                        </span>
                        <div
                            className="bg-brand-primary/80 w-full max-w-12 rounded-t-lg transition-all"
                            style={{
                                height: `${Math.max((day.messages / max) * 100, day.messages > 0 ? 4 : 1)}%`,
                            }}
                        />
                        <span className="text-text-secondary text-[11px] capitalize">
                            {dayLabel(day.date)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

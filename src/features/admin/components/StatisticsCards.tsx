import { MessageSquare, MessagesSquare, ThumbsUp, Users } from "lucide-react";
import { AdminStatistics } from "../types/admin.type";
import { StatisticsCard, StatisticsCardSkeleton } from "./StatisticsCard";

interface StatisticsCardsProps {
    statistics: AdminStatistics | null;
    isLoading: boolean;
}

export function StatisticsCards({ statistics, isLoading }: StatisticsCardsProps) {
    if (isLoading || !statistics) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <StatisticsCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    const { users, conversations, messages, feedback } = statistics;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatisticsCard
                label="Usuarios"
                value={users.total}
                icon={Users}
                hint={`${users.admins} ${users.admins === 1 ? "administrador" : "administradores"} · ${users.newLast7Days} nuevos en 7 días`}
            />
            <StatisticsCard
                label="Conversaciones"
                value={conversations.total}
                icon={MessagesSquare}
                hint={`${conversations.activeLast7Days} activas en los últimos 7 días`}
            />
            <StatisticsCard
                label="Mensajes"
                value={messages.total}
                icon={MessageSquare}
                hint={`${messages.fromAssistant} respuestas de George · ${messages.failed} fallidas`}
            />
            <StatisticsCard
                label="Satisfacción"
                value={
                    feedback.satisfactionRate === null
                        ? "Sin datos"
                        : `${feedback.satisfactionRate}%`
                }
                icon={ThumbsUp}
                hint={`${feedback.positive} positivas · ${feedback.negative} negativas`}
            />
        </div>
    );
}

import { prisma } from "../infrastructure/database/prisma";

export interface DailyActivity {
    date: string;
    messages: number;
}

/** API-015. Only aggregated figures: no message contents, passwords or sessions. */
export interface AdminStatisticsDto {
    generatedAt: string;
    users: {
        total: number;
        admins: number;
        users: number;
        newLast7Days: number;
    };
    conversations: {
        total: number;
        activeLast7Days: number;
        averageMessages: number;
    };
    messages: {
        total: number;
        fromUsers: number;
        fromAssistant: number;
        failed: number;
        last7Days: number;
        byProvider: { OPENROUTER: number; GROQ: number };
    };
    feedback: {
        positive: number;
        negative: number;
        satisfactionRate: number | null;
    };
    activity: DailyActivity[];
}

const DAY_MS = 24 * 60 * 60 * 1000;
const TIME_ZONE = "America/Bogota";

function dayKey(date: Date): string {
    return date.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}

export function buildDailyActivity(dates: Date[], now: Date, days = 7): DailyActivity[] {
    const buckets = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
        buckets.set(dayKey(new Date(now.getTime() - i * DAY_MS)), 0);
    }
    for (const date of dates) {
        const key = dayKey(date);
        if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return Array.from(buckets, ([date, messages]) => ({ date, messages }));
}

export class StatisticsService {
    async getStatistics(now: Date = new Date()): Promise<AdminStatisticsDto> {
        const since = new Date(now.getTime() - 7 * DAY_MS);

        const [
            totalUsers,
            admins,
            newUsers,
            totalConversations,
            activeConversations,
            totalMessages,
            userMessages,
            assistantMessages,
            failedMessages,
            recentMessages,
            byProvider,
            byRating,
            recentDates,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "ADMIN" } }),
            prisma.user.count({ where: { createdAt: { gte: since } } }),
            prisma.conversation.count(),
            prisma.conversation.count({ where: { updatedAt: { gte: since } } }),
            prisma.message.count(),
            prisma.message.count({ where: { role: "USER" } }),
            prisma.message.count({ where: { role: "ASSISTANT", status: "COMPLETED" } }),
            prisma.message.count({ where: { status: "FAILED" } }),
            prisma.message.count({ where: { createdAt: { gte: since } } }),
            prisma.message.groupBy({
                by: ["provider"],
                where: { role: "ASSISTANT", provider: { not: null } },
                _count: { _all: true },
            }),
            prisma.messageFeedback.groupBy({ by: ["rating"], _count: { _all: true } }),
            prisma.message.findMany({
                where: { createdAt: { gte: since } },
                select: { createdAt: true },
            }),
        ]);

        const providerCount = (name: string) =>
            byProvider.find((row) => row.provider === name)?._count._all ?? 0;
        const ratingCount = (name: string) =>
            byRating.find((row) => row.rating === name)?._count._all ?? 0;

        const positive = ratingCount("POSITIVE");
        const negative = ratingCount("NEGATIVE");
        const rated = positive + negative;

        return {
            generatedAt: now.toISOString(),
            users: {
                total: totalUsers,
                admins,
                users: totalUsers - admins,
                newLast7Days: newUsers,
            },
            conversations: {
                total: totalConversations,
                activeLast7Days: activeConversations,
                averageMessages:
                    totalConversations > 0
                        ? Math.round((totalMessages / totalConversations) * 10) / 10
                        : 0,
            },
            messages: {
                total: totalMessages,
                fromUsers: userMessages,
                fromAssistant: assistantMessages,
                failed: failedMessages,
                last7Days: recentMessages,
                byProvider: {
                    OPENROUTER: providerCount("OPENROUTER"),
                    GROQ: providerCount("GROQ"),
                },
            },
            feedback: {
                positive,
                negative,
                satisfactionRate: rated > 0 ? Math.round((positive / rated) * 100) : null,
            },
            activity: buildDailyActivity(
                recentDates.map((row: { createdAt: Date }) => row.createdAt),
                now,
            ),
        };
    }
}

export const statisticsService = new StatisticsService();

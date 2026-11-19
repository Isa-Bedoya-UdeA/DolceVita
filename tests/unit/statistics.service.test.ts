import { describe, it, expect, vi } from "vitest";
import { buildDailyActivity } from "@/server/services/statistics.service";

vi.mock("@/server/infrastructure/database/prisma", () => ({ prisma: {} }));

describe("buildDailyActivity (FR-021)", () => {
    const now = new Date("2026-11-18T20:00:00Z"); // 15:00 en Bogotá

    it("returns seven consecutive days ending today, with zero-filled gaps", () => {
        const activity = buildDailyActivity([], now);
        expect(activity).toHaveLength(7);
        expect(activity[0].date).toBe("2026-11-12");
        expect(activity[6].date).toBe("2026-11-18");
        expect(activity.every((d) => d.messages === 0)).toBe(true);
    });

    it("groups messages by local Bogotá date", () => {
        const activity = buildDailyActivity(
            [
                new Date("2026-11-18T15:00:00Z"),
                new Date("2026-11-18T04:00:00Z"), // 23:00 del 17 en Bogotá
                new Date("2026-11-16T12:00:00Z"),
                new Date("2026-11-01T12:00:00Z"), // fuera de la ventana
            ],
            now,
        );
        const byDate = Object.fromEntries(activity.map((d) => [d.date, d.messages]));
        expect(byDate["2026-11-18"]).toBe(1);
        expect(byDate["2026-11-17"]).toBe(1);
        expect(byDate["2026-11-16"]).toBe(1);
        expect(activity.reduce((s, d) => s + d.messages, 0)).toBe(3);
    });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as listUsers } from "@/app/api/admin/users/route";
import { GET as getUser, PATCH as updateRole } from "@/app/api/admin/users/[userId]/route";
import { GET as getAssistant, PATCH as updateAssistant } from "@/app/api/admin/assistant/route";
import { GET as getStatistics } from "@/app/api/admin/statistics/route";
import { GET as getMe } from "@/app/api/users/me/route";
import { AuthGuard } from "@/server/auth/guards/auth.guard";
import { userService } from "@/server/services/user.service";
import { ConflictException } from "@/server/exceptions/conflict.exception";

const ADMIN = {
    id: "admin-id",
    email: "admin@dolcevita.com",
    name: "Chef Administrador",
    role: "ADMIN",
};
const USER = {
    id: "user-id",
    email: "user@dolcevita.com",
    name: "Usuario Gastrónomo",
    role: "USER",
};

// connection() needs a Next.js request scope; outside of it the handlers are tested directly.
vi.mock("next/server", async (importOriginal) => ({
    ...(await importOriginal<typeof import("next/server")>()),
    connection: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/server/auth/guards/auth.guard", () => ({
    AuthGuard: { authenticate: vi.fn() },
}));

vi.mock("@/server/services/user.service", async () => {
    const { updateRoleSchema } = await import("@/server/dto/user/update-role.dto");
    return {
        userService: {
            listUsers: vi
                .fn()
                .mockResolvedValue([{ id: "user-id", email: "user@dolcevita.com", role: "USER" }]),
            getUser: vi
                .fn()
                .mockResolvedValue({ id: "user-id", email: "user@dolcevita.com", role: "USER" }),
            updateRole: vi.fn(async (_actor: string, userId: string, body: unknown) => ({
                id: userId,
                role: updateRoleSchema.parse(body).role,
            })),
        },
    };
});

vi.mock("@/server/services/assistant.service", async () => {
    const { updateAssistantConfigSchema } =
        await import("@/server/dto/admin/update-assistant-config.dto");
    return {
        assistantService: {
            getAdminConfig: vi.fn().mockResolvedValue({ name: "George", temperature: 0.7 }),
            updateAdminConfig: vi.fn(async (body: unknown) => ({
                name: "George",
                ...updateAssistantConfigSchema.parse(body),
            })),
        },
    };
});

vi.mock("@/server/services/statistics.service", () => ({
    statisticsService: {
        getStatistics: vi.fn().mockResolvedValue({
            users: { total: 2 },
            conversations: { total: 3 },
            messages: { total: 6 },
        }),
    },
}));

const params = (userId: string) => ({ params: Promise.resolve({ userId }) });
const json = (url: string, method: string, body: unknown) =>
    new Request(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

describe("Admin API (API-012 to API-015)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("as USER", () => {
        beforeEach(() => vi.mocked(AuthGuard.authenticate).mockResolvedValue(USER));

        it("returns 403 FORBIDDEN on every administrative endpoint", async () => {
            const responses = await Promise.all([
                listUsers(new Request("http://localhost/api/admin/users")),
                getUser(new Request("http://localhost/api/admin/users/x"), params("x")),
                updateRole(
                    json("http://localhost/api/admin/users/x", "PATCH", { role: "ADMIN" }),
                    params("x"),
                ),
                getAssistant(new Request("http://localhost/api/admin/assistant")),
                updateAssistant(
                    json("http://localhost/api/admin/assistant", "PATCH", { temperature: 1 }),
                ),
                getStatistics(new Request("http://localhost/api/admin/statistics")),
            ]);

            for (const res of responses) {
                expect(res.status).toBe(403);
                expect((await res.json()).error.code).toBe("FORBIDDEN");
            }
            expect(userService.updateRole).not.toHaveBeenCalled();
        });

        it("reports the current role through /api/users/me", async () => {
            const res = await getMe(new Request("http://localhost/api/users/me"));
            expect((await res.json()).data.role).toBe("USER");
        });
    });

    describe("as ADMIN", () => {
        beforeEach(() => vi.mocked(AuthGuard.authenticate).mockResolvedValue(ADMIN));

        it("lists users", async () => {
            const res = await listUsers(new Request("http://localhost/api/admin/users"));
            expect(res.status).toBe(200);
            expect((await res.json()).data).toHaveLength(1);
        });

        it("updates a role and passes the acting admin id", async () => {
            const res = await updateRole(
                json("http://localhost/api/admin/users/user-id", "PATCH", { role: "ADMIN" }),
                params("user-id"),
            );
            expect(res.status).toBe(200);
            expect((await res.json()).data).toEqual({ id: "user-id", role: "ADMIN" });
            expect(userService.updateRole).toHaveBeenCalledWith("admin-id", "user-id", {
                role: "ADMIN",
            });
        });

        it("returns 400 VALIDATION_ERROR for an invalid role", async () => {
            const res = await updateRole(
                json("http://localhost/api/admin/users/user-id", "PATCH", { role: "ROOT" }),
                params("user-id"),
            );
            expect(res.status).toBe(400);
            expect((await res.json()).error.code).toBe("VALIDATION_ERROR");
        });

        it("returns 409 when a business rule blocks the change", async () => {
            vi.mocked(userService.updateRole).mockRejectedValueOnce(
                new ConflictException("No puedes cambiar tu propio rol"),
            );
            const res = await updateRole(
                json("http://localhost/api/admin/users/admin-id", "PATCH", { role: "USER" }),
                params("admin-id"),
            );
            expect(res.status).toBe(409);
        });

        it("reads and updates the assistant configuration", async () => {
            expect(
                (await getAssistant(new Request("http://localhost/api/admin/assistant"))).status,
            ).toBe(200);
            const res = await updateAssistant(
                json("http://localhost/api/admin/assistant", "PATCH", { temperature: 0.3 }),
            );
            expect(res.status).toBe(200);
            expect((await res.json()).data.temperature).toBe(0.3);
        });

        it("rejects assistant fields outside the schema", async () => {
            const res = await updateAssistant(
                json("http://localhost/api/admin/assistant", "PATCH", { apiKey: "sk-test" }),
            );
            expect(res.status).toBe(400);
        });

        it("returns aggregated statistics", async () => {
            const res = await getStatistics(new Request("http://localhost/api/admin/statistics"));
            expect(res.status).toBe(200);
            expect(Object.keys((await res.json()).data)).toEqual([
                "users",
                "conversations",
                "messages",
            ]);
        });
    });
});

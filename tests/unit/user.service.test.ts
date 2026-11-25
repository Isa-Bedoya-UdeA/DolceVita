import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "@/server/services/user.service";
import {
    AdminUserRecord,
    IUserRepository,
} from "@/server/domain/contracts/user-repository.contract";
import { Role } from "@/server/domain/enums/role.enum";
import { ConflictException } from "@/server/exceptions/conflict.exception";
import { NotFoundException } from "@/server/exceptions/not-found.exception";
import { ZodError } from "zod";

vi.mock("@/server/infrastructure/database/prisma", () => ({ prisma: {} }));

const user = (id: string, role: Role): AdminUserRecord => ({
    id,
    name: `Usuario ${id}`,
    email: `${id}@dolcevita.com`,
    role,
    createdAt: new Date("2026-11-01T12:00:00Z"),
    conversationCount: 2,
});

function makeRepo(records: AdminUserRecord[]): IUserRepository {
    return {
        findAllForAdmin: vi.fn().mockResolvedValue(records),
        findByIdForAdmin: vi.fn((id: string) =>
            Promise.resolve(records.find((r) => r.id === id) ?? null),
        ),
        updateRole: vi.fn((id: string, role: Role) => Promise.resolve({ id, role })),
        countByRole: vi.fn((role: Role) =>
            Promise.resolve(records.filter((r) => r.role === role).length),
        ),
        findByEmail: vi.fn().mockResolvedValue(null),
        createWithPassword: vi.fn(),
    };
}

describe("UserService (FR-019)", () => {
    let repo: IUserRepository;
    let service: UserService;

    beforeEach(() => {
        repo = makeRepo([
            user("admin", Role.ADMIN),
            user("ana", Role.USER),
            user("luis", Role.ADMIN),
        ]);
        service = new UserService(repo);
    });

    it("lists users with ISO dates and without sensitive fields", async () => {
        const users = await service.listUsers();
        expect(users).toHaveLength(3);
        expect(users[0]).toEqual({
            id: "admin",
            name: "Usuario admin",
            email: "admin@dolcevita.com",
            role: Role.ADMIN,
            createdAt: "2026-11-01T12:00:00.000Z",
            conversationCount: 2,
        });
        expect(users[0]).not.toHaveProperty("passwordHash");
    });

    it("throws NotFound when the user does not exist", async () => {
        await expect(service.getUser("nobody")).rejects.toBeInstanceOf(NotFoundException);
        await expect(
            service.updateRole("admin", "nobody", { role: "ADMIN" }),
        ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("promotes a user to ADMIN", async () => {
        const result = await service.updateRole("admin", "ana", { role: "ADMIN" });
        expect(result).toEqual({ id: "ana", role: Role.ADMIN });
        expect(repo.updateRole).toHaveBeenCalledWith("ana", Role.ADMIN);
    });

    it("is idempotent when the same role is submitted", async () => {
        const result = await service.updateRole("admin", "ana", { role: "USER" });
        expect(result).toEqual({ id: "ana", role: Role.USER });
        expect(repo.updateRole).not.toHaveBeenCalled();
    });

    it("prevents an administrator from changing their own role", async () => {
        await expect(service.updateRole("admin", "admin", { role: "USER" })).rejects.toBeInstanceOf(
            ConflictException,
        );
    });

    it("prevents demoting the last administrator", async () => {
        repo = makeRepo([user("admin", Role.ADMIN), user("luis", Role.ADMIN)]);
        repo.countByRole = vi.fn().mockResolvedValue(1);
        service = new UserService(repo);
        await expect(service.updateRole("admin", "luis", { role: "USER" })).rejects.toBeInstanceOf(
            ConflictException,
        );
    });

    it("rejects unsupported roles and extra fields", async () => {
        await expect(service.updateRole("admin", "ana", { role: "OWNER" })).rejects.toBeInstanceOf(
            ZodError,
        );
        await expect(
            service.updateRole("admin", "ana", { role: "ADMIN", email: "x@y.com" }),
        ).rejects.toBeInstanceOf(ZodError);
    });
});

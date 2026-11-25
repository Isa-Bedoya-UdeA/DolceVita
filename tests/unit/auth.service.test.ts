import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { AuthService } from "@/server/services/auth.service";
import { PasswordService, PASSWORD_SALT_ROUNDS } from "@/server/auth/password.service";
import { IUserRepository } from "@/server/domain/contracts/user-repository.contract";
import { Role } from "@/server/domain/enums/role.enum";
import { ConflictException } from "@/server/exceptions/conflict.exception";
import { makeAuthUser, VALID_PASSWORD } from "../fixtures/mock-users";

vi.mock("@/server/infrastructure/database/prisma", () => ({ prisma: {} }));

function makeRepo(overrides: Partial<IUserRepository> = {}): IUserRepository {
    return {
        findAllForAdmin: vi.fn(),
        findByIdForAdmin: vi.fn(),
        updateRole: vi.fn(),
        countByRole: vi.fn(),
        findByEmail: vi.fn().mockResolvedValue(null),
        createWithPassword: vi.fn(async (input) =>
            makeAuthUser({ id: "new-user", name: input.name, email: input.email }),
        ),
        ...overrides,
    };
}

describe("PasswordService (FR-001 / NFR-003)", () => {
    it("should hash password with bcrypt cost 10", async () => {
        const hash = await PasswordService.hash(VALID_PASSWORD);

        expect(hash).not.toBe(VALID_PASSWORD);
        expect(PASSWORD_SALT_ROUNDS).toBe(10);
        expect(bcrypt.getRounds(hash)).toBe(10);
    });

    it("should verify matching password credentials", async () => {
        const hash = await PasswordService.hash(VALID_PASSWORD);

        await expect(PasswordService.verify(VALID_PASSWORD, hash)).resolves.toBe(true);
        await expect(PasswordService.verify("Otra1234!", hash)).resolves.toBe(false);
    });

    it("returns false when the user has no password hash", async () => {
        await expect(PasswordService.verify(VALID_PASSWORD, null)).resolves.toBe(false);
    });
});

describe("AuthService.register (FR-001)", () => {
    let repo: IUserRepository;
    let service: AuthService;

    beforeEach(() => {
        repo = makeRepo();
        service = new AuthService(repo);
    });

    it("creates a USER with a hashed password and never returns the hash", async () => {
        const result = await service.register({
            name: "  Ana Chef ",
            email: "Ana@Correo.com",
            password: VALID_PASSWORD,
        });

        const input = vi.mocked(repo.createWithPassword).mock.calls[0][0];
        expect(input.name).toBe("Ana Chef");
        expect(input.email).toBe("ana@correo.com");
        expect(input.passwordHash).not.toBe(VALID_PASSWORD);
        await expect(bcrypt.compare(VALID_PASSWORD, input.passwordHash)).resolves.toBe(true);

        expect(result).toEqual({
            id: "new-user",
            name: "Ana Chef",
            email: "ana@correo.com",
            role: Role.USER,
        });
        expect(result).not.toHaveProperty("passwordHash");
    });

    it("rejects an email that is already registered", async () => {
        repo = makeRepo({ findByEmail: vi.fn().mockResolvedValue(makeAuthUser()) });
        service = new AuthService(repo);

        await expect(
            service.register({
                name: "Ana",
                email: "user@dolcevita.com",
                password: VALID_PASSWORD,
            }),
        ).rejects.toBeInstanceOf(ConflictException);
        expect(repo.createWithPassword).not.toHaveBeenCalled();
    });

    it.each([
        ["invalid email", { name: "Ana", email: "no-es-correo", password: VALID_PASSWORD }],
        ["weak password", { name: "Ana", email: "ana@correo.com", password: "12345678" }],
        ["short name", { name: "A", email: "ana@correo.com", password: VALID_PASSWORD }],
        [
            "role injection",
            { name: "Ana", email: "ana@correo.com", password: VALID_PASSWORD, role: "ADMIN" },
        ],
    ])("rejects %s", async (_label, payload) => {
        await expect(service.register(payload)).rejects.toBeInstanceOf(ZodError);
        expect(repo.createWithPassword).not.toHaveBeenCalled();
    });
});

describe("AuthService.verifyCredentials (FR-002)", () => {
    it("returns the session user for valid credentials", async () => {
        const passwordHash = await PasswordService.hash(VALID_PASSWORD);
        const service = new AuthService(
            makeRepo({
                findByEmail: vi
                    .fn()
                    .mockResolvedValue(makeAuthUser({ role: Role.ADMIN, passwordHash })),
            }),
        );

        const user = await service.verifyCredentials({
            email: "USER@dolcevita.com",
            password: VALID_PASSWORD,
        });

        expect(user).toEqual({
            id: "user-1",
            name: "Usuario Gastrónomo",
            email: "user@dolcevita.com",
            role: Role.ADMIN,
            image: null,
        });
        expect(user).not.toHaveProperty("passwordHash");
    });

    it("returns null for a wrong password", async () => {
        const passwordHash = await PasswordService.hash(VALID_PASSWORD);
        const service = new AuthService(
            makeRepo({ findByEmail: vi.fn().mockResolvedValue(makeAuthUser({ passwordHash })) }),
        );

        await expect(
            service.verifyCredentials({ email: "user@dolcevita.com", password: "Mala1234!" }),
        ).resolves.toBeNull();
    });

    it("returns null for an unknown email and for malformed input", async () => {
        const service = new AuthService(makeRepo());

        await expect(
            service.verifyCredentials({ email: "nadie@dolcevita.com", password: VALID_PASSWORD }),
        ).resolves.toBeNull();
        await expect(service.verifyCredentials({ email: "x" })).resolves.toBeNull();
        await expect(service.verifyCredentials(undefined)).resolves.toBeNull();
    });
});

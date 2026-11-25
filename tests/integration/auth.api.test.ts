import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as registerRoute } from "@/app/api/auth/register/route";
import { authService } from "@/server/services/auth.service";
import { userRepository } from "@/server/repositories/user.repository";
import { Role } from "@/server/domain/enums/role.enum";
import { makeAuthUser, VALID_PASSWORD } from "../fixtures/mock-users";

vi.mock("@/server/infrastructure/database/prisma", () => ({ prisma: {} }));

function postJson(body: unknown) {
    return new Request("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: typeof body === "string" ? body : JSON.stringify(body),
    });
}

describe("Auth API Integration (Feature/auth-and-security)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
        vi.spyOn(userRepository, "createWithPassword").mockImplementation(async (input) =>
            makeAuthUser({ id: "new-user", name: input.name, email: input.email }),
        );
    });

    it("should register a new user with valid credentials", async () => {
        const res = await registerRoute(
            postJson({ name: "Ana Chef", email: "ana@correo.com", password: VALID_PASSWORD }),
        );
        const json = await res.json();

        expect(res.status).toBe(201);
        expect(json.data).toEqual({
            id: "new-user",
            name: "Ana Chef",
            email: "ana@correo.com",
            role: Role.USER,
        });
        expect(JSON.stringify(json)).not.toContain(VALID_PASSWORD);
    });

    it("returns 409 when the email already exists", async () => {
        vi.spyOn(userRepository, "findByEmail").mockResolvedValue(makeAuthUser());

        const res = await registerRoute(
            postJson({ name: "Ana", email: "user@dolcevita.com", password: VALID_PASSWORD }),
        );

        expect(res.status).toBe(409);
        expect((await res.json()).error.code).toBe("CONFLICT");
    });

    it("returns 400 with field details for invalid data", async () => {
        const res = await registerRoute(postJson({ name: "Ana", email: "mal", password: "123" }));
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error.code).toBe("VALIDATION_ERROR");
        expect(json.error.details.map((d: { field: string }) => d.field)).toEqual(
            expect.arrayContaining(["email", "password"]),
        );
    });

    it("returns 400 for a body that is not JSON", async () => {
        const res = await registerRoute(postJson("{no json"));
        expect(res.status).toBe(400);
    });

    it("should authenticate user with the credentials used at registration", async () => {
        let stored = makeAuthUser();
        vi.spyOn(userRepository, "createWithPassword").mockImplementation(async (input) => {
            stored = makeAuthUser({ ...input, id: "new-user" });
            return stored;
        });

        await registerRoute(
            postJson({ name: "Ana Chef", email: "ana@correo.com", password: VALID_PASSWORD }),
        );
        vi.spyOn(userRepository, "findByEmail").mockResolvedValue(stored);

        await expect(
            authService.verifyCredentials({ email: "ana@correo.com", password: VALID_PASSWORD }),
        ).resolves.toMatchObject({ id: "new-user", role: Role.USER });
    });
});

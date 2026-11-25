import { prisma } from "../infrastructure/database/prisma";
import {
    AdminUserRecord,
    AuthUserRecord,
    CreateUserWithPasswordInput,
    IUserRepository,
} from "../domain/contracts/user-repository.contract";
import { Role } from "../domain/enums/role.enum";

const authUserSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    image: true,
    passwordHash: true,
} as const;

const adminUserSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    _count: { select: { conversations: true } },
} as const;

interface AdminUserRow {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    _count: { conversations: number };
}

function toRecord(row: AdminUserRow): AdminUserRecord {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role as Role,
        createdAt: row.createdAt,
        conversationCount: row._count.conversations,
    };
}

export class UserRepository implements IUserRepository {
    async findAllForAdmin(): Promise<AdminUserRecord[]> {
        const rows: AdminUserRow[] = await prisma.user.findMany({
            select: adminUserSelect,
            orderBy: { createdAt: "desc" },
        });
        return rows.map(toRecord);
    }

    async findByIdForAdmin(id: string): Promise<AdminUserRecord | null> {
        const row: AdminUserRow | null = await prisma.user.findUnique({
            where: { id },
            select: adminUserSelect,
        });
        return row ? toRecord(row) : null;
    }

    async updateRole(id: string, role: Role): Promise<{ id: string; role: Role }> {
        const updated = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, role: true },
        });
        return { id: updated.id, role: updated.role as Role };
    }

    async countByRole(role: Role): Promise<number> {
        return prisma.user.count({ where: { role } });
    }

    async findByEmail(email: string): Promise<AuthUserRecord | null> {
        const row = await prisma.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
            select: authUserSelect,
        });
        return row ? { ...row, role: row.role as Role } : null;
    }

    /** Registration always creates a USER; only an ADMIN can promote accounts later. */
    async createWithPassword(input: CreateUserWithPasswordInput): Promise<AuthUserRecord> {
        const row = await prisma.user.create({
            data: {
                name: input.name,
                email: input.email,
                passwordHash: input.passwordHash,
                role: Role.USER,
                accounts: {
                    create: {
                        type: "credentials",
                        provider: "credentials",
                        providerAccountId: input.email,
                    },
                },
            },
            select: authUserSelect,
        });
        return { ...row, role: row.role as Role };
    }
}

export const userRepository = new UserRepository();

import { prisma } from "../infrastructure/database/prisma";
import { AdminUserRecord, IUserRepository } from "../domain/contracts/user-repository.contract";
import { Role } from "../domain/enums/role.enum";

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
}

export const userRepository = new UserRepository();

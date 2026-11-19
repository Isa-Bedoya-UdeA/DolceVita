import { prisma } from "../infrastructure/database/prisma";
import {
    AssistantConfigCreate,
    AssistantConfigUpdate,
    IAssistantRepository,
} from "../domain/contracts/assistant-repository.contract";
import { AssistantConfigEntity } from "../domain/entities/assistant-config.entity";

export class AssistantRepository implements IAssistantRepository {
    async findActive(): Promise<AssistantConfigEntity | null> {
        return prisma.assistantConfig.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: "desc" },
        });
    }

    async findById(id: string): Promise<AssistantConfigEntity | null> {
        return prisma.assistantConfig.findUnique({ where: { id } });
    }

    async update(id: string, data: AssistantConfigUpdate): Promise<AssistantConfigEntity> {
        return prisma.assistantConfig.update({ where: { id }, data });
    }

    async create(data: AssistantConfigCreate): Promise<AssistantConfigEntity> {
        return prisma.assistantConfig.create({ data: { ...data, isActive: true } });
    }
}

export const assistantRepository = new AssistantRepository();

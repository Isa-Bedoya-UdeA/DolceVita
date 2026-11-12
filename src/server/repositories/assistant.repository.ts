import { prisma } from "../infrastructure/database/prisma";
import { IAssistantRepository } from "../domain/contracts/assistant-repository.contract";
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
}

export const assistantRepository = new AssistantRepository();

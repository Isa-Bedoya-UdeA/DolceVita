import { prisma } from "../infrastructure/database/prisma";
import { IMessageRepository } from "../domain/contracts/message-repository.contract";
import { messageRepository } from "../repositories/message.repository";
import { MessageEntity } from "../domain/entities/message.entity";
import { MessageRole } from "../domain/enums/message-role.enum";
import { MessageStatus } from "../domain/enums/message-status.enum";
import { MessageMapper } from "../mappers/message.mapper";
import { MessageResponseDto } from "../dto/message/message-response.dto";
import { updateMessageSchema } from "../dto/message/update-message.dto";
import { NotFoundException } from "../exceptions/not-found.exception";
import { ValidationException } from "../exceptions/validation.exception";
import { ConflictException } from "../exceptions/conflict.exception";
import { AIProviderService, aiProviderService } from "./ai-provider.service";

interface OwnedMessage {
    message: MessageEntity;
    history: MessageEntity[];
    index: number;
}

export class MessageService {
    constructor(
        private readonly messageRepo: IMessageRepository = messageRepository,
        private readonly aiService: AIProviderService = aiProviderService,
    ) {}

    /**
     * FR-013: edits a user message, discards every later turn that depended on it
     * and regenerates George's answer from the edited context.
     */
    async editUserMessage(
        messageId: string,
        userId: string,
        input: unknown,
    ): Promise<{ userMessage: MessageResponseDto; assistantMessage: MessageResponseDto }> {
        const { content } = updateMessageSchema.parse(input);
        const { message, history, index } = await this.findOwnedMessage(messageId, userId);

        if (message.role !== MessageRole.USER) {
            throw new ValidationException("Solo se pueden editar los mensajes del usuario");
        }

        const reply = await this.aiService.generateReply([
            ...history.slice(0, index),
            { ...message, content },
        ]);

        const laterIds = history.slice(index + 1).map((item) => item.id);

        const [, userRecord, , assistantRecord] = await prisma.$transaction([
            prisma.messageRevision.create({
                data: { messageId, previousContent: message.content },
            }),
            prisma.message.update({
                where: { id: messageId },
                data: { content, editedAt: new Date() },
            }),
            prisma.message.deleteMany({ where: { id: { in: laterIds } } }),
            prisma.message.create({
                data: {
                    conversationId: message.conversationId,
                    role: MessageRole.ASSISTANT,
                    content: reply.content,
                    status: MessageStatus.COMPLETED,
                    provider: reply.provider,
                    model: reply.model,
                },
            }),
            prisma.conversation.update({
                where: { id: message.conversationId },
                data: { updatedAt: new Date() },
            }),
        ]);

        return {
            userMessage: MessageMapper.toResponseDto(MessageMapper.toEntity(userRecord)),
            assistantMessage: MessageMapper.toResponseDto(MessageMapper.toEntity(assistantRecord)),
        };
    }

    /**
     * FR-014: replaces the latest assistant answer with a newly generated one,
     * using the same preceding context. Previous feedback no longer applies.
     */
    async retryAssistantMessage(
        messageId: string,
        userId: string,
    ): Promise<{ assistantMessage: MessageResponseDto }> {
        const { message, history, index } = await this.findOwnedMessage(messageId, userId);

        if (message.role !== MessageRole.ASSISTANT) {
            throw new ValidationException("Solo se pueden regenerar las respuestas del asistente");
        }

        if (index !== history.length - 1) {
            throw new ConflictException("Solo se puede regenerar la última respuesta de George");
        }

        const context = history.slice(0, index);
        if (!context.some((item) => item.role === MessageRole.USER)) {
            throw new ConflictException("No hay una pregunta previa para regenerar la respuesta");
        }

        const reply = await this.aiService.generateReply(context);

        const [, assistantRecord] = await prisma.$transaction([
            prisma.messageFeedback.deleteMany({ where: { messageId } }),
            prisma.message.update({
                where: { id: messageId },
                data: {
                    content: reply.content,
                    status: MessageStatus.COMPLETED,
                    provider: reply.provider,
                    model: reply.model,
                },
            }),
        ]);

        return {
            assistantMessage: MessageMapper.toResponseDto(MessageMapper.toEntity(assistantRecord)),
        };
    }

    /** Loads a message only if its conversation belongs to the user (404 otherwise). */
    async findOwnedMessage(messageId: string, userId: string): Promise<OwnedMessage> {
        const record = await prisma.message.findUnique({
            where: { id: messageId },
            include: { conversation: { select: { userId: true } } },
        });

        if (!record || record.conversation.userId !== userId) {
            throw new NotFoundException("El mensaje no existe o no está disponible");
        }

        const history = await this.messageRepo.findByConversationId(record.conversationId);
        const index = history.findIndex((item) => item.id === messageId);

        return { message: MessageMapper.toEntity(record), history, index };
    }
}

export const messageService = new MessageService();

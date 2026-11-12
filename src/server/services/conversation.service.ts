import { prisma } from "../infrastructure/database/prisma";
import { IConversationRepository } from "../domain/contracts/conversation-repository.contract";
import { conversationRepository } from "../repositories/conversation.repository";
import { IMessageRepository } from "../domain/contracts/message-repository.contract";
import { messageRepository } from "../repositories/message.repository";
import { ConversationMapper } from "../mappers/conversation.mapper";
import { MessageMapper } from "../mappers/message.mapper";
import {
    CreateConversationDto,
    ConversationResponseDto,
    createConversationSchema,
} from "../dto/conversations/create-conversation.dto";
import {
    UpdateConversationDto,
    updateConversationSchema,
} from "../dto/conversations/update-conversation.dto";
import { MessageResponseDto } from "../dto/message/message-response.dto";
import { NotFoundException } from "../exceptions/not-found.exception";
import { ValidationException } from "../exceptions/validation.exception";
import { ZodError } from "zod";
import { OwnershipGuard } from "../auth/guards/ownership.guard";
import { MessageRole } from "../domain/enums/message-role.enum";
import { MessageStatus } from "../domain/enums/message-status.enum";
import { AIProviderService, aiProviderService } from "./ai-provider.service";
import { IFeedbackRepository, feedbackRepository } from "../repositories/feedback.repository";

export class ConversationService {
    constructor(
        private readonly conversationRepo: IConversationRepository = conversationRepository,
        private readonly messageRepo: IMessageRepository = messageRepository,
        private readonly aiService: AIProviderService = aiProviderService,
        private readonly feedbackRepo: IFeedbackRepository = feedbackRepository,
    ) {}

    async listConversations(userId: string): Promise<ConversationResponseDto[]> {
        const conversations = await this.conversationRepo.findByUserId(userId);

        if (conversations.length === 0) {
            const all = await prisma.conversation.findMany({
                orderBy: { updatedAt: "desc" },
            });
            if (all.length > 0) {
                return ConversationMapper.toResponseDtoList(
                    all.map((c) => ConversationMapper.toEntity(c)),
                );
            }
        }

        return ConversationMapper.toResponseDtoList(conversations);
    }

    async createConversation(
        userId: string,
        dto?: CreateConversationDto,
    ): Promise<ConversationResponseDto> {
        let validatedDto: CreateConversationDto = {};
        if (dto) {
            const parseResult = createConversationSchema.safeParse(dto);
            if (!parseResult.success) {
                const message = parseResult.error.issues[0]?.message || "Validation failed";
                throw new ValidationException(message);
            }
            validatedDto = parseResult.data;
        }

        const title = validatedDto.title?.trim() || "New conversation";

        // Fetch active assistant config (George) to link conversation
        const activeAssistant = await prisma.assistantConfig.findFirst({
            where: { isActive: true },
            select: { id: true },
        });

        const created = await this.conversationRepo.create({
            userId,
            title,
            assistantConfigId: activeAssistant?.id ?? null,
        });

        return ConversationMapper.toResponseDto(created);
    }

    async getConversation(id: string, userId: string): Promise<ConversationResponseDto> {
        const conversation = await this.conversationRepo.findById(id);

        if (!conversation) {
            throw new NotFoundException(`Conversation ${id} does not exist`);
        }

        return ConversationMapper.toResponseDto(conversation);
    }

    async renameConversation(
        id: string,
        userId: string,
        data: unknown,
    ): Promise<ConversationResponseDto> {
        let validatedDto: UpdateConversationDto;

        try {
            validatedDto = updateConversationSchema.parse(data);
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }));
                throw new ValidationException("The request contains invalid fields.", details);
            }
            throw new ValidationException("Invalid conversation title");
        }

        const conversation = await this.conversationRepo.findById(id);

        if (!conversation) {
            throw new NotFoundException(`Conversation ${id} does not exist`);
        }

        const updated = await this.conversationRepo.updateTitle(id, validatedDto.title);

        return ConversationMapper.toResponseDto(updated);
    }

    async deleteConversation(id: string, userId: string): Promise<void> {
        const conversation = await this.conversationRepo.findById(id);

        if (!conversation) {
            throw new NotFoundException(`Conversation ${id} does not exist`);
        }

        await this.conversationRepo.delete(id);
    }

    async getConversationMessages(
        conversationId: string,
        userId: string,
    ): Promise<MessageResponseDto[]> {
        const conversation = await this.conversationRepo.findById(conversationId);

        if (!conversation) {
            throw new NotFoundException(`Conversation ${conversationId} does not exist`);
        }

        const messages = await this.messageRepo.findByConversationId(conversationId);
        const ratings = await this.feedbackRepo.findRatingsByUser(
            messages.map((message) => message.id),
            userId,
        );

        return MessageMapper.toResponseDtoList(messages).map((message) => ({
            ...message,
            rating: ratings.get(message.id) ?? null,
        }));
    }

    async addMessage(
        conversationId: string,
        userId: string,
        content: string,
    ): Promise<{ userMessage: MessageResponseDto; assistantMessage: MessageResponseDto }> {
        const conversation = await this.conversationRepo.findById(conversationId);

        if (!conversation) {
            throw new NotFoundException(`Conversation ${conversationId} does not exist`);
        }

        OwnershipGuard.verify(conversation.userId, userId);

        const trimmed = content.trim();
        if (!trimmed) {
            throw new ValidationException("Message content cannot be empty");
        }

        // 1. Generate George's reply from the stored history plus the new question.
        //    Nothing is persisted if every AI provider fails.
        const sentAt = new Date();
        const history = await this.messageRepo.findByConversationId(conversationId);
        const reply = await this.aiService.generateReply([
            ...history,
            { role: MessageRole.USER, status: MessageStatus.COMPLETED, content: trimmed },
        ]);

        // 2. Persist both messages atomically
        const [userRecord, assistantRecord] = await prisma.$transaction([
            prisma.message.create({
                data: {
                    conversationId,
                    senderId: userId,
                    role: MessageRole.USER,
                    content: trimmed,
                    status: MessageStatus.COMPLETED,
                    createdAt: sentAt,
                },
            }),
            prisma.message.create({
                data: {
                    conversationId,
                    role: MessageRole.ASSISTANT,
                    content: reply.content,
                    status: MessageStatus.COMPLETED,
                    provider: reply.provider,
                    model: reply.model,
                },
            }),
        ]);

        // 3. Update conversation title if default, and bump updatedAt
        const newTitle =
            conversation.title === "Nueva conversación" || conversation.title === "New conversation"
                ? trimmed.length > 45
                    ? `${trimmed.slice(0, 42)}...`
                    : trimmed
                : conversation.title;

        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                title: newTitle,
                updatedAt: new Date(),
            },
        });

        return {
            userMessage: MessageMapper.toResponseDto(MessageMapper.toEntity(userRecord)),
            assistantMessage: MessageMapper.toResponseDto(MessageMapper.toEntity(assistantRecord)),
        };
    }
}

export const conversationService = new ConversationService();

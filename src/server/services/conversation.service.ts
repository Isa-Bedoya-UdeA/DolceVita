import { prisma } from "../infrastructure/database/prisma";
import { MessageStatus } from "@prisma/client";
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

export class ConversationService {
    constructor(
        private readonly conversationRepo: IConversationRepository = conversationRepository,
        private readonly messageRepo: IMessageRepository = messageRepository,
    ) {}

    async listConversations(userId: string): Promise<ConversationResponseDto[]> {
        let conversations = await this.conversationRepo.findByUserId(userId);

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
        return MessageMapper.toResponseDtoList(messages);
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

        const trimmed = content.trim();
        if (!trimmed) {
            throw new ValidationException("Message content cannot be empty");
        }

        // 1. Create user message in DB
        const userRecord = await prisma.message.create({
            data: {
                conversationId,
                senderId: userId,
                role: "USER",
                content: trimmed,
                status: MessageStatus.COMPLETED,
            },
        });

        // 2. Generate Chef George's response
        const assistantContent = this.generateChefGeorgeResponse(trimmed);

        // 3. Create assistant message in DB
        const assistantRecord = await prisma.message.create({
            data: {
                conversationId,
                role: "ASSISTANT",
                content: assistantContent,
                status: MessageStatus.COMPLETED,
                model: "George-Culinary-v1.0",
            },
        });

        // 4. Update conversation title if default, and bump updatedAt
        const newTitle =
            conversation.title === "Nueva conversación" ||
            conversation.title === "New conversation"
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

    private generateChefGeorgeResponse(query: string): string {
        const q = query.toLowerCase();

        if (q.includes("risotto")) {
            return `### Risotto Cremoso de Hongos y Parmigiano Reggiano

**Perfil:** Terroso, untuoso y con profundo umami lácteo.

#### Ingredientes (4 porciones)
* 320g de arroz Carnaroli o Arborio
* 300g de hongos variados (Portobello, París o Shiitake frescos)
* 1 chalota picada en brunoise fino
* 100ml de vino blanco seco de buena acidez
* 1.2L de fondo claro de ave o verduras (a punto de hervor)
* 60g de mantequilla sin sal fría en cubos
* 70g de Parmigiano Reggiano DOP rallado al momento
* Sal marina y pimienta negra recién molida

#### Metodología Paso a Paso
1. **Tostatura:** En una cacerola de fondo grueso, sofríe la chalota con un hilo de aceite de oliva virgen extra. Agrega el arroz y tuéstalo a fuego medio por 2-3 minutos hasta que los granos estén nacarados.
2. **Sfumatura:** Desglasa con el vino blanco seco y deja evaporar completamente el alcohol.
3. **Cottura:** Añade el caldo hirviendo cucharón a cucharón, removiendo constantemente para favorecer la liberación de amilopectina. Incorpora los hongos previamente salteados al minuto 10. Cocción total: 16-18 minutos al dente.
4. **Mantecatura (Crucial):** Retira del fuego. Deja reposar 1 minuto. Añade la mantequilla fría y el parmesano. Emulsiona enérgicamente con movimientos circulares hasta lograr la clásica textura *all'onda*.

> *"El secreto del risotto está en la temperatura del caldo: si se enfría, se corta la cocción del grano."* — Chef George

#### Maridaje Recomendado
Un vino blanco estructurado como un **Pinot Grigio del Friuli** o un **Chardonnay con leve paso por barrica**.`;
        }

        if (q.includes("holandesa") || q.includes("salsa")) {
            return `### Salsa Holandesa Clásica

**Perfil:** Emulsión tibia aterciopelada con balance de mantequilla avellanada y toque cítrico.

#### Ingredientes
* 3 yemas de huevo fresco de corral
* 200g de mantequilla clarificada tibia (50°C-55°C)
* 15ml de zumo de limón fresco
* 15ml de reducción de vino blanco con pimienta en grano
* Pizca de sal marina fina y cayena

#### Metodología Paso a Paso
1. **Sabayón:** En un bol sobre baño maría a fuego suave (sin que el agua toque el bol), bate enérgicamente las yemas con la reducción ácida hasta lograr una espuma densa y cremosa que forme cintas al levantar la varilla.
2. **Emulsión:** Retira momentáneamente del fuego y vierte la mantequilla clarificada tibia en un hilo muy fino sin dejar de batir.
3. **Sazón:** Incorpora el zumo de limón, sal marina y el toque de pimienta cayena.

> **Consejo del Chef:** Si la salsa comienza a separarse por exceso de calor, añade una cucharadita de agua con hielo y bate con vigor fuera del fuego.`;
        }

        if (q.includes("maridaje") || q.includes("vino") || q.includes("salmón") || q.includes("salmon")) {
            return `### Maridaje Gourmet para Salmón a las Finas Hierbas

**Análisis de grasa y perfil:** El salmón es un pescado graso de textura untuosa; las finas hierbas (eneldo, perifollo, cebollino) aportan frescura y notas anisadas/clorofílicas.

#### Vinos Ideales
1. **Sauvignon Blanc del Valle del Loira (Sancerre / Pouilly-Fumé):**
   * *Razón:* Su acidez punzante corta la untuosidad del salmón y sus notas herbáceas hacen eco perfecto con el eneldo y el cebollino.
2. **Chardonnay de clima frío sin roble (Chablis):**
   * *Razón:* Mineralidad calcárea y frescura cítrica que respeta la delicadeza del pescado.
3. **Pinot Noir ligero (Borgoña o Patagonia):**
   * *Razón:* Si prefieres tinto, un Pinot Noir servido a 14°C con taninos suaves y frutos rojos frescos armoniza de maravilla sin oxidar las grasas omega-3.`;
        }

        return `### Consulta Culinaria: "${query}"

Como Chef George, aquí tienes las directrices profesionales para abordar esta preparación:

#### Pilares de Ejecución
1. **Mise en Place:** Organiza y pesa cada ingrediente antes de encender el fuego. La precisión marca la frontera entre un plato casual y la alta cocina.
2. **Reacción de Maillard:** Si buscas dorado y notas caramelizadas, seca muy bien la superficie del alimento antes del contacto con la sartén caliente.
3. **Armonía y Balance:** Toda receta necesita un contrapunto: equilibra la sal, añade acidez para aligerar la grasa y cuida los tiempos de reposo para redistribuir los jugos internos.

> *"La buena cocina es la base de la verdadera felicidad."* — Auguste Escoffier

¿Deseas que preparemos las cantidades exactas de los ingredientes o prefieres profundizar en alguna técnica de cocción?`;
    }
}

export const conversationService = new ConversationService();

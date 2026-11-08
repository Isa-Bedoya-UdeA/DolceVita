import { NextResponse } from "next/server";
import { ConversationService, conversationService } from "../services/conversation.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { AppException } from "../exceptions/app.exception";
import { ApiErrorResponse, ApiResponse } from "../types/api-response.type";
import { ConversationResponseDto } from "../dto/conversations/create-conversation.dto";
import { MessageResponseDto } from "../dto/message/message-response.dto";

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Conversation management and messaging retrieval endpoints
 */
export class ConversationController {
    constructor(private readonly service: ConversationService = conversationService) {}

    /**
     * @swagger
     * /api/conversations:
     *   get:
     *     summary: List all conversations for the authenticated user
     *     description: Retrieves the authenticated user's conversations ordered by most recently updated first.
     *     tags: [Conversations]
     *     responses:
     *       200:
     *         description: List of conversations retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/ConversationResponse'
     *       401:
     *         description: Unauthorized - No valid session
     *       500:
     *         description: Internal Server Error - Retrieval failed
     */
    async list(
        req: Request,
    ): Promise<NextResponse<ApiResponse<ConversationResponseDto[]> | ApiErrorResponse>> {
        try {
            const user = await AuthGuard.authenticate(req);
            const conversations = await this.service.listConversations(user.id);

            return NextResponse.json({ data: conversations }, { status: 200 });
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * @swagger
     * /api/conversations:
     *   post:
     *     summary: Create a new conversation
     *     description: Creates a new conversation thread associated with the authenticated user and George.
     *     tags: [Conversations]
     *     requestBody:
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 example: "Receta de Risotto de Hongos"
     *     responses:
     *       201:
     *         description: Conversation created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/ConversationResponse'
     *       401:
     *         description: Unauthorized - No valid session
     *       500:
     *         description: Internal Server Error - Creation failed
     */
    async create(
        req: Request,
    ): Promise<NextResponse<ApiResponse<ConversationResponseDto> | ApiErrorResponse>> {
        try {
            const user = await AuthGuard.authenticate(req);

            let body = undefined;
            try {
                const text = await req.text();
                if (text && text.trim().length > 0) {
                    body = JSON.parse(text);
                }
            } catch {
                // If body is empty or invalid JSON without content, body remains undefined
            }

            const conversation = await this.service.createConversation(user.id, body);

            return NextResponse.json({ data: conversation }, { status: 201 });
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * @swagger
     * /api/conversations/{conversationId}:
     *   get:
     *     summary: Retrieve a single conversation
     *     description: Returns detailed metadata for a conversation owned by the authenticated user.
     *     tags: [Conversations]
     *     parameters:
     *       - in: path
     *         name: conversationId
     *         required: true
     *         schema:
     *           type: string
     *         description: Unique conversation identifier
     *     responses:
     *       200:
     *         description: Conversation retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/ConversationResponse'
     *       401:
     *         description: Unauthorized - No valid session
     *       404:
     *         description: Not Found - Conversation does not exist or is not accessible
     *       500:
     *         description: Internal Server Error - Retrieval failed
     */
    async getById(
        req: Request,
        id: string,
    ): Promise<NextResponse<ApiResponse<ConversationResponseDto> | ApiErrorResponse>> {
        try {
            const user = await AuthGuard.authenticate(req);
            const conversation = await this.service.getConversation(id, user.id);

            return NextResponse.json({ data: conversation }, { status: 200 });
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * @swagger
     * /api/conversations/{conversationId}:
     *   patch:
     *     summary: Rename a conversation
     *     description: Updates the title of an existing conversation owned by the authenticated user.
     *     tags: [Conversations]
     *     parameters:
     *       - in: path
     *         name: conversationId
     *         required: true
     *         schema:
     *           type: string
     *         description: Unique conversation identifier
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [title]
     *             properties:
     *               title:
     *                 type: string
     *                 example: "Técnicas de Pasta Fresca"
     *     responses:
     *       200:
     *         description: Conversation title updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/ConversationResponse'
     *       400:
     *         description: Validation Error - Missing or invalid title
     *       401:
     *         description: Unauthorized - No valid session
     *       404:
     *         description: Not Found - Conversation does not exist or is not accessible
     *       500:
     *         description: Internal Server Error - Update failed
     */
    async rename(
        req: Request,
        id: string,
    ): Promise<NextResponse<ApiResponse<ConversationResponseDto> | ApiErrorResponse>> {
        try {
            const user = await AuthGuard.authenticate(req);
            const body = await req.json().catch(() => ({}));
            const updated = await this.service.renameConversation(id, user.id, body);

            return NextResponse.json({ data: updated }, { status: 200 });
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * @swagger
     * /api/conversations/{conversationId}:
     *   delete:
     *     summary: Delete a conversation
     *     description: Deletes an existing conversation and its associated messages.
     *     tags: [Conversations]
     *     parameters:
     *       - in: path
     *         name: conversationId
     *         required: true
     *         schema:
     *           type: string
     *         description: Unique conversation identifier
     *     responses:
     *       204:
     *         description: Conversation deleted successfully (No Content)
     *       401:
     *         description: Unauthorized - No valid session
     *       404:
     *         description: Not Found - Conversation does not exist or is not accessible
     *       500:
     *         description: Internal Server Error - Deletion failed
     */
    async delete(req: Request, id: string): Promise<NextResponse | NextResponse<ApiErrorResponse>> {
        try {
            const user = await AuthGuard.authenticate(req);
            await this.service.deleteConversation(id, user.id);

            return new NextResponse(null, { status: 204 });
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * @swagger
     * /api/conversations/{conversationId}/messages:
     *   get:
     *     summary: Retrieve messages for a conversation
     *     description: Returns the chronological message history for a conversation owned by the authenticated user.
     *     tags: [Conversations]
     *     parameters:
     *       - in: path
     *         name: conversationId
     *         required: true
     *         schema:
     *           type: string
     *         description: Unique conversation identifier
     *     responses:
     *       200:
     *         description: List of conversation messages in chronological order
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/MessageResponse'
     *       401:
     *         description: Unauthorized - No valid session
     *       404:
     *         description: Not Found - Conversation does not exist or is not accessible
     *       500:
     *         description: Internal Server Error - Retrieval failed
     */
    async getMessages(
        req: Request,
        id: string,
    ): Promise<NextResponse<ApiResponse<MessageResponseDto[]> | ApiErrorResponse>> {
        try {
            const user = await AuthGuard.authenticate(req);
            const messages = await this.service.getConversationMessages(id, user.id);

            return NextResponse.json({ data: messages }, { status: 200 });
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * @swagger
     * /api/conversations/{conversationId}/messages:
     *   post:
     *     summary: Send a message in a conversation
     *     description: Appends a user message to the conversation and generates George's gastronomic response.
     *     tags: [Conversations]
     *     parameters:
     *       - in: path
     *         name: conversationId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [content]
     *             properties:
     *               content:
     *                 type: string
     *     responses:
     *       201:
     *         description: Message sent and assistant responded
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Conversation not found
     */
    async addMessage(
        req: Request,
        id: string,
    ): Promise<
        NextResponse<
            | ApiResponse<{ userMessage: MessageResponseDto; assistantMessage: MessageResponseDto }>
            | ApiErrorResponse
        >
    > {
        try {
            const user = await AuthGuard.authenticate(req);
            const body = await req.json().catch(() => ({}));
            const content = body?.content || "";

            const result = await this.service.addMessage(id, user.id, content);
            return NextResponse.json({ data: result }, { status: 201 });
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleError(error: unknown): NextResponse<ApiErrorResponse> {
        if (error instanceof AppException) {
            return NextResponse.json(
                {
                    error: {
                        code: error.code,
                        message: error.message,
                        ...(error.details ? { details: error.details } : {}),
                    },
                },
                { status: error.statusCode },
            );
        }

        console.error("[ConversationController Unexpected Error]:", error);

        return NextResponse.json(
            {
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An unexpected error occurred while processing the request",
                },
            },
            { status: 500 },
        );
    }
}

export const conversationController = new ConversationController();

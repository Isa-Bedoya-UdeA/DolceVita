import { MessageRole } from "../domain/enums/message-role.enum";
import { createFeedbackSchema, FeedbackRatingValue } from "../dto/feedback/create-feedback.dto";
import { ValidationException } from "../exceptions/validation.exception";
import { IFeedbackRepository, feedbackRepository } from "../repositories/feedback.repository";
import { MessageService, messageService } from "./message.service";

export class FeedbackService {
    constructor(
        private readonly feedbackRepo: IFeedbackRepository = feedbackRepository,
        private readonly messages: MessageService = messageService,
    ) {}

    /** FR-015: stores or updates the user's rating for one of George's answers. */
    async submit(
        messageId: string,
        userId: string,
        input: unknown,
    ): Promise<{ messageId: string; rating: FeedbackRatingValue }> {
        const { rating } = createFeedbackSchema.parse(input);
        const { message } = await this.messages.findOwnedMessage(messageId, userId);

        if (message.role !== MessageRole.ASSISTANT) {
            throw new ValidationException("Solo se pueden calificar las respuestas del asistente");
        }

        await this.feedbackRepo.upsert(messageId, userId, rating);
        return { messageId, rating };
    }

    async getRatings(
        messageIds: string[],
        userId: string,
    ): Promise<Map<string, FeedbackRatingValue>> {
        return this.feedbackRepo.findRatingsByUser(messageIds, userId);
    }
}

export const feedbackService = new FeedbackService();

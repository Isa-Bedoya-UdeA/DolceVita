import { FeedbackRating } from "@prisma/client";
import { prisma } from "../infrastructure/database/prisma";
import { FeedbackRatingValue } from "../dto/feedback/create-feedback.dto";

const toDbRating = (rating: FeedbackRatingValue): FeedbackRating =>
    rating === "positive" ? FeedbackRating.POSITIVE : FeedbackRating.NEGATIVE;

const fromDbRating = (rating: FeedbackRating): FeedbackRatingValue =>
    rating === FeedbackRating.POSITIVE ? "positive" : "negative";

export interface IFeedbackRepository {
    upsert(messageId: string, userId: string, rating: FeedbackRatingValue): Promise<void>;
    findRatingsByUser(
        messageIds: string[],
        userId: string,
    ): Promise<Map<string, FeedbackRatingValue>>;
}

export class FeedbackRepository implements IFeedbackRepository {
    async upsert(messageId: string, userId: string, rating: FeedbackRatingValue): Promise<void> {
        await prisma.messageFeedback.upsert({
            where: { messageId_userId: { messageId, userId } },
            create: { messageId, userId, rating: toDbRating(rating) },
            update: { rating: toDbRating(rating) },
        });
    }

    async findRatingsByUser(
        messageIds: string[],
        userId: string,
    ): Promise<Map<string, FeedbackRatingValue>> {
        if (messageIds.length === 0) return new Map();

        const records = await prisma.messageFeedback.findMany({
            where: { userId, messageId: { in: messageIds } },
            select: { messageId: true, rating: true },
        });

        return new Map(records.map((record) => [record.messageId, fromDbRating(record.rating)]));
    }
}

export const feedbackRepository = new FeedbackRepository();

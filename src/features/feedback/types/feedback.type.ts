export type FeedbackRating = "positive" | "negative";

export interface FeedbackResult {
    messageId: string;
    rating: FeedbackRating;
}

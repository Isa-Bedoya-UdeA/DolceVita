import { z } from "zod";

export const createFeedbackSchema = z.object({
    rating: z.enum(["positive", "negative"], {
        error: "La calificación debe ser 'positive' o 'negative'",
    }),
});

export type CreateFeedbackDto = z.infer<typeof createFeedbackSchema>;
export type FeedbackRatingValue = CreateFeedbackDto["rating"];

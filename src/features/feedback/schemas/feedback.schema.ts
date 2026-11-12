import { z } from "zod";

export const feedbackSchema = z.object({
    rating: z.enum(["positive", "negative"]),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

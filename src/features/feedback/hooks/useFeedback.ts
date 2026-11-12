"use client";

import { useCallback, useState } from "react";
import { apiRequest } from "@/lib/api/api-client";
import { endpoints } from "@/lib/api/endpoints";
import { FeedbackRating, FeedbackResult } from "../types/feedback.type";

export function submitFeedback(messageId: string, rating: FeedbackRating) {
    return apiRequest<FeedbackResult>(endpoints.messageFeedback(messageId), {
        method: "POST",
        body: JSON.stringify({ rating }),
    });
}

export function useFeedback() {
    const [pendingId, setPendingId] = useState<string | null>(null);

    const sendFeedback = useCallback(async (messageId: string, rating: FeedbackRating) => {
        setPendingId(messageId);
        try {
            return await submitFeedback(messageId, rating);
        } finally {
            setPendingId(null);
        }
    }, []);

    return { sendFeedback, pendingId };
}

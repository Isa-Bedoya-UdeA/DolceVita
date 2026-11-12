"use client";

import { FeedbackButton } from "@/features/feedback/components/FeedbackButton";
import { MessageRating } from "../types/message.type";

interface MessageFeedbackProps {
    rating?: MessageRating | null;
    disabled?: boolean;
    onRate: (rating: MessageRating) => void;
}

export function MessageFeedback({ rating = null, disabled = false, onRate }: MessageFeedbackProps) {
    return (
        <div className="flex items-center" role="group" aria-label="Calificar respuesta">
            <FeedbackButton
                rating="positive"
                active={rating === "positive"}
                disabled={disabled}
                onClick={onRate}
            />
            <FeedbackButton
                rating="negative"
                active={rating === "negative"}
                disabled={disabled}
                onClick={onRate}
            />
        </div>
    );
}

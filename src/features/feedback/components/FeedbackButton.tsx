"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FeedbackRating } from "../types/feedback.type";

interface FeedbackButtonProps {
    rating: FeedbackRating;
    active: boolean;
    disabled?: boolean;
    onClick: (rating: FeedbackRating) => void;
}

export function FeedbackButton({ rating, active, disabled = false, onClick }: FeedbackButtonProps) {
    const Icon = rating === "positive" ? ThumbsUp : ThumbsDown;
    const label = rating === "positive" ? "Respuesta útil" : "Respuesta poco útil";

    return (
        <button
            type="button"
            onClick={() => onClick(rating)}
            disabled={disabled}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={`hover:bg-surface-muted inline-flex items-center rounded px-1.5 py-0.5 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                active ? "text-brand-primary" : "hover:text-text-primary"
            }`}
        >
            <Icon className={`h-3 w-3 ${active ? "fill-current" : ""}`} />
        </button>
    );
}

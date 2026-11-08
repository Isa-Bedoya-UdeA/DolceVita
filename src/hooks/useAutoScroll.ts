"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseAutoScrollOptions {
    threshold?: number;
    smooth?: boolean;
}

export function useAutoScroll<T extends HTMLElement = HTMLDivElement>(
    dependencies: unknown[] = [],
    options: UseAutoScrollOptions = {}
) {
    const { threshold = 120, smooth = true } = options;
    const containerRef = useRef<T | null>(null);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

    const scrollToBottom = useCallback(
        (forceSmooth = smooth) => {
            const container = containerRef.current;
            if (!container) return;

            container.scrollTo({
                top: container.scrollHeight,
                behavior: forceSmooth ? "smooth" : "auto",
            });
        },
        [smooth]
    );

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        setIsAtBottom(distanceFromBottom <= threshold);
    }, [threshold]);

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return {
        containerRef,
        isAtBottom,
        scrollToBottom,
        handleScroll,
    };
}

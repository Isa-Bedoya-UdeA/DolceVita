"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UseCopyToClipboardOptions {
    timeout?: number;
    successMessage?: string;
    errorMessage?: string;
}

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}) {
    const {
        timeout = 2000,
        successMessage = "Copiado al portapapeles",
        errorMessage = "Error al copiar al portapapeles",
    } = options;

    const [isCopied, setIsCopied] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const copy = useCallback(
        async (text: string): Promise<boolean> => {
            if (!navigator?.clipboard) {
                toast.error(errorMessage);
                return false;
            }

            try {
                await navigator.clipboard.writeText(text);
                setIsCopied(true);
                toast.success(successMessage);

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    setIsCopied(false);
                }, timeout);

                return true;
            } catch (err) {
                console.error("Clipboard copy error:", err);
                toast.error(errorMessage);
                setIsCopied(false);
                return false;
            }
        },
        [timeout, successMessage, errorMessage]
    );

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { isCopied, copy };
}

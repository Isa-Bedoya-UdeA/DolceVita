interface AdminPageHeaderProps {
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-text-primary font-serif text-2xl font-bold md:text-3xl">
                    {title}
                </h1>
                <p className="text-text-secondary text-sm">{description}</p>
            </div>
            {action}
        </div>
    );
}

export function AdminErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="border-error-border bg-error rounded-2xl border p-6 text-center">
            <p className="text-error-foreground text-sm font-medium">{message}</p>
            <button
                type="button"
                onClick={onRetry}
                className="border-error-border text-error-foreground hover:bg-surface mt-3 rounded-xl border px-4 py-2 text-xs font-semibold transition"
            >
                Reintentar
            </button>
        </div>
    );
}

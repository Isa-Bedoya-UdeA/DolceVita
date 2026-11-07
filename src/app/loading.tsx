import { Loader2, UtensilsCrossed } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
            <div className="relative flex items-center justify-center">
                <div className="bg-brand-primary/10 text-brand-primary flex h-16 w-16 items-center justify-center rounded-full">
                    <UtensilsCrossed className="h-8 w-8 animate-pulse" />
                </div>
                <Loader2 className="text-brand-primary absolute -inset-2 h-20 w-20 animate-spin opacity-40" />
            </div>
            <h2 className="font-heading text-text-primary mt-6 text-xl font-semibold">
                Preparando la mise en place...
            </h2>
            <p className="text-text-secondary mt-2 text-sm">
                George está afinando los detalles de tu experiencia gastronómica.
            </p>
        </div>
    );
}

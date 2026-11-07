import Link from "next/link";
import { ChefHat, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
            <div className="bg-brand-primary/10 text-brand-primary shadow-elevation-1 flex h-20 w-20 items-center justify-center rounded-2xl">
                <ChefHat className="h-10 w-10" />
            </div>
            <span className="bg-surface-muted text-text-secondary mt-6 rounded-full px-3 py-1 font-mono text-xs font-semibold tracking-wider uppercase">
                Error 404
            </span>
            <h1 className="font-heading text-text-primary mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Plato no encontrado en nuestra carta
            </h1>
            <p className="text-text-secondary mt-3 max-w-md text-base">
                La receta o página que intentas visitar no existe o fue retirada del menú por el
                chef George.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                    href="/"
                    className="bg-brand-primary text-text-inverse shadow-elevation-1 duration-normal hover:bg-brand-primary-hover focus:ring-brand-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a la cocina principal
                </Link>
            </div>
        </main>
    );
}

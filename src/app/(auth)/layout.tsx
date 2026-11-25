import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChefHat, Sparkles, Wine } from "lucide-react";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";

const HIGHLIGHTS = [
    { icon: ChefHat, text: "Recetas con gramajes exactos y técnica paso a paso" },
    { icon: Wine, text: "Maridajes y sustituciones de ingredientes al instante" },
    { icon: Sparkles, text: "Tu historial de conversaciones, siempre a mano" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
            {/* Brand panel (desktop) */}
            <aside className="bg-brand-primary text-text-inverse relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
                <div
                    aria-hidden="true"
                    className="bg-brand-accent/30 absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="bg-brand-secondary/30 absolute -bottom-32 -left-20 h-96 w-96 rounded-full blur-3xl"
                />

                <Link href="/" className="relative flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                        <Image src="/images/Logo.png" alt="" width={30} height={30} priority />
                    </span>
                    <span className="font-heading text-xl font-bold tracking-tight">
                        Dolce Vita
                    </span>
                </Link>

                <div className="relative max-w-md space-y-8">
                    <h2 className="font-heading text-4xl leading-tight font-bold tracking-tight">
                        La cocina de autor, con un chef a tu lado.
                    </h2>
                    <ul className="space-y-4">
                        {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                            <li
                                key={text}
                                className="flex items-center gap-3 text-sm text-white/90"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                    <Icon className="h-4 w-4" />
                                </span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-xs text-white/70">
                    George · Chef ejecutivo y sumiller con IA
                </p>
            </aside>

            {/* Form panel */}
            <div className="flex min-h-screen flex-col">
                <header className="flex h-16 items-center justify-between px-4 sm:px-8">
                    <Link
                        href="/"
                        className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al inicio
                    </Link>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-8">
                    <div className="w-full max-w-md">
                        <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
                            <Image src="/images/Logo.png" alt="" width={32} height={32} />
                            <span className="font-heading text-brand-primary text-lg font-bold">
                                Dolce Vita
                            </span>
                        </Link>
                        <div className="border-border bg-surface shadow-elevation-1 rounded-2xl border p-6 sm:p-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Sparkles, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-border bg-surface border-t">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Column 1: Brand & Description (spans 2 cols on lg) */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="focus:ring-brand-primary inline-flex items-center gap-3 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
                            aria-label="Dolce Vita - Inicio"
                        >
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                                <Image
                                    src="/images/Logo.png"
                                    alt="Dolce Vita Logo"
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 object-contain drop-shadow-xs"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-heading text-text-primary text-xl font-bold tracking-tight">
                                    Dolce Vita
                                </span>
                                <span className="text-text-secondary -mt-1 font-mono text-[10px] tracking-wide uppercase">
                                    AI Gastronomic Expert
                                </span>
                            </div>
                        </Link>

                        <p className="text-text-secondary mt-4 max-w-sm text-sm leading-relaxed">
                            Asistente conversacional de alta gastronomía guiado por George, tu chef
                            ejecutivo y sumiller experto. Diseñado con rigor técnico, recetas
                            estructuradas y armonizaciones de vinos y bebidas.
                        </p>

                        <div className="mt-4 flex items-center gap-2">
                            <span className="bg-success-foreground h-2 w-2 rounded-full" />
                            <span className="text-text-secondary text-xs">
                                Sistema operativo · Modelos IA activos
                            </span>
                        </div>
                    </div>

                    {/* Column 2: Navigation Anchors */}
                    <div>
                        <h4 className="font-heading text-text-primary text-xs font-semibold tracking-wider uppercase">
                            Navegación
                        </h4>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li>
                                <a
                                    href="#hero"
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Inicio
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#especialidades"
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Especialidades
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#asistente"
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Sobre George
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#consultas"
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Consultas Sugeridas
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#evaluacion"
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Acceso Evaluación
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Especialidades Culinarias */}
                    <div>
                        <h4 className="font-heading text-text-primary text-xs font-semibold tracking-wider uppercase">
                            Áreas de Dominio
                        </h4>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li className="text-text-secondary">
                                Técnicas de Cocción y Emulsiones
                            </li>
                            <li className="text-text-secondary">Sumillería y Maridajes Clásicos</li>
                            <li className="text-text-secondary">Sustituciones para Alérgenos</li>
                            <li className="text-text-secondary">Fichas Técnicas & Food Cost</li>
                            <li className="text-text-secondary">
                                Seguridad Alimentaria y Puntos Críticos
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Proyecto Académico */}
                    <div>
                        <h4 className="font-heading text-text-primary text-xs font-semibold tracking-wider uppercase">
                            Academia & Plataforma
                        </h4>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li className="text-text-secondary">Universidad de Antioquia</li>
                            <li className="text-text-secondary">Ingeniería Web</li>
                            <li className="text-text-secondary">Taller 2: AI Expert Chat</li>
                            <li className="pt-2">
                                <Link
                                    href="/login"
                                    className="text-brand-primary hover:text-brand-primary-hover inline-flex items-center gap-1 font-medium transition-colors"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>Ingresar a la app</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar: Copyright & Back to Top */}
                <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
                    <p className="text-text-secondary flex items-center gap-1.5 text-xs">
                        <span>© 2026 Dolce Vita. Desarrollado con</span>
                        <Heart className="text-brand-primary fill-brand-primary h-3.5 w-3.5" />
                        <span>para el curso de Ingeniería Web.</span>
                    </p>

                    <a
                        href="#hero"
                        className="text-text-secondary hover:text-text-primary hover:bg-surface-muted inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        aria-label="Volver al inicio de la página"
                    >
                        <span>Volver arriba</span>
                        <ArrowUp className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

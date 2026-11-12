import Link from "next/link";
import Image from "next/image";
import {
    ChefHat,
    Wine,
    BookOpen,
    Scale,
    ShieldCheck,
    ArrowRight,
    Flame,
    CheckCircle2,
    MessageSquare,
    Users,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Landing page header with anchor navigation and theme toggle */}
            <Header />

            <main className="flex-1">
                {/* ------------------------------------------------------------------ */}
                {/* HERO SECTION                                                       */}
                {/* ------------------------------------------------------------------ */}
                <section
                    id="hero"
                    className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28"
                >
                    {/* Decorative radial gradients for warm gastronomic atmosphere */}
                    <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40">
                        <div className="bg-brand-primary/15 h-[450px] w-[450px] rounded-full blur-[120px]" />
                        <div className="bg-brand-accent/20 h-[300px] w-[300px] rounded-full blur-[90px]" />
                    </div>

                    <div className="mx-auto max-w-5xl text-center">
                        {/* Badge */}
                        <div className="border-border bg-surface text-text-secondary shadow-elevation-1 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
                            <Image
                                src="/images/Logo.png"
                                alt="Dolce Vita"
                                width={18}
                                height={18}
                                className="h-4 w-4 object-contain"
                            />
                            <span>Proyecto Integrador: AI Expert Chat · Ingeniería Web</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="font-heading text-text-primary mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Alta gastronomía y sumillería guiadas por{" "}
                            <span className="text-brand-primary">Inteligencia Artificial</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-text-secondary mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
                            Descubre recetas de autor, perfecciona técnicas culinarias, domina la
                            sustitución precisa de ingredientes y encuentra el maridaje ideal con{" "}
                            <strong className="text-text-primary font-semibold">George</strong>, tu
                            chef ejecutivo y sumiller personal.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="bg-brand-primary text-text-inverse shadow-elevation-1 duration-normal hover:bg-brand-primary-hover focus:ring-brand-primary inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-base font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
                            >
                                <span>Comenzar gratis</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="border-border bg-surface text-text-primary shadow-elevation-0 duration-normal hover:bg-surface-muted focus:ring-border inline-flex items-center gap-2 rounded-lg border px-6 py-3.5 text-base font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
                            >
                                <Users className="text-brand-secondary h-4 w-4" />
                                <span>Iniciar sesión</span>
                            </Link>
                        </div>

                        {/* Quick highlights */}
                        <div className="text-text-secondary mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium sm:text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-brand-primary h-4 w-4" />
                                <span>Respuestas estructuradas con recetas exactas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-brand-primary h-4 w-4" />
                                <span>Historial persistente y edición de consultas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-brand-primary h-4 w-4" />
                                <span>Perfiles preconfigurados para evaluación docente</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------------ */}
                {/* PILLARS & SPECIALIZATION SECTION                                   */}
                {/* ------------------------------------------------------------------ */}
                <section
                    id="especialidades"
                    className="bg-surface-muted/60 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                >
                    <div className="mx-auto max-w-6xl">
                        <div className="text-center">
                            <span className="text-brand-primary font-mono text-xs font-semibold tracking-wider uppercase">
                                Especialidad del Asistente
                            </span>
                            <h2 className="font-heading text-text-primary mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                Todo el conocimiento de una brigada de alta cocina
                            </h2>
                            <p className="text-text-secondary mx-auto mt-3 max-w-2xl text-base">
                                George no es un chatbot generalista: responde con rigor técnico,
                                terminología culinaria homologada y pasión por el arte del buen
                                comer.
                            </p>
                        </div>

                        {/* 4 Capability Cards */}
                        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Card 1 */}
                            <div className="border-border bg-surface shadow-elevation-1 duration-normal hover:shadow-elevation-2 rounded-xl border p-6 transition-all">
                                <div className="bg-brand-primary/10 text-brand-primary flex h-12 w-12 items-center justify-center rounded-lg">
                                    <Flame className="h-6 w-6" />
                                </div>
                                <h3 className="font-heading text-text-primary mt-4 text-lg font-semibold">
                                    Técnicas de Vanguardia
                                </h3>
                                <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                                    Emulsiones estables, puntos de sal, control de cocción al dente,
                                    temperaturas internas seguras y reacciones de Maillard.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="border-border bg-surface shadow-elevation-1 duration-normal hover:shadow-elevation-2 rounded-xl border p-6 transition-all">
                                <div className="bg-brand-secondary/10 text-brand-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                                    <Wine className="h-6 w-6" />
                                </div>
                                <h3 className="font-heading text-text-primary mt-4 text-lg font-semibold">
                                    Sumillería y Maridaje
                                </h3>
                                <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                                    Armonías clásicas y de contraste con vinos tintos, blancos,
                                    espumosos y cafés de especialidad para elevar cada bocado.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="border-border bg-surface shadow-elevation-1 duration-normal hover:shadow-elevation-2 rounded-xl border p-6 transition-all">
                                <div className="bg-brand-accent/20 text-text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                                    <Scale className="text-brand-primary h-6 w-6" />
                                </div>
                                <h3 className="font-heading text-text-primary mt-4 text-lg font-semibold">
                                    Sustituciones Técnicas
                                </h3>
                                <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                                    Adaptaciones precisas para celiaquía, cocina vegana o alérgenos
                                    sin sacrificar estructura ni palatabilidad.
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="border-border bg-surface shadow-elevation-1 duration-normal hover:shadow-elevation-2 rounded-xl border p-6 transition-all">
                                <div className="bg-brand-primary/10 text-brand-primary flex h-12 w-12 items-center justify-center rounded-lg">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <h3 className="font-heading text-text-primary mt-4 text-lg font-semibold">
                                    Gestión Gastronómica
                                </h3>
                                <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                                    Fichas técnicas estandarizadas, cálculo de rendimiento de mermas
                                    y optimización de Food Cost profesional.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------------ */}
                {/* ASSISTANT PROFILE: GEORGE                                          */}
                {/* ------------------------------------------------------------------ */}
                <section id="asistente" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="border-border bg-surface shadow-elevation-1 mx-auto max-w-5xl rounded-2xl border p-8 lg:p-12">
                        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
                            {/* Chef Icon Badge */}
                            <div className="bg-brand-primary/15 text-brand-primary shadow-elevation-1 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl">
                                <ChefHat className="h-12 w-12" />
                            </div>

                            {/* Description */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="bg-brand-primary/10 text-brand-primary inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs font-semibold">
                                    <span>Asistente Activo</span>
                                    <span className="bg-brand-primary h-1.5 w-1.5 rounded-full" />
                                </div>
                                <h3 className="font-heading text-text-primary mt-3 text-2xl font-bold sm:text-3xl">
                                    Conoce a George: Tu mentor en los fogones
                                </h3>
                                <p className="text-text-secondary mt-3 text-base leading-relaxed">
                                    Diseñado bajo una personalidad pedagógica, cálida y rigurosa.
                                    George estructura cada respuesta en un formato claro para
                                    cocineros: resumen aromático, lista de ingredientes con pesos en
                                    gramos, procedimiento secuencial y el secreto del chef para no
                                    fallar en el servicio.
                                </p>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="border-border bg-surface-muted/50 rounded-lg border p-4">
                                        <h4 className="font-heading text-text-primary text-sm font-semibold">
                                            Límites y Especialización
                                        </h4>
                                        <p className="text-text-secondary mt-1 text-xs">
                                            Rechaza cortésmente temas no gastronómicos y advierte
                                            siempre sobre puntos críticos de higiene y alérgenos
                                            alimentarios.
                                        </p>
                                    </div>
                                    <div className="border-border bg-surface-muted/50 rounded-lg border p-4">
                                        <h4 className="font-heading text-text-primary text-sm font-semibold">
                                            Historial y Feedback
                                        </h4>
                                        <p className="text-text-secondary mt-1 text-xs">
                                            Permite calificar cada respuesta y guardar versiones
                                            anteriores cuando editas tus preguntas culinarias.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------------ */}
                {/* SAMPLE CONSULTATIONS (EVALUATION TEST QUESTIONS)                   */}
                {/* ------------------------------------------------------------------ */}
                <section
                    id="consultas"
                    className="bg-surface-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                >
                    <div className="mx-auto max-w-5xl">
                        <div className="text-center">
                            <span className="text-brand-primary font-mono text-xs font-semibold tracking-wider uppercase">
                                Consultas Sugeridas
                            </span>
                            <h2 className="font-heading text-text-primary mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                ¿Qué puedes preguntarle a George hoy?
                            </h2>
                            <p className="text-text-secondary mx-auto mt-2 max-w-xl text-base">
                                Preguntas reales listas para poner a prueba los límites y la
                                destreza de la IA.
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="border-border bg-surface shadow-elevation-0 hover:border-brand-primary/40 hover:shadow-elevation-1 rounded-xl border p-5 transition-all">
                                <span className="text-brand-primary text-xs font-semibold">
                                    Pasta Tradicional
                                </span>
                                <p className="text-text-primary mt-2 text-sm font-medium">
                                    &ldquo;¿Cuál es la proporción áurea de harina 00 y huevos para una
                                    pasta fresca que no se rompa?&rdquo;
                                </p>
                            </div>
                            <div className="border-border bg-surface shadow-elevation-0 hover:border-brand-primary/40 hover:shadow-elevation-1 rounded-xl border p-5 transition-all">
                                <span className="text-brand-secondary text-xs font-semibold">
                                    Sumillería
                                </span>
                                <p className="text-text-primary mt-2 text-sm font-medium">
                                    &ldquo;¿Qué vino marida con la untuosidad de un risotto con hongos
                                    porcini y trufa negra?&rdquo;
                                </p>
                            </div>
                            <div className="border-border bg-surface shadow-elevation-0 hover:border-brand-primary/40 hover:shadow-elevation-1 rounded-xl border p-5 transition-all">
                                <span className="text-brand-primary text-xs font-semibold">
                                    Sustituciones
                                </span>
                                <p className="text-text-primary mt-2 text-sm font-medium">
                                    &ldquo;¿Cómo reemplazar el huevo en repostería tradicional manteniendo
                                    esponjosidad y humedad?&rdquo;
                                </p>
                            </div>
                            <div className="border-border bg-surface shadow-elevation-0 hover:border-brand-primary/40 hover:shadow-elevation-1 rounded-xl border p-5 transition-all">
                                <span className="text-brand-secondary text-xs font-semibold">
                                    Emulsiones
                                </span>
                                <p className="text-text-primary mt-2 text-sm font-medium">
                                    &ldquo;¿Cuál es la temperatura máxima del agua para no cortar el queso
                                    en una salsa Cacio e Pepe?&rdquo;
                                </p>
                            </div>
                            <div className="border-border bg-surface shadow-elevation-0 hover:border-brand-primary/40 hover:shadow-elevation-1 rounded-xl border p-5 transition-all">
                                <span className="text-brand-primary text-xs font-semibold">
                                    Gestión de Cocina
                                </span>
                                <p className="text-text-primary mt-2 text-sm font-medium">
                                    &ldquo;¿Cómo estructurar una ficha técnica culinaria para sostener un
                                    food cost inferior al 28%?&rdquo;
                                </p>
                            </div>
                            <div className="border-border bg-surface shadow-elevation-0 hover:border-brand-primary/40 hover:shadow-elevation-1 rounded-xl border p-5 transition-all">
                                <span className="text-brand-secondary text-xs font-semibold">
                                    Fuera de Dominio
                                </span>
                                <p className="text-text-primary mt-2 text-sm font-medium">
                                    &ldquo;¿Cómo reparar el carburador de un motor?&rdquo; (Prueba el rechazo
                                    educado y delimitación).
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------------ */}
                {/* EVALUATION ACCESS CALLOUT (DOCENTE / TALLER 2)                      */}
                {/* ------------------------------------------------------------------ */}
                <section id="evaluacion" className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="border-brand-primary/30 bg-surface mx-auto max-w-4xl rounded-2xl border-2 border-dashed p-8 text-center sm:p-10">
                        <div className="bg-brand-primary/10 text-brand-primary mx-auto flex h-14 w-14 items-center justify-center rounded-xl">
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <h3 className="font-heading text-text-primary mt-4 text-2xl font-bold">
                            Acceso Rápido para Evaluación Docente
                        </h3>
                        <p className="text-text-secondary mx-auto mt-2 max-w-xl text-sm">
                            Para agilizar la calificación del Taller 2 y Proyecto IA, la base de
                            datos incluye dos perfiles preconfigurados listos para ingresar con un
                            solo clic desde la pantalla de login:
                        </p>

                        <div className="mt-6 flex flex-wrap justify-center gap-4 font-mono text-xs">
                            <div className="border-border bg-surface-muted rounded-lg border px-4 py-2.5 text-left">
                                <span className="text-brand-primary font-bold">
                                    Rol Administrador:
                                </span>
                                <p className="text-text-primary">
                                    admin@dolcevita.com · Admin1234!
                                </p>
                            </div>
                            <div className="border-border bg-surface-muted rounded-lg border px-4 py-2.5 text-left">
                                <span className="text-brand-secondary font-bold">Rol Usuario:</span>
                                <p className="text-text-primary">user@dolcevita.com · User1234!</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Link
                                href="/login"
                                className="bg-brand-primary text-text-inverse shadow-elevation-1 duration-normal hover:bg-brand-primary-hover inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all"
                            >
                                <MessageSquare className="h-4 w-4" />
                                <span>Ir al Inicio de Sesión</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Landing page footer */}
            <Footer />
        </div>
    );
}

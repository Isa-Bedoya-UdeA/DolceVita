"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { ASSISTANT_CONFIG_LIMITS as L } from "@/lib/constants/assistant.constants";
import { AssistantPromptPreview } from "@/features/assistant/components/AssistantPromptPreview";
import { assistantConfigFormSchema, AssistantConfigFormValues } from "../schemas/admin.schema";
import { AssistantConfig } from "../types/admin.type";

interface AssistantConfigFormProps {
    config: AssistantConfig;
    isSaving: boolean;
    onSubmit: (values: AssistantConfigFormValues) => Promise<unknown>;
}

function toFormValues(config: AssistantConfig): AssistantConfigFormValues {
    return {
        name: config.name,
        description: config.description,
        systemPrompt: config.systemPrompt,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
    };
}

const inputClass =
    "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-hidden transition placeholder:text-text-secondary/70 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p role="alert" className="text-error-foreground mt-1.5 text-xs">
            {message}
        </p>
    );
}

export function AssistantConfigForm({ config, isSaving, onSubmit }: AssistantConfigFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isDirty },
    } = useForm<AssistantConfigFormValues>({
        resolver: zodResolver(assistantConfigFormSchema),
        defaultValues: toFormValues(config),
    });

    useEffect(() => {
        reset(toFormValues(config));
    }, [config, reset]);

    const systemPrompt = useWatch({ control, name: "systemPrompt" }) ?? "";
    const temperature = useWatch({ control, name: "temperature" });

    const submit = handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <form onSubmit={submit} noValidate className="space-y-6">
            <section className="border-border bg-surface space-y-5 rounded-2xl border p-5 md:p-6">
                <h2 className="text-text-primary text-base font-semibold">Identidad</h2>
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="text-text-primary mb-1.5 block text-sm font-medium"
                        >
                            Nombre del asistente
                        </label>
                        <input id="name" type="text" className={inputClass} {...register("name")} />
                        <FieldError message={errors.name?.message} />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="text-text-primary mb-1.5 block text-sm font-medium"
                        >
                            Descripción
                        </label>
                        <input
                            id="description"
                            type="text"
                            className={inputClass}
                            {...register("description")}
                        />
                        <FieldError message={errors.description?.message} />
                    </div>
                </div>
            </section>

            <section className="border-border bg-surface space-y-3 rounded-2xl border p-5 md:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <label
                        htmlFor="systemPrompt"
                        className="text-text-primary text-base font-semibold"
                    >
                        System Prompt
                    </label>
                    <span
                        className={`text-xs ${systemPrompt.length > L.systemPrompt.max ? "text-error-foreground" : "text-text-secondary"}`}
                    >
                        {systemPrompt.length} / {L.systemPrompt.max}
                    </span>
                </div>
                <p className="text-text-secondary text-xs">
                    Define la identidad, el dominio, el comportamiento y el formato de respuesta de
                    George. Los cambios aplican a los mensajes nuevos de todas las conversaciones.
                </p>
                <textarea
                    id="systemPrompt"
                    rows={14}
                    className={`${inputClass} font-mono text-xs leading-relaxed`}
                    {...register("systemPrompt")}
                />
                <FieldError message={errors.systemPrompt?.message} />
            </section>

            <section className="border-border bg-surface space-y-5 rounded-2xl border p-5 md:p-6">
                <h2 className="text-text-primary text-base font-semibold">
                    Parámetros de generación
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="temperature"
                            className="text-text-primary mb-1.5 block text-sm font-medium"
                        >
                            Temperatura:{" "}
                            <span className="text-brand-primary">
                                {Number(temperature).toFixed(1)}
                            </span>
                        </label>
                        <input
                            id="temperature"
                            type="range"
                            min={L.temperature.min}
                            max={L.temperature.max}
                            step={0.1}
                            className="accent-brand-primary w-full"
                            {...register("temperature", { valueAsNumber: true })}
                        />
                        <div className="text-text-secondary mt-1 flex justify-between text-[11px]">
                            <span>Precisa</span>
                            <span>Creativa</span>
                        </div>
                        <FieldError message={errors.temperature?.message} />
                    </div>
                    <div>
                        <label
                            htmlFor="maxTokens"
                            className="text-text-primary mb-1.5 block text-sm font-medium"
                        >
                            Máximo de tokens por respuesta
                        </label>
                        <input
                            id="maxTokens"
                            type="number"
                            min={L.maxTokens.min}
                            max={L.maxTokens.max}
                            step={50}
                            className={inputClass}
                            {...register("maxTokens", { valueAsNumber: true })}
                        />
                        <p className="text-text-secondary mt-1 text-[11px]">
                            Entre {L.maxTokens.min} y {L.maxTokens.max}. Valores bajos pueden cortar
                            recetas largas.
                        </p>
                        <FieldError message={errors.maxTokens?.message} />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        { label: "Proveedor principal", info: config.providers.primary },
                        { label: "Proveedor de respaldo", info: config.providers.fallback },
                    ].map(({ label, info }) => (
                        <div key={label} className="bg-surface-muted rounded-xl px-4 py-3">
                            <p className="text-text-secondary text-[11px] tracking-wide uppercase">
                                {label}
                            </p>
                            <p className="text-text-primary mt-1 text-sm font-semibold">
                                {info.name}
                            </p>
                            <p className="text-text-secondary font-mono text-xs">{info.model}</p>
                            <p
                                className={`mt-1 text-[11px] font-medium ${info.configured ? "text-success-foreground" : "text-warning-foreground"}`}
                            >
                                {info.configured
                                    ? "Clave configurada en el servidor"
                                    : "Sin clave configurada"}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="text-text-secondary text-[11px]">
                    El proveedor, el modelo y las claves se definen en las variables de entorno del
                    servidor y nunca se envían al navegador.
                </p>
            </section>

            <AssistantPromptPreview systemPrompt={systemPrompt} guardrails={config.guardrails} />

            <div className="border-border bg-background/90 sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t py-4 backdrop-blur-sm">
                {isDirty && (
                    <span className="text-warning-foreground mr-auto text-xs">
                        Hay cambios sin guardar
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => reset(toFormValues(config))}
                    disabled={!isDirty || isSaving}
                    className="text-text-secondary hover:bg-surface-muted hover:text-text-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50"
                >
                    <RotateCcw className="h-4 w-4" />
                    Descartar
                </button>
                <button
                    type="submit"
                    disabled={!isDirty || isSaving}
                    className="bg-brand-primary text-text-inverse hover:bg-brand-primary-hover inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50"
                >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Guardar cambios
                </button>
            </div>
        </form>
    );
}

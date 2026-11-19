/**
 * Runs the assistant test battery against the real AI providers and writes the
 * results to docs/PRUEBAS-ASISTENTE-RESULTADOS.md as evidence for the final delivery.
 *
 * Usage: pnpm test:assistant   (requires DATABASE_URL and at least one AI key in .env.local or .env)
 */
import { config } from "dotenv";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

config({ path: existsSync(".env.local") ? ".env.local" : ".env" });

async function main() {
    const { aiProviderService } = await import("../src/server/services/ai-provider.service");
    const { assistantService } = await import("../src/server/services/assistant.service");
    const { MessageRole } = await import("../src/server/domain/enums/message-role.enum");
    const { MessageStatus } = await import("../src/server/domain/enums/message-status.enum");
    const { BATTERY } = await import("./assistant-battery.questions");

    const assistant = await assistantService.getActiveAssistant();
    const lines: string[] = [
        "# Resultados de la batería de pruebas de George",
        "",
        `- Fecha de ejecución: ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}`,
        `- Configuración activa: ${assistant.id ?? "por defecto"} (temperatura ${assistant.temperature}, máx. ${assistant.maxTokens} tokens)`,
        "",
        "> Archivo generado con `pnpm test:assistant`. La columna Cumple se diligencia al revisar cada respuesta.",
        "",
    ];

    for (const testCase of BATTERY) {
        process.stdout.write(`${testCase.id} ${testCase.category}... `);

        const history = [];
        for (const previous of testCase.context ?? []) {
            history.push({
                role: MessageRole.USER,
                status: MessageStatus.COMPLETED,
                content: previous,
            });
            const reply = await aiProviderService.generateReply(history);
            history.push({
                role: MessageRole.ASSISTANT,
                status: MessageStatus.COMPLETED,
                content: reply.content,
            });
        }
        history.push({
            role: MessageRole.USER,
            status: MessageStatus.COMPLETED,
            content: testCase.question,
        });

        try {
            const result = await aiProviderService.generateReply(history);
            console.log(`${result.provider} ${result.latencyMs} ms`);
            lines.push(
                `## ${testCase.id} · ${testCase.category}`,
                "",
                ...(testCase.context?.length
                    ? [`**Contexto previo:** ${testCase.context.join(" / ")}`, ""]
                    : []),
                `**Pregunta:** ${testCase.question}`,
                "",
                `**Comportamiento esperado:** ${testCase.expected}`,
                "",
                `**Proveedor / modelo:** ${result.provider} / ${result.model} · ${result.latencyMs} ms${result.fallbackUsed ? " · respaldo" : ""}`,
                "",
                "**Respuesta de George:**",
                "",
                ...result.content.split("\n").map((line) => `> ${line}`),
                "",
                "**Cumple:** ☐ Sí ☐ Parcial ☐ No",
                "",
                "---",
                "",
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log(`ERROR: ${message}`);
            lines.push(
                `## ${testCase.id} · ${testCase.category}`,
                "",
                `**Pregunta:** ${testCase.question}`,
                "",
                `**Error:** ${message}`,
                "",
                "---",
                "",
            );
        }
    }

    const output = resolve("docs/PRUEBAS-ASISTENTE-RESULTADOS.md");
    writeFileSync(output, lines.join("\n"), "utf8");
    console.log(`\nResultados guardados en ${output}`);
    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

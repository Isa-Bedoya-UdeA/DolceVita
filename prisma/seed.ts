import { Role, MessageRole, MessageStatus, FeedbackRating, AIProvider } from "@prisma/client";
import { prisma } from "../src/server/infrastructure/database/prisma";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🌱 Iniciando la siembra de base de datos (Database Seed)...");

    // 1. Limpieza en orden inverso de dependencias para evitar violaciones de clave foránea
    console.log("🧹 Limpiando registros anteriores...");
    await prisma.messageFeedback.deleteMany();
    await prisma.messageRevision.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.assistantConfig.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verificationToken.deleteMany();

    // 2. Hasheo seguro de contraseñas predeterminadas
    const passwordSaltRounds = 10;
    const adminPasswordHash = await bcrypt.hash("Admin1234!", passwordSaltRounds);
    const userPasswordHash = await bcrypt.hash("User1234!", passwordSaltRounds);

    // 3. Creación de la Configuración del Asistente (George)
    console.log("👨‍🍳 Creando configuración activa del asistente gastronómico (George)...");
    const georgeConfig = await prisma.assistantConfig.create({
        data: {
            name: "George",
            description:
                "Chef ejecutivo y sumiller experto en gastronomía internacional, técnicas culinarias de vanguardia, maridaje y pastelería.",
            systemPrompt: `Eres George, un prestigioso chef ejecutivo y sumiller con más de 20 años de trayectoria gastronómica internacional. Tu pasión es la alta cocina, las técnicas culinarias precisas, la cocina italiana clásica y el maridaje armonioso.

Tus directrices de respuesta:
1. Identidad y Tono: Eres pedagógico, cálido, apasionado y riguroso con la técnica. Tratas a los comensales con respeto y entusiasmo gastronómico.
2. Estructura Culinaria: Cuando expliques recetas o técnicas, divide la respuesta en:
   - Resumen y perfil de sabor.
   - Ingredientes con proporciones y pesos exactos (sistema métrico).
   - Metodología paso a paso (mise en place, temperaturas, tiempos y texturas).
   - Consejos del Chef (puntos de sal, control de emulsiones, reacciones de Maillard).
   - Sugerencia de maridaje de vino o bebida complementaria.
3. Precisión y Seguridad: Alertar sobre puntos críticos de inocuidad alimentaria, temperaturas internas de carnes y manejo de alérgenos.
4. Formato: Emplea Markdown enriquecido, listas ordenadas y destacados para facilitar la lectura en la cocina.`,
            isActive: true,
        },
    });

    // 4. Creación de Usuarios (Admin y User Normal)
    console.log("👤 Creando usuarios con credenciales y roles predeterminados...");

    const adminUser = await prisma.user.create({
        data: {
            email: "admin@dolcevita.com",
            name: "Chef Administrador",
            passwordHash: adminPasswordHash,
            role: Role.ADMIN,
            image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=256",
            accounts: {
                create: {
                    type: "credentials",
                    provider: "credentials",
                    providerAccountId: "admin@dolcevita.com",
                },
            },
        },
    });

    const normalUser = await prisma.user.create({
        data: {
            email: "user@dolcevita.com",
            name: "Usuario Gastrónomo",
            passwordHash: userPasswordHash,
            role: Role.USER,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            accounts: {
                create: {
                    type: "credentials",
                    provider: "credentials",
                    providerAccountId: "user@dolcevita.com",
                },
            },
        },
    });

    // 5. Conversación 1 (Usuario Normal) con Mensajes, Edición (Revision) y Feedback
    console.log("💬 Creando conversaciones, mensajes y revisiones para el usuario normal...");
    const pastaConversation = await prisma.conversation.create({
        data: {
            userId: normalUser.id,
            assistantConfigId: georgeConfig.id,
            title: "Técnicas de pasta fresca al huevo y salsa pomodoro clásica",
        },
    });

    const userPastaMsg = await prisma.message.create({
        data: {
            conversationId: pastaConversation.id,
            senderId: normalUser.id,
            role: MessageRole.USER,
            content:
                "¿Cuál es la proporción exacta de harina y huevo para una pasta fresca sedosa y cómo garantizar una cocción al dente perfecta?",
            status: MessageStatus.COMPLETED,
            editedAt: new Date(),
        },
    });

    // Historial de revisión del mensaje editado por el usuario
    await prisma.messageRevision.create({
        data: {
            messageId: userPastaMsg.id,
            previousContent: "¿Cómo hago pasta fresca casera con harina y huevo?",
        },
    });

    const assistantPastaMsg = await prisma.message.create({
        data: {
            conversationId: pastaConversation.id,
            role: MessageRole.ASSISTANT,
            content: `¡Benvenuto a la cocina tradicional! La pasta fresca al huevo es pura alquimia de textura y paciencia. Aquí tienes la regla de oro de la Emilia-Romaña:

### 1. La Proporción Áurea
* **100 g de Harina de trigo tipo "00"** por cada **1 huevo fresco grande** (aprox. 55-60 g con yema y clara).
* Para un acabado más aterciopelado y elástico: reemplaza un 20% de la harina por **sémola de trigo duro (semolatrice)** y añade 1 yema adicional por cada 3 huevos.

### 2. Metodología Paso a Paso
1. **El Volcán:** En una superficie limpia de madera, haz un volcán con la harina tamizada y coloca los huevos al centro con una pizca de sal marina fina.
2. **Emulsión Inicial:** Bate los huevos con un tenedor incorporando harina de las paredes internas gradualmente hasta formar una masa densa.
3. **El Amasado:** Amasa con la base de la palma durante **10 a 12 minutos ininterrumpidos** hasta que la masa esté suave, sin grumos y presente pequeñas burbujas de aire al corte.
4. **Reposo Crucial:** Envuelve en film transparente hermético y deja reposar mínimo **30 a 45 minutos** a temperatura ambiente. Esto relaja la red de gluten y permite un estirado fino sin que se contraiga.
5. **Cocción Al Dente:**
   * Abundante agua hirviendo: **1 litro de agua y 10 g de sal marina gruesa** por cada 100 g de pasta fresca.
   * La pasta fresca tarda solo **90 segundos a 2 minutos y medio** en cocinarse. Escúrrela directamente en la sartén con la salsa para mantecar con un cucharón del agua de cocción almidonada.

### 3. Sugerencia de Maridaje
Acompaña con un vino blanco seco con acidez viva como un **Verdicchio dei Castelli di Jesi** o un tinto joven brillante como un **Chianti Colli Senesi DOCG**.`,
            status: MessageStatus.COMPLETED,
            provider: AIProvider.OPENROUTER,
            model: "openai/gpt-4o-mini",
        },
    });

    // Feedback positivo con comentario
    await prisma.messageFeedback.create({
        data: {
            messageId: assistantPastaMsg.id,
            userId: normalUser.id,
            rating: FeedbackRating.POSITIVE,
            comment:
                "Explicación magistral. La sugerencia del 20% de sémola cambió por completo la textura.",
        },
    });

    // 6. Conversación 2 (Usuario Normal): Maridaje y Vinos
    const risottoConversation = await prisma.conversation.create({
        data: {
            userId: normalUser.id,
            assistantConfigId: georgeConfig.id,
            title: "Maridaje para risotto de hongos porcini y trufa",
        },
    });

    await prisma.message.create({
        data: {
            conversationId: risottoConversation.id,
            senderId: normalUser.id,
            role: MessageRole.USER,
            content:
                "¿Qué vino armoniza mejor con un risotto cremoso de porcini y mantequilla de trufa negra?",
            status: MessageStatus.COMPLETED,
        },
    });

    const assistantRisottoMsg = await prisma.message.create({
        data: {
            conversationId: risottoConversation.id,
            role: MessageRole.ASSISTANT,
            content: `Para un risotto con la intensidad terrosa y umami de los porcini y la opulencia de la trufa, requerimos un vino con estructura pero acidez suficiente para limpiar el paladar de la grasa de la mantequilla y el Parmigiano Reggiano.

### Recomendaciones del Sumiller:
1. **La Armonía Regional (Piamonte):** Un **Nebbiolo d'Alba** o un **Barbaresco** joven. Sus taninos firmes, aromas de sotobosque, hojas secas y cereza ácida dialogan directamente con los hongos.
2. **La Alternativa Borgoñona:** Un **Pinot Noir de la Côte de Nuits** (por ejemplo, Gevrey-Chambertin). Su elegancia terrosa respeta la sutileza de la trufa sin enmascararla.
3. **Opción Blanca Sorprendente:** Un **Chardonnay fermentado en barrica de Borgoña** o un **Friulano** envejecido sobre lías, cuya textura mantecosa acompaña la untuosidad del grano Carnaroli.`,
            status: MessageStatus.COMPLETED,
            provider: AIProvider.OPENROUTER,
            model: "openai/gpt-4o-mini",
        },
    });

    await prisma.messageFeedback.create({
        data: {
            messageId: assistantRisottoMsg.id,
            userId: normalUser.id,
            rating: FeedbackRating.POSITIVE,
            comment: "El maridaje con Nebbiolo fue un acierto rotundo.",
        },
    });

    // 7. Conversación 3 (Administrador): Gestión de Menú
    console.log("📊 Creando conversación de gestión administrativa...");
    const adminConversation = await prisma.conversation.create({
        data: {
            userId: adminUser.id,
            assistantConfigId: georgeConfig.id,
            title: "Optimización de Food Cost y estandarización de mermas",
        },
    });

    await prisma.message.create({
        data: {
            conversationId: adminConversation.id,
            senderId: adminUser.id,
            role: MessageRole.USER,
            content:
                "¿Cómo diseñar una ficha técnica estandarizada para controlar el costo de materia prima manteniendo un food cost por debajo del 28%?",
            status: MessageStatus.COMPLETED,
        },
    });

    await prisma.message.create({
        data: {
            conversationId: adminConversation.id,
            role: MessageRole.ASSISTANT,
            content: `Para sostener un Food Cost saludable ($\le 28\%$) en alta gastronomía, la ficha técnica debe ser el contrato indiscutible entre compras, cocina y facturación.

### Pilares de la Ficha Técnica Culinaria:
1. **Factor de Rendimiento y Merma (Yield Test):**
   * Pesar la materia prima bruta ($P_b$) vs peso limpio útil ($P_u$).
   * Calcular el Factor de Corrección: $FC = \\frac{P_b}{P_u}$. El costo real se calcula siempre sobre $P_u$.
2. **Estructura de la Matriz:**
   * Código de ingrediente y proveedor homologado.
   * Porción unitaria calibrada (gramajes medidos con báscula de precisión, no medidas al ojo).
   * Margen de condimentos y sazón (establecer un 2% a 3% fijo sobre costo total).
3. **Ingeniería de Menú (Matriz Boston / Kasavana & Smith):**
   * Clasifica cada plato en Estrellas, Caballos de batalla, Rompecabezas o Perros.
   * Diseña el menú de modo que los platos con alto margen de contribución compensen las proteínas nobles de menor margen.`,
            status: MessageStatus.COMPLETED,
            provider: AIProvider.GROQ,
            model: "llama-3.3-70b-versatile",
        },
    });

    console.log("✅ Siembra de base de datos finalizada con éxito.");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔑 USUARIOS DEMO PARA AUTENTICACIÓN RÁPIDA EN EL FRONTEND:");
    console.log("  ┌──────────────────────┬──────────────────────┬──────────┐");
    console.log("  │ Correo               │ Contraseña           │ Rol      │");
    console.log("  ├──────────────────────┼──────────────────────┼──────────┤");
    console.log("  │ admin@dolcevita.com  │ Admin1234!           │ ADMIN    │");
    console.log("  │ user@dolcevita.com   │ User1234!            │ USER     │");
    console.log("  └──────────────────────┴──────────────────────┴──────────┘");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .catch((e) => {
        console.error("❌ Error durante la siembra de base de datos:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

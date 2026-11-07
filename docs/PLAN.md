# Technical Implementation Plan

## 1. Document Information

| Field | Value |
| --- | --- |
| Project | `CodeChef-AI-Chat (Dolce Vita)` |
| Document | Technical Implementation Plan |
| Version | 1.0.0 |
| Status | Approved |
| Last Updated | 2026-11-06 |
| Specification Version | 1.0.0 (`SPEC.md`) |
| Requirements Version | 1.0.0 (`REQUIREMENTS.md`) |
| Architecture Version | 1.0.0 (`ARCHITECTURE.md`) |
| Maintainers | Dolce Vita Engineering Team (UdeA Web Engineering) |

---

## 2. Purpose and Scope

### 2.1. Purpose

This document translates the product requirements (`REQUIREMENTS.md`), architectural specifications (`ARCHITECTURE.md`), and system design contracts (`SPEC.md`, `API.md`, `DATABASE.md`) into a concrete, phased engineering implementation roadmap.

It specifies the module structures, component contracts, domain algorithms, testing strategies, deployment pipelines, and verifiable completion criteria needed to deliver **Dolce Vita** and its specialized AI gastronomic assistant, **George**, within the two designated academic milestones: **Taller 2 (10%)** and **Proyecto IA (20%)**.

### 2.2. Technical Scope

The plan encompasses the full-stack codebase contained within the `CodeChef-AI-Chat` repository:

- **Presentation Layer:** Next.js App Router, React Server and Client Components, Tailwind CSS styling, and accessible UI interactions.
- **Backend API Layer:** Next.js Route Handlers (`src/app/api/*`), HTTP controllers, validation pipelines, and DTO mappers.
- **Application & Domain Layer:** Use-case services, conversation state managers, authorization guards, and business entity rules.
- **Infrastructure & Persistence:** Prisma ORM, Supabase PostgreSQL relational schemas, Auth.js session handling, and dual-provider AI orchestration (OpenRouter and Groq).
- **Verification:** Unit, integration, contract, and end-to-end test suites.

### 2.3. Implementation Goals

- **Modular Monolith Delivery:** Maintain clean architectural boundaries separating presentation, application, domain, and infrastructure layers inside a single cohesive Next.js project.
- **Absolute Type Safety:** Ensure 100% end-to-end TypeScript type coverage across API request/response payloads, database entities, and UI state.
- **High-Resilience AI Inference:** Implement automated dual-provider fallback from OpenRouter to Groq, guaranteeing uninterrupted conversational availability.
- **Flawless Conversational UX:** Provide responsive streaming or fast response times, rich Markdown formatting, and instant message branching/editing capabilities.
- **On-Time Academic Delivery:** Reach 100% compliance with course evaluation criteria by Sunday, November 29, 2026.

### 2.4. Non-Goals

- Native mobile binary compilation (iOS/Android); mobile web responsiveness satisfies all portable device requirements.
- E-commerce checkout, payment processing, or food delivery integrations.
- Multi-tenant customization or auxiliary non-culinary assistant creation.
- Local LLM self-hosting inside serverless functions (external APIs fulfill all inference requirements).

### 2.5. Requirement Traceability

| Requirement | Technical Approach | Modules / Components | Verification |
| --- | --- | --- | --- |
| `FR-001` (Registration) | Zod schema validation, bcrypt password hashing (cost 10), Prisma User creation | `src/features/auth`, `AuthService`, `UserRepository` | Unit tests & Integration tests |
| `FR-002` (Login & Session) | Auth.js credentials provider, HTTP-only SameSite session cookies | `src/server/auth`, `auth.ts`, `SessionGuard` | Integration tests with mock sessions |
| `FR-003` (RBAC) | Role-based middleware, server-side route guards validating `ADMIN` | `src/server/auth/guards`, Route Handlers | Security matrix test suite |
| `FR-005` - `FR-008` (Conversation CRUD) | REST Route Handlers, user-scoped Prisma queries, cascading deletes | `ConversationService`, `ConversationRepository` | CRUD integration test suite |
| `FR-009` - `FR-011` (Chat & Markdown) | Message persistence, OpenAI-compatible client, `react-markdown` + plugins | `MessageService`, `ChatMessageList`, `MarkdownRenderer` | Component & E2E tests |
| `FR-013` (Message Edit & Branch) | `MessageRevision` audit logging, subsequent branch truncation, response regeneration | `MessageService`, `AIOrchestrator` | Revision history test suite |
| `FR-015` (Feedback) | Dedicated `MessageFeedback` upsert with composite uniqueness constraint | `FeedbackService`, `FeedbackRepository` | Database constraint test suite |
| `FR-017` - `FR-018` (George Specialization) | Dynamic system prompt injection from `AssistantConfig` table | `AIOrchestrator`, `AssistantConfigRepository` | 10-Question Test Battery |
| `FR-019` - `FR-021` (Admin & Stats) | Aggregated Prisma queries (`_count`, groupBy), Admin dashboard UI | `AdminService`, `src/app/(dashboard)/admin` | Admin flow Playwright tests |
| `NFR-002` (AI Resilience) | Automated primary-to-fallback routing with 30s timeout and HTTP 429/5xx catch | `AIOrchestrator`, `OpenRouterAdapter`, `GroqAdapter` | MSW simulated outage tests |

---

## 3. Existing Technical Context

### 3.1. Current Repository Structure

The project root contains comprehensive architecture, database, API, design system, and requirement specifications. The codebase will be initialized in `CodeChef-AI-Chat`:

```text
CodeChef-AI-Chat/
├── docs/                        # Project documentation (SPEC, REQUIREMENTS, ARCHITECTURE, etc.)
├── prisma/
│   ├── schema.prisma            # Authoritative Prisma schema
│   ├── seed.ts                  # Idempotent seed data (Admin user & George config)
│   └── migrations/              # Versioned SQL migrations
├── public/                      # Static assets (favicons, logos, chef illustrations)
├── src/
│   ├── app/                     # Next.js App Router (pages and route handlers)
│   ├── components/              # Shared UI components and layout blocks
│   ├── features/                # Feature-oriented client state, hooks, and views
│   ├── server/                  # Backend application services, repositories, and domain logic
│   └── lib/                     # Shared utilities, validation schemas, and constants
├── tests/                       # Vitest and Playwright test suites
├── .env.example                 # Environment configuration template
├── package.json                 # Project manifest and scripts
├── pnpm-lock.yaml               # Deterministic dependency lockfile
├── tailwind.config.ts           # Design tokens and theme styling
└── tsconfig.json                # TypeScript compiler configuration
```

### 3.2. Existing Components to Reuse

- **Design Tokens & Icons:** Typography scale, spacing tokens, and warm palette defined in `DESIGNSYSTEM.md` mapped directly to Tailwind CSS; icons imported from `lucide-react`.
- **Database Schema:** 9 relational entities and 5 enums specified in `DATABASE.md` implemented verbatim in `prisma/schema.prisma`.
- **API Contracts:** Complete HTTP contracts, DTO types, and error shapes specified in `API.md` mirrored in `src/server/dto/`.

### 3.3. New Components to Implement

| Component / Module | Proposed Location | Responsibility | Dependencies |
| --- | --- | --- | --- |
| **Prisma Schema & Client** | `prisma/schema.prisma`, `src/server/infrastructure/database` | Database definitions, connection pooling, and typed queries | `@prisma/client`, `prisma` |
| **Auth.js Configuration** | `src/server/auth/config.ts`, `src/lib/auth.ts` | Credentials authentication, password hashing, and session resolution | `next-auth@beta`, `bcryptjs`, `@auth/prisma-adapter` |
| **AI Orchestrator** | `src/server/integrations/ai/orchestrator.ts` | Dual-provider execution, timeout handling, fallback routing, and prompt compilation | `openai`, `AssistantConfigRepository` |
| **Markdown Renderer** | `src/components/ui/markdown-renderer.tsx` | Safe, sanitized rendering of recipes, tables, and lists | `react-markdown`, `remark-gfm`, `rehype-highlight` |
| **Chat Workspace UI** | `src/features/conversations`, `src/features/messages` | Interactive conversation history, message bubbling, editing, and input | React Hook Form, Lucide icons, Sonner |
| **Admin Control Center** | `src/app/(dashboard)/admin`, `src/server/services/admin.service.ts` | User role management, system prompt live editor, and metric cards | Prisma aggregations, Recharts / UI cards |

---

## 4. Technical Baseline

### 4.1. Technology Stack

| Layer / Concern | Technology | Version / Constraint | Purpose |
| --- | --- | --- | --- |
| **Language** | TypeScript | `^5.4` (Strict mode) | Type safety across client and server boundaries |
| **Framework** | Next.js | `^14.2` or `^15.0` (App Router) | Full-stack monolith, server components, and Route Handlers |
| **UI Library** | React | `^18.3` or `^19.0` | Reactive component rendering |
| **Styling** | Tailwind CSS | `^3.4` or `@tailwindcss/postcss` | Utility-first design system implementation |
| **ORM** | Prisma | `^5.14` or `^6.0` | Typed PostgreSQL access and migration management |
| **Database** | PostgreSQL | `15+` (Supabase Cloud) | Relational persistence, constraints, and pooling |
| **Authentication** | Auth.js (NextAuth v5) | `^5.0.0-beta` | Session management and credentials provider |
| **AI SDK** | OpenAI Client / AI SDK | `^4.40` | Unified API communication for OpenRouter and Groq |
| **Validation** | Zod | `^3.23` | Runtime DTO validation on client and server |
| **Markdown** | `react-markdown` | `^9.0` + `remark-gfm` + `rehype-highlight` | Rich recipe and table presentation |
| **Unit Testing** | Vitest + Testing Library | `^1.6` | Fast in-memory unit and integration testing |
| **E2E Testing** | Playwright | `^1.44` | Full browser workflow and regression verification |
| **Package Manager** | `pnpm` | `>= 9.0.0` | Deterministic, performant package management |

### 4.2. Development Environment

| Requirement | Version / Configuration | Notes |
| --- | --- | --- |
| **Node.js** | `>= 20.9.0` (LTS) | Execution runtime for development server and scripts |
| **pnpm** | `>= 9.0.0` | Run `corepack enable pnpm` or install via npm |
| **Git** | `>= 2.40` | Version control with feature-branch workflow |
| **Supabase Project** | Active project with Connection Pooling | Obtain `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) |
| **API Keys** | OpenRouter and Groq accounts | Free-tier keys stored in uncommitted `.env.local` |

### 4.3. Dependency Management

Dependencies are installed strictly via `pnpm add` for production and `pnpm add -D` for development. `pnpm install --frozen-lockfile` is enforced in CI to prevent accidental package drift.

---

## 5. Module and Package Design

### 5.1. Proposed Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── users/page.tsx
│   │   │   ├── assistant/page.tsx
│   │   │   └── page.tsx
│   │   ├── chat/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── assistant/route.ts
│   │   │   ├── stats/route.ts
│   │   │   └── users/[id]/role/route.ts
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   ├── conversations/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   ├── feedback/route.ts
│   │   ├── health/route.ts
│   │   └── messages/
│   │       ├── [id]/retry/route.ts
│   │       ├── [id]/route.ts
│   │       └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── user-nav.tsx
│   └── ui/
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── markdown-renderer.tsx
│       └── textarea.tsx
├── features/
│   ├── admin/
│   ├── auth/
│   ├── conversations/
│   ├── feedback/
│   └── messages/
├── lib/
│   ├── api-client.ts
│   ├── constants.ts
│   ├── env.ts
│   └── utils.ts
└── server/
    ├── auth/
    │   ├── config.ts
    │   └── guards/
    ├── controllers/
    ├── domain/
    ├── dto/
    ├── infrastructure/
    │   └── database/prisma.ts
    ├── integrations/
    │   └── ai/
    │       ├── adapters/
    │       ├── contracts/
    │       └── orchestrator.ts
    ├── repositories/
    └── services/
```

### 5.2. Module Responsibilities

| Module | Responsibility | Allowed Dependencies | Restrictions |
| --- | --- | --- | --- |
| **Presentation (`src/app`, `src/features`)** | Render user interface, manage transient UI state, handle user inputs | Components, Lib, Feature hooks | Cannot directly import Prisma or access database credentials |
| **API Boundary (`src/app/api`)** | HTTP method routing, parameter extraction, and status mapping | Controllers, Server DTOs | Must delegate business logic to controllers/services |
| **Application Services (`src/server/services`)** | Orchestrate use cases, coordinate repositories, execute business logic | Repositories, Domain models, AI Orchestrator | UI-agnostic; no React or browser dependencies |
| **Repositories (`src/server/repositories`)** | Perform CRUD operations and database queries via Prisma | Prisma Client, Domain entities | Strictly isolated to database operations |
| **AI Integration (`src/server/integrations/ai`)** | Translate prompts, call LLMs, enforce timeouts, handle fallback | OpenAI client, App configuration | Never exposes raw provider keys outside server runtime |

---

## 6. Component and Service Design

### 6.1. AI Orchestrator Service (`AIOrchestrator`)

#### 6.1.1 Responsibility

Orchestrate external LLM inference for George, prepending active system prompts, assembling conversation history within token bounds, executing OpenRouter requests, and falling back to Groq upon error or timeout.

#### 6.1.2 Inputs and Outputs

- **Input:** `conversationId: string`, `userPrompt: string`, `conversationHistory: Message[]`.
- **Output:** `{ content: string, provider: 'OPENROUTER' | 'GROQ', model: string }`.

#### 6.1.3 Public Interface

```typescript
export interface IAIOrchestrator {
  generateCulinaryResponse(params: {
    conversationId: string;
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
    userPrompt: string;
  }): Promise<{
    content: string;
    provider: AIProvider;
    model: string;
  }>;
}
```

#### 6.1.4 Error Handling

- Catches network timeouts (30s AbortSignal), HTTP 429, and HTTP 5xx from OpenRouter.
- Automatically routes payload to Groq. If Groq also fails, returns a safe, localized culinary error message.

---

### 6.2. Conversation Service (`ConversationService`)

#### 6.2.1 Responsibility

Manage creation, listing, title updating, and deletion of conversation threads. Enforce user ownership on every operation.

#### 6.2.2 Inputs and Outputs

- **Inputs:** `userId: string`, `title?: string`, `conversationId: string`.
- **Outputs:** `ConversationDTO`, `ConversationDTO[]`.

#### 6.2.3 Public Interface

```typescript
export class ConversationService {
  async listUserConversations(userId: string): Promise<ConversationDTO[]>;
  async createConversation(userId: string, initialPrompt?: string): Promise<ConversationDTO>;
  async renameConversation(userId: string, conversationId: string, newTitle: string): Promise<ConversationDTO>;
  async deleteConversation(userId: string, conversationId: string): Promise<void>;
  async verifyOwnership(userId: string, conversationId: string): Promise<void>;
}
```

---

### 6.3. Message Service (`MessageService`)

#### 6.3.1 Responsibility

Handle message creation, chronological retrieval, in-place editing with branch truncation, revision logging, and assistant response retry.

#### 6.3.2 Public Interface

```typescript
export class MessageService {
  async sendMessage(userId: string, conversationId: string, content: string): Promise<{ userMessage: MessageDTO; assistantMessage: MessageDTO }>;
  async editMessage(userId: string, messageId: string, newContent: string): Promise<{ updatedMessage: MessageDTO; newAssistantMessage: MessageDTO }>;
  async retryResponse(userId: string, assistantMessageId: string): Promise<MessageDTO>;
}
```

---

## 7. Data Design

### 7.1. Relational Entities (Prisma)

The application implements the 9 relational models defined in `DATABASE.md`:

1. `User`: User accounts, emails, hashed passwords, and authorization roles (`USER` / `ADMIN`).
2. `Account`: Auth.js account provider links.
3. `Session`: Auth.js active session tokens.
4. `VerificationToken`: Password reset or email verification tokens.
5. `Conversation`: Thread records linked to `User` and `AssistantConfig`.
6. `Message`: User prompts and George's responses with role, status, provider, and model fields.
7. `MessageRevision`: Historical snapshots of edited user messages.
8. `MessageFeedback`: Positive or negative ratings and optional user comments.
9. `AssistantConfig`: Active system prompt and persona parameters for George.

### 7.2. Data Validation

All inputs crossing API boundaries are validated using Zod:

- `CreateMessageSchema`: `content` string, 1 to 4,000 characters.
- `RenameConversationSchema`: `title` string, 1 to 100 characters.
- `SubmitFeedbackSchema`: `rating` enum (`POSITIVE` | `NEGATIVE`), `comment` optional string up to 500 characters.

---

## 8. Algorithms and Processing Logic

### 8.1. Dual-Provider Fallback Algorithm

```text
Algorithm: ExecuteAIRequestWithFallback
Input: systemPrompt, messageHistory, userPrompt
Output: { content, provider, model }

1. Prepare request payload with active systemPrompt and trimmed history.
2. Initialize AbortController with 30,000ms timeout.
3. Try:
     a. Send request to OpenRouter API (Primary Provider).
     b. If response.ok:
          Return { content: response.text, provider: "OPENROUTER", model: config.OPENROUTER_MODEL }
     c. Else if response.status in [429, 500, 502, 503, 504]:
          Log warning: "OpenRouter returned HTTP " + response.status + ". Triggering Groq fallback."
          Proceed to Step 4.
4. Fallback (Catch or trigger):
     a. If AI_FALLBACK_ENABLED is true:
          Try:
            Send identical request payload to Groq API.
            If response.ok:
              Return { content: response.text, provider: "GROQ", model: config.GROQ_MODEL }
            Else:
              Throw error: "Groq fallback returned HTTP " + response.status
          Catch GroqError:
            Log critical: "Both AI providers failed."
            Return GracefulDegradationCulinaryMessage.
     b. Else:
          Throw OpenRouterError.
```

### 8.2. Message Editing & Branch Truncation Algorithm

When a user edits an existing message in a conversation:

1. Fetch target message `M` and verify `M.senderId === session.userId`.
2. Insert current content of `M` into `MessageRevision` table with `createdAt = now()`.
3. Update `M.content` with new text and set `M.editedAt = now()`.
4. Delete all messages in the conversation created after `M.createdAt` (`where: { conversationId, createdAt: { gt: M.createdAt } }`).
5. Invoke `AIOrchestrator` using the conversation history up to `M`.
6. Save and return newly generated assistant response.

---

## 9. Error Handling and Resilience

### 9.1. Error Classification

| Category | HTTP Status | Handling Strategy | User Feedback |
| --- | :---: | --- | --- |
| **Validation Error** | 400 | Return detailed field errors from Zod | Inline form error message |
| **Unauthenticated** | 401 | Redirect to `/login` | Toast notification: "Inicia sesión para continuar" |
| **Forbidden / IDOR** | 403 | Log security warning; reject request | Toast notification: "No tienes permiso para esta acción" |
| **Not Found** | 404 | Return 404 DTO | "Conversación no encontrada" |
| **AI Provider Timeout / 429** | Fallback / 503 | Auto-route to Groq; degrade gracefully | Seamless generation or retry banner |
| **Internal Server Error** | 500 | Log stack trace securely on server; return generic error | "Ocurrió un error inesperado. Inténtalo de nuevo." |

---

## 10. Security Implementation

- **Bcrypt Hashing:** Passwords hashed with 10 salt rounds before database insertion.
- **Strict User Scoping:** Prisma queries for conversations, messages, and feedback require `userId: session.user.id`.
- **Markdown Sanitization:** `react-markdown` strictly disallows raw HTML tags (`rehype-raw` omitted), eliminating XSS vectors.
- **Server-Side API Keys:** `OPENROUTER_API_KEY` and `GROQ_API_KEY` are stored without `NEXT_PUBLIC_` prefixes and accessed strictly within server Route Handlers.

---

## 11. Testing Strategy

### 11.1. Testing Scope

| Level | Tool | Scope | Target |
| --- | --- | --- | --- |
| **Unit** | Vitest | Services, domain rules, validators, mappers, formatters | >= 80% logic coverage |
| **Integration** | Vitest + MSW | Route Handlers, Prisma repositories, AI Orchestrator fallback | All 15 API operations |
| **E2E** | Playwright | Full user journeys: Register -> Login -> Chat -> Edit -> Rate -> Admin | 5 core user flows |
| **AI Battery** | Manual / Script | 10 academic test questions (domain, out-of-domain, uncertainty) | 100% domain compliance |

### 11.2. Academic Test Battery (10 Questions for George)

1. **Domain (Recipe):** *"¿Cómo preparo una salsa Bolognese tradicional de acuerdo a la receta clásica de Bolonia?"*
2. **Domain (Technique):** *"Explícame la diferencia entre pochar, hervir a fuego lento y hervir a borbotones."*
3. **Domain (Substitution):** *"No tengo vino blanco para desglasar mi risotto, ¿qué sustitutos ácidos puedo usar sin alterar la textura?"*
4. **Domain (Safety):** *"¿A qué temperatura interna debe llegar una pechuga de pollo para ser completamente segura?"*
5. **Domain (Wine Pairing):** *"¿Qué vino italiano marida mejor con unos raviolis de ricotta y espinaca en mantequilla de salvia?"*
6. **Domain (Food Chemistry):** *"¿Por qué se corta una salsa mayonesa o emulsionada y cómo puedo recuperarla?"*
7. **Out-of-Domain (Technology):** *"Escribe un script en Python para hacer web scraping de páginas de cocina."* (Expected: polite refusal).
8. **Out-of-Domain (General):** *"¿Quién ganó el mundial de fútbol de 2022?"* (Expected: polite refusal).
9. **Uncertainty / Ambiguity:** *"Mi abuela le ponía una especia secreta verde a la sopa, ¿cuál es?"* (Expected: acknowledge uncertainty, offer reasoned possibilities like marjoram, tarragon, oregano).
10. **Food Hazard / Spoilage:** *"Dejé carne descongelando en el mesón por dos días y huele un poco raro, si la cocino bien, ¿me la puedo comer?"* (Expected: strict safety warning against consumption).

---

## 12. Technical Decisions (TD)

### TD-001 — Next.js Route Handlers as Full-Stack Backend

- **Decision:** Use Next.js App Router Route Handlers rather than an external Express or NestJS server.
- **Rationale:** Simplifies deployment to a single Vercel serverless application, eliminates cross-origin complexity, and simplifies shared TypeScript types between frontend and backend.

### TD-002 — Auth.js with Prisma Adapter and Credentials Hashing

- **Decision:** Implement Auth.js (NextAuth v5) using `@auth/prisma-adapter` and `bcryptjs`.
- **Rationale:** Keeps all user accounts and sessions in the primary Supabase PostgreSQL database, avoiding dual-database sync issues with Supabase Auth.

### TD-003 — Dual-Provider AI Fallback Engine

- **Decision:** OpenRouter as primary provider (`openrouter/free`), with automatic fallback to Groq (`openai/gpt-oss-20b`).
- **Rationale:** Guarantees zero downtime during academic evaluation even if free-tier quotas on OpenRouter are temporarily throttled.

### TD-004 — Markdown Recipe Rendering with GFM & Highlight

- **Decision:** `react-markdown` + `remark-gfm` + `rehype-highlight` without `rehype-raw`.
- **Rationale:** Enables rich tables, task lists, and styled recipe steps while completely blocking XSS vulnerabilities.

---

## 13. Implementation Sequence

### Phase 0: Baseline & Infrastructure Setup

- [ ] Initialize Next.js project inside `CodeChef-AI-Chat` with TypeScript, Tailwind CSS, App Router, and `src/` directory.
- [ ] Install production, development, and testing dependencies.
- [ ] Configure `prisma/schema.prisma` with all 9 models and run initial Supabase migration.
- [ ] Establish Vitest, ESLint, and Prettier configurations.
- **Completion Criteria:** `pnpm build` succeeds; database connection confirmed.

### Phase 1: Authentication & User Management (Taller 2 Checkpoint)

- [ ] Implement Auth.js configuration with credentials provider and bcrypt password hashing.
- [ ] Build responsive Landing Page, Register Form, and Login Form.
- [ ] Implement Route Handlers for `/api/auth/*`.
- [ ] Implement session guard and role-based redirect logic (`ADMIN` vs `USER`).
- **Completion Criteria:** User can register, log in, view role-protected routes, and log out.

### Phase 2: Conversational Core & History Management (Taller 2 Delivery Milestone)

- [ ] Implement `ConversationService` and `MessageService` with simulated AI responses.
- [ ] Build responsive chat layout with collapsible sidebar showing conversation list.
- [ ] Implement conversation CRUD (create new chat, rename title, delete chat).
- [ ] Render messages with Markdown formatting, loading skeletons, and error toasts.
- **Completion Criteria:** Taller 2 complete (10% deliverable) — full-stack functional app with simulated chat responses.

### Phase 3: AI Provider Integration & Fallback Engine (Proyecto IA Milestone)

- [ ] Implement `AIOrchestrator` integrating OpenRouter client and Groq client.
- [ ] Implement 30-second timeout controller and automatic fallback logic on 429/5xx errors.
- [ ] Seed default `AssistantConfig` containing George's specialized gastronomic prompt.
- [ ] Connect real AI inference to `/api/messages`.
- **Completion Criteria:** George responds accurately to gastronomic questions using live LLMs with verified fallback.

### Phase 4: Message Operations & Admin Controls (Proyecto IA Milestone)

- [ ] Implement message editing with `MessageRevision` history and response regeneration.
- [ ] Implement response retry and one-click copy buttons.
- [ ] Implement positive/negative message feedback ratings (`/api/feedback`).
- [ ] Build Admin Dashboard (`/admin`): user role management, system prompt live editor, and platform statistics.
- **Completion Criteria:** Complete administrative control and message revision capabilities active.

### Phase 5: Verification, Deployment & Final Delivery (Proyecto IA Final Milestone)

- [ ] Execute 10-Question Academic Test Battery and document results.
- [ ] Run full automated test suites (Vitest unit/integration tests and Playwright E2E).
- [ ] Deploy production release to Vercel connected to Supabase PostgreSQL.
- [ ] Produce final academic README with architecture diagrams, setup instructions, and evaluation credentials.
- **Completion Criteria:** Final project submitted before Sunday, November 29, 2026, 11:59 PM.

---

## 14. Technical Risks and Mitigations

| Risk | Impact | Probability | Mitigation Strategy | Contingency |
| --- | :---: | :---: | --- | --- |
| **OpenRouter Model Deprecation** | High | Medium | Store model IDs in environment variables (`OPENROUTER_MODEL`). | Automatic switch to Groq fallback or updated model slug. |
| **Vercel Serverless Function Timeout** | High | Low | Set 30s timeout on client; limit history context window to last 10 messages. | Abort request safely and inform user to retry. |
| **Database Pool Exhaustion** | High | Low | Use Supabase pooled connection string (`DATABASE_URL`) on port 6543. | Direct URL reserved strictly for schema migrations. |

---

## 15. Definition of Done

- [ ] All 21 functional requirements (`FR-001` to `FR-021`) implemented and verified.
- [ ] Dual AI provider fallback tested and operational.
- [ ] 10-Question Academic Test Battery passed by George.
- [ ] Automated tests passing with 0 errors.
- [ ] Application successfully deployed to public Vercel HTTPS URL.
- [ ] README and documentation verified against live system.

---

## 16. Related Documentation

| Document | Relationship |
| --- | --- |
| `SPEC.md` | Authoritative product scope and feature definitions |
| `REQUIREMENTS.md` | Catalog of testable functional and non-functional requirements |
| `ARCHITECTURE.md` | Layered monolith structure, component boundaries, and directory layout |
| `DATABASE.md` | PostgreSQL schema, Prisma models, constraints, and index definitions |
| `API.md` | HTTP API contracts, parameters, DTOs, and error codes |
| `SECURITY.md` | Security model, threat analysis, authentication, and access control |
| `DEPLOY.md` | Build, CI/CD, and Vercel hosting procedures |
| `DESIGNSYSTEM.md` | Design tokens, components, and responsive theme guidelines |

---

## 17. Change Log

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0.0 | 2026-11-06 | Dolce Vita Core Team | Initial comprehensive Technical Implementation Plan covering architecture setup, authentication, conversation management, AI dual fallback, and academic milestones. |


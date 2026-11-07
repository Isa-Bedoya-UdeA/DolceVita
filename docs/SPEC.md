# Product Specification

## Document Information

| Field | Value |
| --- | --- |
| Project | `CodeChef-AI-Chat (Dolce Vita)` |
| Document | Product Specification |
| Version | 1.0.0 |
| Status | Approved |
| Last Updated | 2026-11-06 |
| Product Owner | Academic Engineering Team / Juan Pablo Arango (Docente UdeA) |
| Target Platform(s) | Web (Responsive: Desktop, Tablet, Mobile) |

## Related Documentation

- [ARCHITECTURE](ARCHITECTURE.md)
- [REQUIREMENTS](REQUIREMENTS.md)
- [PLAN](PLAN.md)
- [DATABASE](DATABASE.md)
- [API](API.md)
- [SECURITY](SECURITY.md)
- [DEPLOY](DEPLOY.md)
- [DESIGNSYSTEM](DESIGNSYSTEM.md)

---

## 1. Overview

### 1.1 Product Summary

**Dolce Vita** is a responsive full-stack web application designed to connect users with **George**, an artificial intelligence culinary expert assistant.

The application delivers an end-to-end interactive conversational experience where users can ask questions about recipes, culinary techniques, ingredient substitutions, dietary adaptations, flavor pairings, and kitchen workflows. George responds with deep domain expertise, employing structured Markdown formatting (ingredient tables, step-by-step instructions, chef tips, and cooking temperatures) while strictly maintaining conversational boundaries focused on gastronomy.

Behind the interface, Dolce Vita integrates persistent conversation history, message branching/editing, response ratings, administrative user management, dynamic assistant configuration, and a high-availability dual-provider AI engine leveraging OpenRouter as primary and Groq as automatic fallback.

### 1.2 Problem Statement

Cooking enthusiasts, culinary students, and home cooks frequently encounter significant hurdles when preparing meals:

1. **Unreliable Generic AI Advice:** General-purpose AI models often provide imprecise measurements, omit critical timing details, or hallucinate impossible ingredient substitutes without considering culinary chemistry.
2. **Lack of Specialized Structure:** Standard chat platforms present dense walls of unstructured text, making recipes difficult to follow while actively cooking in a busy kitchen environment.
3. **Absence of Contextual Conversational Memory:** Existing recipe websites lack interactive personalization, while generic chat tools do not organize culinary consultations into structured, persistent, and editable recipe sessions.
4. **Reliability and Latency Barriers:** Free-tier AI services frequently suffer from rate limits (HTTP 429) or sudden downtime, breaking the cooking workflow when immediate culinary guidance is needed.

Dolce Vita resolves these problems by providing a purpose-built culinary assistant with structured formatting, persistent history, user feedback loops, and an automated multi-provider fallback engine that guarantees reliable assistance.

### 1.3 Target Users

| User | Description | Primary Goal |
| --- | --- | --- |
| **Home Cook & Enthusiast** | Individuals looking for daily meal ideas, pantry ingredient substitutions, and step-by-step cooking techniques. | Obtain immediate, reliable recipes and practical ingredient substitutions based on available ingredients. |
| **Culinary Student** | Learners studying classical culinary techniques, French/Italian terminology, knife skills, and food science. | Deepen technical understanding of culinary fundamentals and thermal transformations. |
| **Dietary-Restricted Diner** | Users requiring gluten-free, vegan, allergen-free, or low-sodium adaptations without sacrificing flavor. | Receive safe, delicious recipe modifications tailored to specific nutritional boundaries. |
| **System Administrator (`ADMIN`)** | Platform operators responsible for system health, user access control, and assistant fine-tuning. | Manage accounts, adjust George's personality/prompt parameters, and review system performance metrics. |

### 1.4 Product Context

Dolce Vita operates as a self-contained, cloud-hosted web application accessible from modern web browsers on desktop, tablet, and mobile devices.

The application interacts with:

- **Supabase PostgreSQL:** Stores user identities, password hashes, conversations, messages, revisions, feedback, and active prompt configurations.
- **OpenRouter API:** Serves as the primary intelligence pipeline, dynamically accessing high-performance language models.
- **Groq API:** Serves as a high-speed inference fallback pipeline, activated automatically whenever OpenRouter encounters network issues or quota limits.
- **Vercel Platform:** Provides global edge asset delivery, serverless Route Handler execution, and zero-downtime deployment.

### 1.5 Product Vision

To become the quintessential digital culinary companion: an approachable, knowledgeable, and structurally flawless assistant that inspires confidence in every kitchen, celebrating Italian and Mediterranean gastronomy while mastering global culinary arts.

### 1.6 Product Goals

- **Domain Excellence:** Deliver accurate, safe, and engaging gastronomic guidance through specialized prompt engineering and conversational context.
- **Seamless User Experience:** Offer a responsive, distraction-free conversational interface supporting Markdown tables, checklists, copy actions, and message editing.
- **High Operational Resilience:** Guarantee assistant responsiveness through transparent dual-provider fallback mechanisms.
- **Complete Academic Delivery:** Fulfill all pedagogical requirements of "Taller 2" and "Proyecto IA" for the Ingeniería Web course at Universidad de Antioquia.

---

## 2. Product Scope

### 2.1 In Scope

Dolce Vita encompasses the following core functional areas:

- **Public Landing Page:** Engaging brand introduction showcasing George's specialization, capabilities, and entry points for registration and login.
- **User Authentication & Session Management:** Email and password registration, secure login, persistent HTTP-only sessions via Auth.js, and logout.
- **Role-Based Access Control:** Strict segregation between standard authenticated users (`USER`) and administrators (`ADMIN`).
- **Interactive Conversational UI:** Real-time chat interface featuring message history, loading states, and error handling.
- **Conversation Management:** Create new chats, list historical sessions sorted by activity, rename conversations, and permanently delete chats.
- **Rich Markdown Formatting:** Rendering headings, bold text, ingredient tables, numbered recipe steps, and tip callouts via `react-markdown`.
- **Advanced Message Operations:** In-place user message editing with subsequent response regeneration, single-click message copying, retry actions, and positive/negative rating feedback.
- **Specialized AI Personality (George):** System prompt defining George's culinary identity, boundaries, tone, safety warnings, and Italian/international culinary knowledge.
- **Dual-Provider Fallback Architecture:** Automatic server-side fallback from OpenRouter to Groq on network timeouts (30s), rate limits (429), or server errors (5xx).
- **Administrative Control Panel:** User listing, role modification, dynamic assistant prompt editing, and global platform usage analytics.
- **Theming & Accessibility:** Full light and dark mode support with accessible contrast ratios adhering to the Dolce Vita Design System.

### 2.2 Out of Scope

The following features are explicitly excluded from the current product scope:

- Multi-assistant selector (the application is exclusively dedicated to George).
- Direct grocery ordering, e-commerce, or restaurant reservation systems.
- Native mobile application binaries (iOS / Android app store packages).
- Social sharing feeds or public conversation publication.
- Custom model training or fine-tuning infrastructure.
- Image recognition for refrigerator/pantry photo analysis.

### 2.3 Scope Boundaries

- **Authentication Boundary:** Only local credentials (email and password) managed via Auth.js and Prisma Adapter are within scope; third-party OAuth providers are optional architectural extensions.
- **API Boundary:** Next.js Route Handlers constitute the complete backend API; no auxiliary Express or NestJS microservices are utilized.
- **Persistence Boundary:** Database interactions are strictly conducted via Prisma ORM connected to Supabase PostgreSQL; no client-side database synchronization is implemented.

### 2.4 Scope Management

All proposed scope modifications must be evaluated against the academic timeline and grading rubrics of "Taller 2" (10%) and "Proyecto IA" (20%). Enhancements must never compromise core rubric deliverables: full-stack integration, authentication, conversation persistence, specialized AI inference, and deployment.

---

## 3. Functional Overview

### 3.1 Functional Area — Authentication and Identity

Enables visitors to create an account, authenticate securely, maintain active sessions, and access role-specific functionality. Passwords are encrypted with `bcryptjs`, and sessions are protected against client-side tampering.

### 3.2 Functional Area — Conversation and History Management

Provides authenticated users with private, persistent conversation workspaces. Users can create multiple separate culinary conversations (e.g., "Sourdough Bread Experiment", "Tuscan Pasta Dinner"), view previous chats in a chronological sidebar, rename chat titles, and permanently delete unwanted histories.

### 3.3 Functional Area — Conversational Interface and Message Operations

The primary workspace where users communicate with George. Supports rich Markdown rendering, real-time loading feedback, error recovery, message copying, message editing with branch regeneration, retry mechanisms, and feedback ratings (`POSITIVE` or `NEGATIVE`).

### 3.4 Functional Area — Specialized Gastronomic Intelligence (George)

George acts as an authoritative, passionate culinary expert. He provides structured culinary advice, highlights culinary safety (temperatures, raw meat, allergens), offers pantry-based substitutions, and gracefully declines questions outside the domain of gastronomy.

### 3.5 Functional Area — Administration, Configuration, and Metrics

Provides authorized administrators (`ADMIN`) with oversight tools to inspect registered users, reassign roles, dynamically update George's system prompt without restarting the application, and monitor platform health metrics.

---

## 4. Core Features

### F-001 — User Authentication and Session Management

#### 4.1.1 Purpose

Secure user identities and protect private conversational records.

#### 4.1.2 Description

Users register with name, email, and password. The system validates input via Zod, verifies email uniqueness in Supabase, and stores passwords as bcrypt hashes. Upon authentication, an encrypted session cookie is issued.

#### 4.1.3 Primary Users

- Home Cook, Culinary Student, Administrator.

#### 4.1.4 Expected Outcome

Visitors authenticate securely and gain access to their private conversation dashboard.

#### 4.1.5 Related User Flows

- `UF-001` — Registration and Login.

#### 4.1.6 Related Requirements

- `REQUIREMENTS.md`: `FR-001`, `FR-002`, `FR-003`, `NFR-003`.

---

### F-002 — Conversational Chat Interface with George

#### 4.2.1 Purpose

Deliver an intuitive, real-time messaging interface for gastronomic consultation.

#### 4.2.2 Description

Users type culinary questions into a multiline input box. Submitting a prompt sends the request to `/api/messages`, displays an optimistic user message bubble, triggers a subtle animated cooking/loading indicator, and displays George's response formatted in Markdown upon completion.

#### 4.2.3 Primary Users

- Home Cook, Culinary Student, Dietary-Restricted Diner.

#### 4.2.4 Expected Outcome

Users receive fast, structured culinary responses tailored to their specific prompts.

#### 4.2.5 Related User Flows

- `UF-002` — Send Culinary Question.

#### 4.2.6 Related Requirements

- `REQUIREMENTS.md`: `FR-009`, `FR-010`, `FR-011`, `FR-016`.

---

### F-003 — Conversation History and Session Management

#### 4.3.1 Purpose

Enable organized tracking and retrieval of distinct culinary topics over time.

#### 4.3.2 Description

Provides a responsive sidebar displaying all conversations owned by the user, sorted with the most recently active at the top. Allows creating new conversations, inline renaming of titles, and deleting conversations with cascading removal of messages.

#### 4.3.3 Primary Users

- All authenticated users.

#### 4.3.4 Expected Outcome

Users easily navigate between distinct cooking sessions and keep their workspace organized.

#### 4.3.5 Related User Flows

- `UF-003` — Manage Conversation History.

#### 4.3.6 Related Requirements

- `REQUIREMENTS.md`: `FR-005`, `FR-006`, `FR-007`, `FR-008`, `NFR-004`.

---

### F-004 — Advanced Message Actions (Edit, Retry, Copy, Rate)

#### 4.4.1 Purpose

Give users total control over their conversational flow and provide feedback on response quality.

#### 4.4.2 Description

Users can copy any message text with one click. If a user made a typo or wants to refine a recipe request, they can edit their previous message; the system archives the original text in `MessageRevision`, truncates subsequent messages, and generates a fresh response. Users can also retry the last response or submit thumbs-up / thumbs-down ratings with optional commentary.

#### 4.4.3 Primary Users

- All authenticated users.

#### 4.4.4 Expected Outcome

High flexibility in steering conversations and continuous collection of quality signals.

#### 4.4.5 Related User Flows

- `UF-004` — Edit Message and Regenerate.
- `UF-005` — Rate Response.

#### 4.4.6 Related Requirements

- `REQUIREMENTS.md`: `FR-012`, `FR-013`, `FR-014`, `FR-015`.

---

### F-005 — Specialized Gastronomic System Prompt & Behavior

#### 4.5.1 Purpose

Ensure George's persona remains authentically culinary, knowledgeable, safe, and engaging.

#### 4.5.2 Description

The backend injects an authoritative system prompt into every AI inference call. George speaks with the warmth and precision of a seasoned executive chef, prioritizes ingredient substitutions, explains culinary science (e.g. Maillard reaction, emulsification), warns about food safety hazards, and politely refuses out-of-domain inquiries (e.g., programming, politics, medical advice).

#### 4.5.3 Primary Users

- All users interacting with George.

#### 4.5.4 Expected Outcome

Consistent, high-quality culinary consultation that adheres to academic evaluation standards.

#### 4.5.5 Related User Flows

- `UF-002`, `UF-007` — Out-of-Domain and Uncertainty Handling.

#### 4.5.6 Related Requirements

- `REQUIREMENTS.md`: `FR-017`, `FR-018`.

---

### F-006 — Dual-Provider AI Fallback Engine

#### 4.6.1 Purpose

Guarantee continuous application availability regardless of third-party API instability.

#### 4.6.2 Description

When a user prompt is processed, the backend attempts inference via OpenRouter. If OpenRouter returns an HTTP 429 rate limit, 5xx server error, or exceeds the 30-second timeout, the `AIOrchestrator` immediately catches the error and executes the request through Groq. The client receives the response seamlessly, with metadata indicating which provider fulfilled the request.

#### 4.6.3 Primary Users

- All users; System Administrators.

#### 4.6.4 Expected Outcome

Zero user-facing disruption during external provider outages.

#### 4.6.5 Related User Flows

- `UF-002` — Send Culinary Question.

#### 4.6.6 Related Requirements

- `REQUIREMENTS.md`: `NFR-002`, `NFR-010`.

---

### F-007 — Administrative Control Panel & Metrics

#### 4.7.1 Purpose

Allow platform operators to oversee system activity, manage users, and adjust assistant instructions.

#### 4.7.2 Description

Accessible exclusively to users with the `ADMIN` role. Features:

1. User table with role reassignment (`USER` <-> `ADMIN`).
2. Live editor for George's active `AssistantConfig` system prompt.
3. Statistics dashboard displaying total registered users, active conversations, total messages, positive/negative rating ratios, and AI fallback frequency.

#### 4.7.3 Primary Users

- Administrators (`ADMIN`).

#### 4.7.4 Expected Outcome

Full operational governance without requiring manual database intervention.

#### 4.7.5 Related User Flows

- `UF-006` — Administrative Operations.

#### 4.7.6 Related Requirements

- `REQUIREMENTS.md`: `FR-019`, `FR-020`, `FR-021`.

---

### F-008 — Responsive Theme Support (Light & Dark)

#### 4.8.1 Purpose

Provide visual comfort and accessibility in varying lighting conditions (e.g., cooking in a bright kitchen vs. evening meal planning).

#### 4.8.2 Description

Implements the Dolce Vita Design System using semantic Tailwind tokens (warm neutrals with terracotta/saffron accents). Users can toggle between Light and Dark themes, with preferences persisted in local storage and applied smoothly without layout shift.

#### 4.8.3 Primary Users

- All users.

#### 4.8.4 Expected Outcome

Comfortable, accessible visual presentation meeting WCAG 2.1 AA standards.

#### 4.8.5 Related User Flows

- All flows.

#### 4.8.6 Related Requirements

- `REQUIREMENTS.md`: `NFR-005`, `NFR-006`, `NFR-007`.

---

## 5. User Flows

### UF-001 — User Registration and First Login

#### 5.1.1 Actor

Unauthenticated visitor.

#### 5.1.2 Trigger

Clicking "Registrarse" or "Empezar Ahora" on the landing page.

#### 5.1.3 Preconditions

Visitor possesses a valid, unassociated email address.

#### 5.1.4 Main Flow

1. Visitor navigates to `/register`.
2. Form prompts for Display Name, Email, and Password.
3. Visitor submits the form.
4. Client validates inputs with Zod; server verifies email uniqueness and hashes password.
5. User record is created in Supabase with default role `USER`.
6. Visitor is redirected to `/login` with a success toast.
7. Visitor enters credentials and clicks "Iniciar Sesión".
8. Server verifies password hash and issues an encrypted session cookie.
9. User is redirected to `/chat`.

#### 5.1.5 Alternative Flows

- User already has an account: clicks "Iniciar Sesión" directly from the landing page.

#### 5.1.6 Error / Edge Flows

- Email already registered: system displays an inline error: "Este correo ya está registrado".
- Password under 8 characters: client blocks submission with validation message.

#### 5.1.7 Success Outcome

User arrives at `/chat` with an active, authenticated session.

#### 5.1.8 Related Features

- `F-001`.

---

### UF-002 — Ask a Gastronomic Question to George

#### 5.2.1 Actor

Authenticated user (`USER` or `ADMIN`).

#### 5.2.2 Trigger

Typing a culinary question (e.g., "¿Cómo hacer un risotto de hongos perfecto?") and pressing Enter or clicking "Enviar".

#### 5.2.3 Preconditions

User is logged in and viewing an active conversation.

#### 5.2.4 Main Flow

1. User enters prompt in the chat input.
2. User submits message.
3. Message immediately appears in the message list with `PENDING` status.
4. Input field clears and animated loading indicator appears.
5. Backend Route Handler `/api/messages` validates payload and saves user message in PostgreSQL.
6. `AIOrchestrator` compiles conversation history + system prompt and sends to OpenRouter.
7. OpenRouter returns response text.
8. Backend saves assistant message in PostgreSQL and returns JSON to client.
9. UI displays George's response with rich Markdown formatting (ingredient table, numbered instructions, chef tip).

#### 5.2.5 Alternative Flows

- OpenRouter times out or returns HTTP 429: `AIOrchestrator` automatically invokes Groq. Response is delivered seamlessly without user intervention.

#### 5.2.6 Error / Edge Flows

- Both AI providers fail: UI displays an error banner with a "Reintentar" button.
- Network connection drops: toast notifies user of connectivity failure.

#### 5.2.7 Success Outcome

User receives complete, actionable, beautifully formatted culinary instructions.

#### 5.2.8 Related Features

- `F-002`, `F-005`, `F-006`.

---

### UF-003 — Review and Manage Conversation History

#### 5.3.1 Actor

Authenticated user.

#### 5.3.2 Trigger

Clicking on a previous conversation in the sidebar or clicking "Nueva Conversación".

#### 5.3.3 Preconditions

User has at least one existing conversation.

#### 5.3.4 Main Flow

1. User views sidebar showing list of chats with titles and timestamps.
2. User clicks a conversation title.
3. Router loads `/chat/[id]`.
4. Client fetches all messages associated with the conversation in chronological order.
5. User clicks the options menu ("...") next to the conversation title:
   - Selects "Renombrar": inline input allows typing a new title, saved on Enter.
   - Selects "Eliminar": modal dialog asks for confirmation. Confirming triggers cascading delete in database and redirects user to `/chat`.

#### 5.3.5 Success Outcome

User efficiently navigates between distinct culinary inquiries.

#### 5.3.6 Related Features

- `F-003`.

---

### UF-004 — Edit Message and Regenerate Response

#### 5.4.1 Actor

Authenticated user.

#### 5.4.2 Trigger

Clicking the "Editar" icon on a previously sent user message.

#### 5.4.3 Preconditions

Target message exists and was sent by the current user.

#### 5.4.4 Main Flow

1. Message bubble converts into an editable text area populated with original text.
2. User updates the text (e.g. changing "sin cebolla" to "sin ajo y sin cebolla") and clicks "Guardar y regenerar".
3. Backend records previous content in `MessageRevision`.
4. Backend deletes or archives subsequent assistant messages following this prompt.
5. Backend invokes `AIOrchestrator` with updated context.
6. Client updates message text with an "(editado)" label and renders the newly generated assistant response.

#### 5.4.5 Success Outcome

Conversation context reflects the user's revised request accurately.

#### 5.4.6 Related Features

- `F-004`.

---

### UF-005 — Submit Response Feedback

#### 5.5.1 Actor

Authenticated user.

#### 5.5.2 Trigger

Clicking the Thumbs Up or Thumbs Down icon below an assistant response.

#### 5.5.3 Preconditions

Target message was generated by George.

#### 5.5.4 Main Flow

1. User clicks Thumbs Up (positive) or Thumbs Down (negative).
2. UI highlights selected icon immediately.
3. If negative, an optional dialog prompts: "¿Cómo puede George mejorar esta receta?".
4. Client posts rating and optional comment to `/api/feedback`.
5. Database upserts record in `MessageFeedback`.
6. Success toast confirms: "¡Gracias por tu opinión!".

#### 5.5.5 Success Outcome

System stores quality metrics for administrator analysis.

#### 5.5.6 Related Features

- `F-004`, `F-007`.

---

### UF-006 — Administrative Operations and Assistant Tuning

#### 5.6.1 Actor

Administrator (`ADMIN`).

#### 5.6.2 Trigger

Navigating to `/admin` via the user avatar menu.

#### 5.6.3 Preconditions

User account has `role === 'ADMIN'`.

#### 5.6.4 Main Flow

1. Admin lands on `/admin` dashboard.
2. Overview cards show: Total Users, Total Conversations, Total Messages, Feedback Sentiment Ratio (% positive), and Fallback Trigger Count.
3. Admin clicks "Configuración de George":
   - Text area displays active system prompt.
   - Admin modifies prompt to emphasize pastry techniques or specific wine pairings.
   - Admin clicks "Guardar Cambios".
   - Backend updates `AssistantConfig` record; all subsequent conversations immediately utilize the new prompt.
4. Admin clicks "Gestión de Usuarios":
   - Table displays users, emails, roles, and join dates.
   - Admin can promote a user to `ADMIN` or demote an admin to `USER`.

#### 5.6.5 Success Outcome

Platform parameters updated without application downtime.

#### 5.6.6 Related Features

- `F-007`.

---

### UF-007 — Out-of-Domain and Uncertainty Handling

#### 5.7.1 Actor

Authenticated user.

#### 5.7.2 Trigger

User submits a prompt completely unrelated to gastronomy (e.g., "¿Cómo escribo un script en Python?" or "¿Quién ganó las elecciones?").

#### 5.7.3 Main Flow

1. User submits non-culinary prompt.
2. George processes prompt against specialized culinary instructions.
3. George politely declines:
   > *"Como George, tu asistente gastronómico personal, mi pasión y conocimiento se limitan al fascinante mundo de la cocina, las recetas, técnicas culinarias y maridajes. No puedo ayudarte con temas ajenos a la gastronomía. Pero dime, ¿te gustaría que preparemos algún platillo hoy?"*

4. No error is thrown; conversational integrity is maintained.

#### 5.7.4 Success Outcome

Assistant boundaries demonstrated clearly in accordance with academic test criteria.

#### 5.7.5 Related Features

- `F-005`.

---

## 6. Product Rules

### 6.1 Business Constraints

- **BC-001 (Single Assistant Focus):** The application is exclusively configured for George. No multi-assistant customization is provided to end users.
- **BC-002 (Non-Commercial Academic Scope):** The platform is created for pedagogical demonstration in Web Engineering; transactions, orders, and monetized subscriptions are prohibited.
- **BC-003 (Evaluation Ready):** The platform must include a seeded administrator account for academic evaluation by docente Juan Pablo Arango.

### 6.2 User Interaction Rules

- **UIR-001 (Input Length Boundaries):** User messages must be between 1 and 4,000 characters.
- **UIR-002 (Title Generation):** When a new conversation is started, its title defaults to the first 40 characters of the initial prompt, editable at any time.
- **UIR-003 (Feedback Singularity):** A user may submit exactly one rating per assistant message, but may update their rating at will.

### 6.3 Data and Behavior Rules

- **DBR-001 (Ownership Isolation):** Users can only query, edit, or delete conversations and messages linked to their own `userId`.
- **DBR-002 (Cascading Integrity):** Deleting a conversation permanently purges all child messages, revisions, and feedback entries.
- **DBR-003 (Immutable Historical Revisions):** Once written to `MessageRevision`, historical edit snapshots cannot be modified.

### 6.4 Automation and AI Rules

- **AIR-001 (Specialized System Prompt):** Every AI request must prepend the active system prompt retrieved from `AssistantConfig`.
- **AIR-002 (Culinary Safety Warnings):** When discussing high-risk ingredients (raw eggs, poultry, wild mushrooms, seafood, allergen cross-contact), George must explicitly state food safety warnings and internal cooking temperatures.
- **AIR-003 (Structured Markdown Output):** Recipe outputs must structure content into:
  1. Introduction / Culinary Background.
  2. Ingredient Table with exact units.
  3. Step-by-Step Preparation Steps.
  4. Chef Tips & Substitution Suggestions.
- **AIR-004 (Strict Fallback Sequencing):** If OpenRouter fails with HTTP 429, 5xx, or 30s timeout, Groq must be invoked immediately with the identical message context.

---

## 7. Product Prioritization

### 7.1 MVP (Taller 2 — 10%)

The Minimum Viable Product establishes the complete full-stack architecture, user authentication, responsive design, data persistence, and conversational workflows with simulated AI responses.

The MVP includes:

- Responsive UI with Dolce Vita Design System (Light / Dark themes).
- User registration, login, and Auth.js session handling.
- Role segregation (`ADMIN` vs `USER`).
- PostgreSQL persistence via Prisma (Users, Conversations, Messages).
- Conversation CRUD (create, read, rename, delete).
- Chat interface with simulated gastronomic responses mimicking George's formatting.
- Basic administrative views.

#### MVP End-to-End Flow

```text
Visitor lands on home page
          ↓
Registers new account and logs in
          ↓
Creates new conversation in dashboard
          ↓
Submits culinary question
          ↓
Receives structured simulated response
          ↓
Refreshes page; conversation and messages persist
```

### 7.2 Final Release (Proyecto IA — 20%)

The complete academic deliverable incorporates real model inference, prompt engineering, fallback resilience, and administrative intelligence:

- Real LLM integration via OpenRouter API.
- Automatic fallback integration via Groq API.
- Dynamic `AssistantConfig` system prompt tuning from `/admin`.
- Message editing with historical revision persistence and response regeneration.
- Response retry and copy actions.
- Feedback rating system (`POSITIVE` / `NEGATIVE`) with administrative stats.
- 10-Question Test Battery covering domain, out-of-domain, and uncertainty cases.
- Live public deployment on Vercel with cloud database.

### 7.3 Stretch Features (Post-Academic)

- Voice transcription for hands-free kitchen voice queries.
- PDF / Printable recipe card export.
- Nutritional estimation calculation.

### 7.4 Out of Scope

- Native mobile applications.
- E-commerce and grocery purchasing.
- Third-party social network logins.

---

## 8. Constraints

### 8.1 Time and Resources

- **Team Size:** 3 Web Engineering students.
- **Final Deadline:** Sunday, November 29, 2026, 11:59 PM.
- **Budget:** Zero budget; relies strictly on free tiers of Vercel, Supabase, OpenRouter, and Groq.

### 8.2 Academic Requirements

- Course: Ingeniería Web (Universidad de Antioquia).
- Docente: Juan Pablo Arango.
- Must deliver public GitHub repository, live deployed application, comprehensive README, test demonstration evidence, and secured secrets.

### 8.3 Technical Constraints

- Monolithic Next.js with App Router and TypeScript.
- Tailwind CSS for styling.
- Prisma ORM accessing Supabase PostgreSQL.
- API keys must never reach the client browser.

### 8.4 Platform Constraints

- Vercel Serverless Function execution limits (10-second default on free tier, configured up to max allowable limit; 30s client abort timeout).
- Free-tier rate limits on OpenRouter and Groq APIs.

### 8.5 External Dependencies

| Dependency | Purpose | Impact if Unavailable |
| --- | --- | --- |
| **Vercel** | Web hosting and serverless execution | Application inaccessible |
| **Supabase** | Cloud PostgreSQL storage | Read/write errors; chat persistence unavailable |
| **OpenRouter** | Primary AI generation pipeline | Automatically routed to Groq fallback |
| **Groq** | Secondary AI generation pipeline | AI generation fails if OpenRouter also down |

### 8.6 Delivery Milestones

| Milestone | Target Period | Expected Deliverables |
| --- | --- | --- |
| **Milestone 1 (Taller 2 - 10%)** | Mid-term checkpoint | Responsive UI, Auth, Roles, Supabase DB, Conversation CRUD, Simulated AI. |
| **Milestone 2 (Proyecto IA - 20%)** | Nov 29, 2026, 11:59 PM | Real LLM integration, System Prompt, Context window, Fallback, Admin panel, Evaluation tests, Live Vercel deployment. |

---

## 9. Assumptions and Dependencies

### 9.1 Assumptions

- Evaluators possess a modern desktop or mobile web browser with JavaScript enabled.
- Free-tier models (e.g. `openrouter/free` or `openai/gpt-oss-20b`) remain accessible throughout grading.
- Supabase PostgreSQL maintains connectivity without IP whitelisting restrictions.

### 9.2 Dependencies

- Active API keys for OpenRouter and Groq.
- Node.js 20.x runtime and pnpm package manager.

### 9.3 Risks to Product Scope

| Risk | Potential Impact | Mitigation / Response |
| --- | --- | --- |
| **OpenRouter Free Model Deprecation** | Primary AI generation fails | Dynamic model ID configuration via environment variables + automated Groq fallback. |
| **Vercel Function Timeout on Long Prompts** | Response cuts off or returns 504 | Prompt optimization, max token constraints, and 30s abort controllers. |
| **Database Connection Pool Exhaustion** | Latency spikes on concurrent queries | Supabase PgBouncer pooled connection string (`DATABASE_URL`). |

---

## 10. Edge Cases and Exceptional Scenarios

### 10.1 Scenario: Out-of-Domain Inquiries

- **Condition:** User asks George to write Python code, explain quantum physics, or give medical advice.
- **Expected Behavior:** George responds warmly in character, stating his culinary boundaries and offering to discuss cooking instead.

### 10.2 Scenario: Primary AI Provider Quota Exhaustion (HTTP 429)

- **Condition:** OpenRouter returns HTTP 429 Too Many Requests during high traffic.
- **Expected Behavior:** `AIOrchestrator` catches status 429, logs a fallback warning, and immediately sends the request to Groq without notifying or disrupting the user.

### 10.3 Scenario: Message Edited in the Middle of a Long Thread

- **Condition:** User edits message #2 in an 8-message conversation.
- **Expected Behavior:** Message #2's original text is archived in `MessageRevision`. Messages #3 through #8 are truncated, and George generates a new response based strictly on messages #1 and the updated #2.

### 10.4 Scenario: Food Safety & Dangerous Ingestion

- **Condition:** User asks whether spoiled meat or unknown wild mushrooms can be safely cooked.
- **Expected Behavior:** George issues an unambiguous safety warning: *"Ante la duda, deséchalo. El calor no destruye todas las toxinas bacterianas."* George refuses to encourage dangerous consumption.

---

## 11. Product Success Criteria

| Metric | Target | Measurement Method |
| --- | --- | --- |
| **Rubric Compliance** | 100% of Taller 2 & Proyecto IA requirements | Evaluation against teacher grading sheet |
| **AI Specialization Precision** | 100% adherence to culinary domain in 10-question test battery | Academic demonstration test results |
| **Fallback Success Rate** | 100% successful recovery from simulated OpenRouter outage | Automated MSW tests and live demonstration |
| **Lighthouse Performance** | >= 90 in Performance, Accessibility, Best Practices | Chrome DevTools Lighthouse audit |

### 11.1 Acceptance Criteria

- [ ] Registered user can log in, create a chat, ask a recipe question, and receive a formatted response.
- [ ] User can rename and delete conversations.
- [ ] User can edit a message and trigger response regeneration.
- [ ] Thumbs-up/down feedback can be submitted and viewed in the admin dashboard.
- [ ] Admin can modify George's system prompt and observe immediate behavioral change.
- [ ] System automatically falls back to Groq when OpenRouter fails.
- [ ] Live deployment accessible over public HTTPS URL.

---

## 12. Traceability

| Feature | User Flow | Requirements | Priority |
| --- | --- | --- | --- |
| `F-001` (Auth & RBAC) | `UF-001` | `FR-001`, `FR-002`, `FR-003`, `NFR-003` | Must (Taller 2) |
| `F-002` (Chat UI) | `UF-002` | `FR-009`, `FR-010`, `FR-011`, `FR-016` | Must (Taller 2 / Proyecto IA) |
| `F-003` (Conversation CRUD) | `UF-003` | `FR-005`, `FR-006`, `FR-007`, `FR-008` | Must (Taller 2) |
| `F-004` (Edit, Retry, Feedback) | `UF-004`, `UF-005` | `FR-012`, `FR-013`, `FR-014`, `FR-015` | Should (Proyecto IA) |
| `F-005` (George Specialization) | `UF-002`, `UF-007` | `FR-017`, `FR-018` | Must (Proyecto IA) |
| `F-006` (Dual AI Fallback) | `UF-002` | `NFR-002`, `NFR-010` | Must (Proyecto IA) |
| `F-007` (Admin Panel & Stats) | `UF-006` | `FR-019`, `FR-020`, `FR-021` | Must (Taller 2 / Proyecto IA) |
| `F-008` (Design System / Themes) | All | `NFR-005`, `NFR-006`, `NFR-007` | Must (Taller 2) |

---

## 13. Open Questions

- [x] **Primary AI Provider:** OpenRouter selected for model flexibility and free-tier access.
- [x] **Fallback AI Provider:** Groq selected for ultra-fast inference speed and compatible API structure.
- [x] **Authentication Mechanism:** Auth.js (NextAuth v5) with Prisma Adapter and credentials hashing (`bcryptjs`) selected to maintain unified PostgreSQL storage.
- [x] **Markdown Engine:** `react-markdown` + `remark-gfm` + `rehype-highlight` selected for secure, rich table and recipe rendering.

---

## 14. Related Documentation

| Document | Responsibility |
| --- | --- |
| `ARCHITECTURE.md` | Modular layered monolith architecture and system boundaries |
| `REQUIREMENTS.md` | Testable functional and non-functional requirements |
| `PLAN.md` | Step-by-step implementation plan and delivery phases |
| `DATABASE.md` | Relational schema, Prisma models, and PostgreSQL constraints |
| `API.md` | Authoritative REST-oriented HTTP API specifications |
| `SECURITY.md` | Security model, threat mitigations, and access control |
| `DEPLOY.md` | Build, CI/CD, and Vercel hosting procedures |
| `DESIGNSYSTEM.md` | Visual tokens, UI components, and theme specifications |

---

## 15. Change Log

| Version | Date | Change | Reason |
| --- | --- | --- | --- |
| 1.0.0 | 2026-11-06 | Initial comprehensive Product Specification | Baseline product definition aligned with Taller 2 and Proyecto IA requirements. |

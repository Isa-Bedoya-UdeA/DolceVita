# Architecture

## Document Information

| Field | Value |
| --- | --- |
| Project | `CodeChef-AI-Chat (Dolce Vita)` |
| Document | Architecture |
| Version | `1.0.0` |
| Status | `Approved` |
| Last Updated | `2026-11-06` |
| Architecture Style | `Modular Layered Monolith with Feature-Based Organization` |

## Related Documentation

- [SPEC](SPEC.md)
- [REQUIREMENTS](REQUIREMENTS.md)
- [PLAN](PLAN.md)
- [DATABASE](DATABASE.md)
- [SECURITY](SECURITY.md)
- [API](API.md)

---

## 1. Purpose

This document defines the software architecture of Dolce Vita, a web-based AI culinary assistant powered by large language models.

It establishes the system's architectural style, component organization, technology boundaries, dependency rules, data flow, state management, integration mechanisms, testing strategy, and architectural constraints.

The architecture provides a consistent foundation for maintainability, modularity, testability, security, and controlled evolution. It also defines the separation of responsibilities between the client application, backend services, database infrastructure, authentication mechanisms, and external AI providers.

## 2. Architectural Drivers

| Driver | Source | Architectural Impact |
| --- | --- | --- |
| Modular maintainability | `NFR: Maintainability` | Feature-based organization and separation of concerns. |
| Type safety | `NFR: Reliability` | TypeScript across frontend and backend boundaries. |
| Data integrity | `NFR: Reliability` | PostgreSQL relational constraints and Prisma-managed persistence. |
| Authentication | `FR: Authentication` | Auth.js integration and server-side session validation. |
| Authorization | `FR: Access Control` | Resource ownership verification and centralized authorization guards. |
| Conversation persistence | `FR: Conversation Management` | Persistent conversations and messages associated with authenticated users. |
| Message management | `FR: Message Management` | Dedicated message, revision, and feedback domain models. |
| AI integration | `FR: AI Assistant` | Provider abstraction and centralized AI orchestration. |
| AI availability | `NFR: Availability` | Primary and fallback AI provider strategy. |
| Responsive interface | `NFR: Usability` | Component-based presentation and responsive layouts. |
| Theme customization | `FR: Theme Preferences` | Semantic design tokens and light/dark theme support. |
| Testability | `NFR: Testability` | Independently testable domain, application, and infrastructure components. |
| Scalability | `NFR: Scalability` | Modular monolith with explicit boundaries and independently replaceable integrations. |

## 3. Architecture Overview

### 3.1 Architectural Style

**Style:** `Modular Layered Monolith with Feature-Based Organization`

Dolce Vita follows a modular monolithic architecture. The application operates as a single deployable Next.js system, while its internal organization separates responsibilities into independent features and technical layers.

The architecture combines three complementary organizational principles:

- **Layered architecture:** Presentation, application, domain, and infrastructure responsibilities remain separated.
- **Feature-based organization:** Application capabilities are grouped by business functionality rather than exclusively by technical file type.
- **Dependency inversion:** Domain and application logic depend on abstractions rather than concrete infrastructure implementations.

The frontend uses Next.js App Router for routing, rendering, and client-side interaction. The backend uses Next.js Route Handlers as its HTTP boundary and delegates business operations to controllers, services, and repositories.

The domain layer contains business entities, rules, and contracts. Infrastructure implements persistence, authentication adapters, and external AI provider integrations.

This architecture avoids unnecessary distributed-system complexity while preserving clear boundaries between independently maintainable modules.

### 3.2 High-Level Structure

The system consists of the following major components:

| Component | Responsibility |
| --- | --- |
| Presentation Layer | User interface, layouts, reusable components, forms, and client-side interaction. |
| Application Layer | Feature orchestration, use cases, validation, and coordination of business operations. |
| Domain Layer | Core entities, business rules, domain contracts, and application-independent logic. |
| API Layer | HTTP endpoints, request handling, response serialization, and controller delegation. |
| Infrastructure Layer | Database access, authentication integration, AI providers, and external services. |
| Persistence Layer | Relational data storage through Supabase PostgreSQL and Prisma. |
| Authentication Layer | Identity management, session handling, and authorization enforcement. |
| AI Integration Layer | Provider selection, request normalization, response processing, and fallback orchestration. |

The architecture maintains a clear distinction between application-owned functionality and external infrastructure.

### 3.3 Architectural Principles

- Separation of concerns between presentation, application, domain, and infrastructure.
- Feature-based modular organization.
- Dependency inversion at infrastructure boundaries.
- Explicit ownership of user-generated resources.
- Centralized authentication and authorization enforcement.
- Centralized AI provider orchestration.
- Type-safe communication between architectural layers.
- Validation at application and external-input boundaries.
- Reusable presentation components with consistent design tokens.
- Persistence of business data through dedicated repositories.
- Independent testing of business rules and infrastructure integrations.
- No direct database access from presentation components.

## 4. Architectural Patterns

| Pattern | Problem Solved | Application | Constraints |
| --- | --- | --- | --- |
| Repository | Separates persistence from business logic. | Conversation, message, user, revision, and feedback data access. | Repositories do not contain presentation logic or application workflows. |
| Controller-Service | Separates HTTP handling from business operations. | API request processing and application orchestration. | Controllers remain thin and delegate business operations to services. |
| Dependency Injection | Reduces coupling between implementations and consumers. | Services, repositories, and external provider integrations. | Dependencies are resolved through explicit composition and typed contracts. |
| Feature-Based Modules | Organizes functionality around business capabilities. | Authentication, conversations, messages, feedback, and AI assistant. | Features respect shared architectural boundaries. |
| Provider Adapter | Isolates external AI provider implementations. | OpenRouter and Groq integrations. | Provider-specific details do not leak into domain or presentation logic. |
| DTO | Controls data exchanged across boundaries. | API requests, responses, and external provider communication. | Prisma models are not exposed directly as public API contracts. |
| MVVM-inspired Presentation | Separates UI rendering from interaction and state coordination. | Interactive chat interface and client-side components. | UI components do not implement backend business rules. |

### 4.1 Repository Pattern

#### 4.1.1 Purpose

The Repository pattern abstracts data persistence and isolates application logic from database-specific implementation details.

#### 4.1.2 Application

Repositories provide the data access interface for domain resources, including:

- Users and authentication-related records.
- Conversations.
- Messages.
- Message revisions.
- Message feedback.
- Assistant configuration.

Prisma implements the persistence operations against PostgreSQL.

Services consume repository contracts to execute business operations without depending directly on Prisma queries.

#### 4.1.3 Dependency Rules

- Services depend on repository contracts.
- Repository implementations depend on Prisma and database infrastructure.
- Domain entities and application contracts do not depend on Prisma.
- Presentation components never access repositories directly.
- Database queries and transaction management remain inside the infrastructure boundary.

### 4.2 Controller-Service Pattern

#### 4.2.1 Purpose

The Controller-Service pattern separates HTTP communication concerns from application business operations.

#### 4.2.2 Application

Route Handlers receive HTTP requests and delegate request processing to controllers.

Controllers coordinate request validation, authentication context, service invocation, and response mapping.

Services implement business workflows, enforce application-level rules, and coordinate repositories and external integrations.

#### 4.2.3 Dependency Rules

- Route Handlers delegate to controllers.
- Controllers depend on application services.
- Services depend on domain contracts and infrastructure abstractions.
- Services do not depend on HTTP request or response objects.
- Controllers do not contain database queries or provider-specific integration logic.

### 4.3 Provider Adapter Pattern

#### 4.3.1 Purpose

The Provider Adapter pattern isolates external AI services behind a consistent application-facing contract.

#### 4.3.2 Application

The AI integration layer provides a common interface for generating culinary assistant responses.

OpenRouter is the primary provider, using the `openrouter/free` model identifier. Groq is the fallback provider.

The provider orchestration service determines which provider handles a request, normalizes provider-specific responses, and manages availability-related fallback behavior.

Provider-specific request formats, authentication headers, response structures, and error codes remain inside their respective adapters.

#### 4.3.3 Dependency Rules

- AI application services depend on the provider abstraction.
- Provider adapters implement the common contract.
- Provider credentials remain in server-side environment variables.
- Provider-specific SDKs and HTTP details remain inside infrastructure.
- Provider selection and fallback policies are centralized rather than distributed across frontend components.

## 5. System Architecture

### 5.1 Technology Boundaries

| Boundary | Technology | Responsibility | Ownership |
| --- | --- | --- | --- |
| Frontend | Next.js App Router | Routing, rendering, layouts, and client interaction. | Internal |
| UI | React | Component-based interface and reactive rendering. | Internal |
| Language | TypeScript | Static typing across application boundaries. | Internal |
| Styling | Tailwind CSS | Utility-based styling and responsive presentation. | Internal |
| Validation | Zod | Runtime validation and typed input schemas. | Internal |
| Forms | React Hook Form | Form state and validation integration. | Internal |
| Notifications | Sonner | User-facing notifications and feedback. | Internal |
| Icons | lucide-react | Interface iconography. | Internal |
| Authentication | Auth.js | Identity integration and session management. | External |
| ORM | Prisma | Relational data access and schema management. | Internal |
| Database | Supabase PostgreSQL | Persistent relational storage. | External |
| AI Gateway | OpenRouter | Primary AI provider integration. | External |
| AI Provider | Groq | Fallback AI provider integration. | External |
| Testing | Vitest, Testing Library, MSW, Playwright | Automated testing at multiple levels. | Internal |
| CI/CD | GitHub Actions | Automated validation and integration workflows. | External |
| Hosting | Vercel | Application deployment and hosting. | External |

### 5.2 System Context

The system interacts with the following actors and external services:

- **User:** Authenticates, manages conversations, sends culinary questions, receives AI-generated responses, edits messages, and provides feedback.
- **Auth.js:** Manages authentication flows and session information.
- **Supabase PostgreSQL:** Stores application users, conversations, messages, revisions, feedback, and assistant configuration.
- **OpenRouter:** Provides the primary AI inference service.
- **Groq:** Provides the fallback AI inference service.

The application acts as the intermediary between the user, persistent storage, authentication infrastructure, and AI providers.

All AI provider communication originates from the server. The browser never communicates directly with external AI providers using application credentials.

### 5.3 Dependency Direction

The architecture follows a layered dependency direction:

`Presentation → API → Application → Domain`

Infrastructure implements the contracts consumed by application services and domain-independent integration boundaries.

The frontend and backend share TypeScript contracts where appropriate, but backend infrastructure remains isolated from client-side modules.

The principal backend execution path is:

`Route Handler → Controller → Service → Repository → Prisma → PostgreSQL`

AI requests follow a separate integration path:

`AI Service → Provider Orchestrator → Provider Adapter → External AI Provider`

The authentication boundary supplies verified identity and session context to protected application operations.

## 6. Frontend / Client Architecture

### 6.1 Responsibilities

The frontend is responsible for:

- Rendering the application interface and navigation.
- Managing conversation lists and active conversation views.
- Providing the chat composer and message interaction controls.
- Displaying AI responses with Markdown formatting.
- Supporting message editing, copying, retrying, and feedback.
- Managing client-side interaction state.
- Displaying loading, success, and error feedback.
- Providing responsive layouts.
- Supporting light and dark themes.
- Communicating with backend endpoints through typed request contracts.

The frontend does not implement authorization decisions, database queries, AI provider selection, or privileged operations.

### 6.2 Presentation

The presentation layer uses React components organized by feature and shared UI responsibility.

The primary interface includes:

- Application layout and navigation.
- Conversation sidebar and conversation list.
- Active conversation view.
- Message list and individual message components.
- Markdown response renderer.
- Message composer.
- Conversation management controls.
- Message action controls.
- Authentication forms.
- Feedback components.
- Theme controls.
- Reusable loading, empty, and error states.

Presentation components are separated into reusable shared components and feature-specific components.

Client components own interactive state, while server components handle server-side rendering and data access where appropriate.

Presentation styling adheres to the Dolce Vita Design System using semantic design tokens rather than hardcoded visual properties in individual components. Visual tokens, color palettes, typographic scales, spacing systems, and theme mappings are defined authoritatively in [DESIGNSYSTEM.md](DESIGNSYSTEM.md).

### 6.3 Domain

The client-facing domain layer defines the types and contracts required by frontend features.

Its responsibilities include:

- Conversation and message types.
- Message revision and feedback types.
- User-facing assistant configuration.
- Typed feature operations.
- Frontend validation schemas.
- Shared enums and application constants.

Frontend domain types remain independent of React components and Prisma database models.

Backend domain rules remain authoritative for business operations and access control.

### 6.4 Data / Infrastructure

The frontend data layer encapsulates communication with backend endpoints.

It includes:

- Typed API clients.
- Request and response DTOs.
- Request serialization.
- Response parsing.
- Error normalization.
- Client-side data fetching and mutation logic.

Feature-specific hooks coordinate API operations and client state.

The frontend never imports Prisma, database clients, authentication secrets, or server-only modules.

## 7. Backend Architecture

### 7.1 Responsibilities

The backend is responsible for:

- Authentication and session verification.
- Authorization and resource ownership.
- Conversation lifecycle operations.
- Message creation and modification.
- Message revision management.
- Message feedback management.
- AI request orchestration.
- External AI provider integration.
- Database transactions.
- Input validation and business rule enforcement.
- Error normalization and HTTP response generation.

The backend is implemented within the Next.js application as a modular monolith.

### 7.2 API Boundary

Next.js Route Handlers define the HTTP API boundary under `src/app/api`.

Each endpoint delegates its operation to the corresponding controller.

The API boundary is responsible for:

- HTTP method and route handling.
- Request body and parameter extraction.
- Authentication context propagation.
- Input validation.
- Controller invocation.
- Response serialization.
- HTTP status mapping.

API contracts use explicit request and response DTOs.

Zod validates external input before business operations execute.

Database entities and Prisma-generated types are not exposed directly through public API responses.

### 7.3 Services / Use Cases

Application services implement business workflows and coordinate domain operations.

The principal service responsibilities include:

| Service | Responsibility |
| --- | --- |
| Authentication Service | Authentication-related application operations and user context. |
| Conversation Service | Conversation creation, retrieval, renaming, and deletion. |
| Message Service | Message creation, editing, retrying, and retrieval. |
| Message Revision Service | Revision history management. |
| Message Feedback Service | Message rating and feedback operations. |
| AI Assistant Service | Culinary assistant request orchestration and response processing. |
| AI Provider Service | Provider selection, adapter invocation, and fallback management. |
| Assistant Configuration Service | Assistant configuration and provider-independent settings. |

Services coordinate repositories and integrations while keeping HTTP and presentation concerns outside business logic.

### 7.4 External Integrations

The backend integrates with the following external systems:

#### Auth.js

Auth.js provides authentication integration and session management. The Prisma Adapter persists authentication-related records in PostgreSQL.

#### Supabase PostgreSQL

Supabase provides the managed PostgreSQL database. Prisma is the application's primary database access layer.

#### OpenRouter

OpenRouter is the primary AI inference provider. The application uses the `openrouter/free` model identifier through the provider adapter.

#### Groq

Groq provides the fallback AI inference service through an independent provider adapter.

The AI integration boundary normalizes requests and responses so the rest of the application remains independent of provider-specific formats.

Fallback execution is restricted to provider availability failures, including network errors, timeouts, rate limiting, server-side failures, and unavailable models.

Application validation errors, authorization failures, invalid requests, and content-related responses do not trigger provider fallback.

External credentials remain server-side and are never included in browser bundles or client responses.

## 10. Package and Component Architecture

### 10.1 Project Structure

`	ext
dolce-vita/
├── .github/
│   └── workflows/
│       ├── build.yml
│       ├── ci.yml
│       └── deploy.yml
├── docs/
│   ├── screenshots/
│   │   └── .gitkeep
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── DEPLOY.md
│   ├── DESIGNSYSTEM.md
│   ├── PLAN.md
│   ├── REQUIREMENTS.md
│   ├── SECURITY.md
│   └── SPEC.md
├── prisma/
│   ├── migrations/
│   │   └── .gitkeep
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── icons/
│   │   └── .gitkeep
│   ├── images/
│   │   └── .gitkeep
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── logo-icon.svg
│   ├── logo.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   │   ├── assistant/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── statistics/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── chat/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── conversations/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (errors)/
│   │   │   └── forbidden/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── assistant/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── statistics/
│   │   │   │   │   └── route.ts
│   │   │   │   └── users/
│   │   │   │       ├── [userId]/
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── conversations/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── messages/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── health/
│   │   │   │   └── route.ts
│   │   │   └── messages/
│   │   │       └── [messageId]/
│   │   │           ├── feedback/
│   │   │           │   └── route.ts
│   │   │           ├── retry/
│   │   │           │   └── route.ts
│   │   │           └── route.ts
│   │   ├── error.tsx
│   │   ├── favicon.ico
│   │   ├── global-error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MainNavigation.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── shared/
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── MarkdownRenderer.tsx
│   │   └── ui/
│   │       ├── Alert.tsx
│   │       ├── Avatar.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Dialog.tsx
│   │       ├── DropdownMenu.tsx
│   │       ├── Input.tsx
│   │       ├── Spinner.tsx
│   │       ├── Textarea.tsx
│   │       ├── Toast.tsx
│   │       └── Tooltip.tsx
│   ├── features/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── AssistantConfigForm.tsx
│   │   │   │   ├── RoleSelector.tsx
│   │   │   │   ├── StatisticsCard.tsx
│   │   │   │   ├── StatisticsCards.tsx
│   │   │   │   └── UserTable.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAdminAssistant.ts
│   │   │   │   ├── useAdminStatistics.ts
│   │   │   │   └── useAdminUsers.ts
│   │   │   ├── schemas/
│   │   │   │   └── admin.schema.ts
│   │   │   └── types/
│   │   │       └── admin.type.ts
│   │   ├── assistant/
│   │   │   ├── components/
│   │   │   │   ├── AssistantAvatar.tsx
│   │   │   │   ├── AssistantBadge.tsx
│   │   │   │   └── AssistantPromptPreview.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAssistantConfig.ts
│   │   │   └── types/
│   │   │       └── assistant.type.ts
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── PasswordInput.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── schemas/
│   │   │   │   └── auth.schema.ts
│   │   │   └── types/
│   │   │       └── user.type.ts
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── ChatEmptyState.tsx
│   │   │   │   ├── ChatHeader.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   └── TypingIndicator.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useChat.ts
│   │   │   └── types/
│   │   │       └── chat.type.ts
│   │   ├── conversations/
│   │   │   ├── components/
│   │   │   │   ├── ConversationItem.tsx
│   │   │   │   ├── ConversationList.tsx
│   │   │   │   ├── ConversationSidebar.tsx
│   │   │   │   ├── DeleteConversationDialog.tsx
│   │   │   │   └── RenameConversationDialog.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useConversation.ts
│   │   │   ├── schemas/
│   │   │   │   └── conversation.schema.ts
│   │   │   ├── services/
│   │   │   │   └── conversation.service.ts
│   │   │   └── types/
│   │   │       └── conversation.type.ts
│   │   ├── feedback/
│   │   │   ├── components/
│   │   │   │   ├── FeedbackButton.tsx
│   │   │   │   ├── FeedbackDialog.tsx
│   │   │   │   └── FeedbackForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useFeedback.ts
│   │   │   ├── schemas/
│   │   │   │   └── feedback.schema.ts
│   │   │   └── types/
│   │   │       └── feedback.type.ts
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   ├── AboutSection.tsx
│   │   │   │   ├── FeaturesSection.tsx
│   │   │   │   ├── FooterSection.tsx
│   │   │   │   └── HeroSection.tsx
│   │   │   └── types/
│   │   │       └── home.type.ts
│   │   ├── messages/
│   │   │   ├── components/
│   │   │   │   ├── MessageActions.tsx
│   │   │   │   ├── MessageEditor.tsx
│   │   │   │   └── MessageFeedback.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useMessageActions.ts
│   │   │   │   └── useMessageRetry.ts
│   │   │   ├── schemas/
│   │   │   │   └── message.schema.ts
│   │   │   └── types/
│   │   │       └── message.type.ts
│   │   ├── session/
│   │   │   └── types/
│   │   │       └── session.type.ts
│   │   └── theme/
│   │       ├── components/
│   │       │   └── ThemeToggle.tsx
│   │       ├── hooks/
│   │       │   └── useTheme.ts
│   │       └── types/
│   │           └── theme.type.ts
│   ├── hooks/
│   │   ├── useAutoScroll.ts
│   │   ├── useCopyToClipboard.ts
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── api-client.ts
│   │   │   └── endpoints.ts
│   │   ├── auth/
│   │   │   ├── auth-client.ts
│   │   │   └── session.ts
│   │   ├── config/
│   │   │   ├── ai.config.ts
│   │   │   ├── auth.config.ts
│   │   │   └── environment.config.ts
│   │   ├── constants/
│   │   │   ├── app.constants.ts
│   │   │   ├── assistant.constants.ts
│   │   │   ├── roles.constants.ts
│   │   │   └── routes.constants.ts
│   │   ├── formatters/
│   │   │   ├── date.formatter.ts
│   │   │   └── message.formatter.ts
│   │   ├── permissions/
│   │   │   ├── permissions.ts
│   │   │   └── role-permissions.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── date.utils.ts
│   │       └── error.utils.ts
│   ├── server/
│   │   ├── auth/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── ownership.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── auth.ts
│   │   │   ├── config.ts
│   │   │   └── password.service.ts
│   │   ├── controllers/
│   │   │   ├── admin.controller.ts
│   │   │   ├── conversation.controller.ts
│   │   │   ├── feedback.controller.ts
│   │   │   ├── message.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── domain/
│   │   │   ├── contracts/
│   │   │   │   ├── assistant-repository.contract.ts
│   │   │   │   ├── conversation-repository.contract.ts
│   │   │   │   ├── message-repository.contract.ts
│   │   │   │   └── user-repository.contract.ts
│   │   │   ├── entities/
│   │   │   │   ├── assistant-config.entity.ts
│   │   │   │   ├── conversation.entity.ts
│   │   │   │   ├── message.entity.ts
│   │   │   │   └── user.entity.ts
│   │   │   └── enums/
│   │   │       ├── ai-provider.enum.ts
│   │   │       ├── message-role.enum.ts
│   │   │       ├── message-status.enum.ts
│   │   │       └── role.enum.ts
│   │   ├── dto/
│   │   │   ├── auth/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── conversations/
│   │   │   │   ├── create-conversation.dto.ts
│   │   │   │   └── update-conversation.dto.ts
│   │   │   ├── message/
│   │   │   │   ├── create-message.dto.ts
│   │   │   │   ├── message-response.dto.ts
│   │   │   │   └── update-message.dto.ts
│   │   │   └── user/
│   │   │       └── user-response.dto.ts
│   │   ├── exceptions/
│   │   │   ├── ai-provider.exception.ts
│   │   │   ├── app.exception.ts
│   │   │   ├── auth.exception.ts
│   │   │   ├── authorization.exception.ts
│   │   │   └── not-found.exception.ts
│   │   ├── infrastructure/
│   │   │   └── database/
│   │   │       └── prisma.ts
│   │   ├── integrations/
│   │   │   └── ai/
│   │   │       ├── adapters/
│   │   │       │   ├── groq.adapter.ts
│   │   │       │   └── openrouter.adapter.ts
│   │   │       ├── contracts/
│   │   │       │   └── ai-provider.interface.ts
│   │   │       └── orchestrator/
│   │   │           ├── ai-orchestrator.ts
│   │   │           └── ai-provider.factory.ts
│   │   ├── mappers/
│   │   │   ├── conversation.mapper.ts
│   │   │   ├── message.mapper.ts
│   │   │   └── user.mapper.ts
│   │   ├── repositories/
│   │   │   ├── assistant.repository.ts
│   │   │   ├── conversation.repository.ts
│   │   │   ├── feedback.repository.ts
│   │   │   ├── message.repository.ts
│   │   │   └── user.repository.ts
│   │   ├── services/
│   │   │   ├── ai-provider.service.ts
│   │   │   ├── assistant.service.ts
│   │   │   ├── conversation.service.ts
│   │   │   ├── feedback.service.ts
│   │   │   ├── message.service.ts
│   │   │   ├── prompt.service.ts
│   │   │   ├── statistics.service.ts
│   │   │   └── user.service.ts
│   │   └── types/
│   │       └── api-response.type.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   └── next-auth.d.ts
│   └── proxy.ts
├── tests/
│   ├── components/
│   │   ├── chat-window.test.tsx
│   │   └── login-form.test.tsx
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── chat.spec.ts
│   │   └── conversations.spec.ts
│   ├── fixtures/
│   │   ├── mock-conversations.ts
│   │   └── mock-users.ts
│   ├── integration/
│   │   ├── admin.api.test.ts
│   │   ├── auth.api.test.ts
│   │   ├── conversations.api.test.ts
│   │   └── messages.api.test.ts
│   ├── mocks/
│   │   ├── handlers.ts
│   │   └── msw-server.ts
│   ├── ui/
│   │   ├── navigation.test.tsx
│   │   └── theme-toggle.test.tsx
│   └── unit/
│       ├── ai-orchestrator.test.ts
│       ├── auth.service.test.ts
│       ├── conversation.service.test.ts
│       └── message.service.test.ts
├── .env
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── AGENTS.md
├── components.json
├── eslint.config.mjs
├── LICENSE
├── next-env.d.ts
├── next.config.ts
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prisma.config.ts
├── README.md
├── tsconfig.json
└── vitest.config.mts
`

The structure separates application routes, reusable presentation components, feature-specific frontend modules, backend services, domain contracts, and infrastructure integrations.

The `features` directory owns frontend functionality. The `server` directory owns backend business operations and infrastructure.

Shared utilities remain in `lib`, while shared TypeScript declarations remain in `types`.

### 10.2 Component Responsibilities

| Component | Responsibility | Depends On | Must Not Depend On |
| --- | --- | --- | --- |
| App Router | Routing, layouts, and page composition. | Features, shared components. | Prisma, database internals. |
| UI Components | Reusable interface primitives. | React, Tailwind CSS. | Backend services, repositories. |
| Feature Components | Feature-specific presentation and interaction. | Shared UI, feature hooks. | Prisma, external provider SDKs. |
| Feature Hooks | Client-side state and API coordination. | API clients, feature types. | Database repositories. |
| Route Handlers | HTTP request and response handling. | Controllers, authentication boundary. | Prisma queries directly. |
| Controllers | HTTP operation coordination. | Services, DTOs, mappers. | Database infrastructure. |
| Services | Business workflows and orchestration. | Domain contracts, repositories, integrations. | React, HTTP objects. |
| Domain | Entities, rules, and contracts. | Language primitives and domain abstractions. | Prisma, Next.js, React. |
| Repositories | Data access and persistence. | Prisma, domain contracts. | Presentation components. |
| AI Adapters | Provider-specific communication. | Provider APIs, AI contracts. | Frontend modules. |
| AI Orchestrator | Provider selection and fallback coordination. | AI adapter contracts. | React components. |
| Auth Guards | Session verification and authorization. | Auth.js, user context. | Client-side authorization state as sole authority. |
| Prisma Client | Database access. | PostgreSQL connection. | Presentation and domain logic. |

## 11. Data Flow

### 11.1 Primary Flow

```text
User Interaction
      ↓
React Component
      ↓
Feature Hook / API Client
      ↓
Next.js Route Handler
      ↓
Controller
      ↓
Application Service
      ↓
Repository
      ↓
Prisma
      ↓
Supabase PostgreSQL
```

The primary flow begins with a user interaction in a React component.

Feature hooks coordinate the request through a typed API client. The corresponding Route Handler receives the HTTP request and delegates it to a controller.

The controller validates and interprets the request, verifies the required authentication context, and invokes the application service.

The service executes the business operation and accesses persistent data through repository contracts.

The repository uses Prisma to execute the corresponding PostgreSQL operations.

The result returns through the same architectural layers, where it is mapped into a response DTO and delivered to the client.

AI generation follows a specialized flow:

```text
Chat Composer
      ↓
Message API
      ↓
Message Controller
      ↓
AI Assistant Service
      ↓
AI Provider Orchestrator
      ↓
Primary Provider Adapter
      ↓
OpenRouter
      ↓
Normalized AI Response
      ↓
Message Persistence
      ↓
Client Response
```

When a qualifying provider availability failure occurs, the orchestrator invokes the Groq adapter according to the fallback policy.

### 11.2 Error Flow

Errors are handled according to the layer where they originate.

- **Presentation errors:** Display appropriate feedback without exposing internal implementation details.
- **Validation errors:** Return structured validation information associated with invalid input.
- **Authentication errors:** Return unauthorized responses when a valid authenticated session is absent.
- **Authorization errors:** Return forbidden responses when the authenticated user lacks permission to access a resource.
- **Application errors:** Use explicit domain and application error types.
- **Persistence errors:** Normalize database failures before returning them through the API boundary.
- **Integration errors:** Normalize external provider failures and apply the AI provider fallback policy when eligible.
- **Unexpected errors:** Return a generic internal server error without exposing stack traces, credentials, or sensitive implementation details.

Error normalization occurs at the backend boundary. Presentation components receive predictable error structures.

### 11.3 Synchronization Flow

PostgreSQL is the authoritative persistence layer for application data.

Conversation and message operations are persisted through repositories and Prisma.

The client obtains conversation history and message information through backend endpoints. Changes made through message editing, conversation management, or feedback operations are reflected in persistent storage.

Message revision records preserve the relevant editing history.

Database transactions protect operations that require multiple related persistence changes.

The application does not maintain an independent local database or an offline synchronization mechanism.

## 12. State Management

### 12.1 State Model

Application state is divided into three categories:

#### Server State

Contains persisted information retrieved from the backend, including users, conversations, messages, revisions, and feedback.

#### Client Interaction State

Contains temporary interface information such as the active conversation, composer input, open menus, selected controls, and pending interaction states.

#### Presentation State

Contains visual preferences and interface configuration, including the active light or dark theme.

Persisted business state is authoritative on the server. Client state does not replace backend validation or authorization.

### 12.2 Reactive State

React manages component-level and shared interactive state through its reactive rendering model.

Feature hooks encapsulate reusable interaction logic and coordinate requests with the backend.

State updates trigger the necessary component re-rendering without coupling business operations to presentation components.

The active conversation and its messages remain synchronized with backend responses.

### 12.3 Loading / Success / Error States

Asynchronous operations expose explicit interface states.

| State | Responsibility |
| --- | --- |
| Idle | No operation is currently executing. |
| Loading | An operation is in progress. |
| Success | The operation completed successfully. |
| Error | The operation failed and requires user feedback. |

These states apply to authentication, conversation management, message operations, AI generation, and feedback submission.

The interface distinguishes between an empty result, an ongoing request, and an unsuccessful operation.

### 12.4 Asynchronous Execution

The application uses JavaScript asynchronous execution through `async/await` and Promises.

Asynchronous operations include:

- API requests.
- Authentication operations.
- Database access.
- External AI provider requests.
- Message persistence.
- Conversation retrieval.

Server-side asynchronous operations execute within the Next.js runtime.

Client-side asynchronous operations are coordinated through feature hooks and API clients.

The application does not require a dedicated worker or message queue for its core request-response workflows.

## 13. Additional Patterns and Rules

### 13.1 Dependency Injection

Dependencies are supplied through explicit constructor or function parameters and centralized composition.

Services consume repository and integration contracts rather than instantiating infrastructure implementations internally.

The backend composition boundary resolves Prisma-backed repositories, authentication dependencies, and AI provider adapters.

This approach supports isolated testing and replacement of infrastructure implementations without changing application business rules.

### 13.2 Mapping

Data mapping separates persistence models, domain representations, external provider responses, and API contracts.

The application uses dedicated mappers for:

- Prisma records to application-facing representations.
- Application results to response DTOs.
- Request DTOs to application inputs.
- External AI responses to normalized assistant responses.
- Domain errors to HTTP error structures.

Prisma-generated models remain inside the persistence boundary.

### 13.3 Error Handling

Error handling follows explicit responsibility boundaries.

Domain and application layers define meaningful error conditions. Infrastructure translates external failures into application-understandable errors.

Controllers and Route Handlers translate application errors into HTTP responses.

The client displays user-friendly messages and does not receive sensitive internal details.

Provider fallback is limited to qualifying availability failures. Invalid requests, authentication failures, authorization failures, and content-related responses are handled independently.

### 13.4 Concurrency

The application handles concurrent requests through the asynchronous execution model of Next.js and the database transaction mechanisms provided by Prisma and PostgreSQL.

Concurrent message and conversation operations respect resource ownership and database consistency.

Operations involving related persistent records use transactions where atomicity is required.

Message revision creation and message updates maintain a consistent relationship between the current message and its revision history.

External AI requests remain isolated from database transaction lifetimes. Database transactions are not held open while waiting for AI inference.

## 14. Testing Architecture

| Test Level | Scope | Main Purpose |
| --- | --- | --- |
| Unit | Domain rules, services, validators, mappers, and utility functions. | Verify isolated business behavior and edge cases. |
| Integration | Controllers, repositories, Prisma operations, authentication guards, and provider orchestration. | Verify interactions between architectural layers and infrastructure boundaries. |
| UI | React components, forms, chat interactions, and interface states. | Verify rendering, interaction behavior, and accessibility-related expectations. |
| E2E | Authentication, conversation management, message workflows, and assistant interactions. | Verify complete user journeys across the application. |

Vitest provides the unit and integration testing foundation.

React Testing Library verifies component behavior from the user's perspective.

MSW isolates external HTTP interactions and provides deterministic responses for tests.

Playwright validates end-to-end browser workflows.

### 14.1 Test Boundaries

The architecture defines the following testing boundaries:

- Domain logic is tested independently of the database and framework.
- Application services are tested with repository and integration test doubles.
- Repository implementations are tested against a database environment.
- Controllers are tested independently of presentation components.
- AI provider adapters are tested independently from the AI orchestration service.
- The AI orchestrator is tested with simulated provider success, failure, timeout, and fallback conditions.
- Authentication and authorization guards are tested against valid and invalid session contexts.
- React components are tested without direct backend infrastructure dependencies.
- End-to-end tests validate complete application workflows.

### 14.2 Test Doubles

The testing architecture uses:

| Test Double | Application |
| --- | --- |
| Mock | Isolated service and dependency behavior. |
| Stub | Predetermined repository or provider responses. |
| Fake | Simplified implementations of contracts when appropriate. |
| MSW Handler | Controlled HTTP responses for external and backend requests. |
| Test Database | Persistence and relational integrity verification. |

Tests do not depend on production credentials or live AI provider responses.

## 15. SOLID Principles

| Principle | Application in This Project |
| --- | --- |
| Single Responsibility | Controllers handle HTTP coordination, services handle business operations, repositories handle persistence, and adapters handle external integrations. |
| Open/Closed | AI providers and repository implementations support alternative implementations through established contracts without modifying dependent application services. |
| Liskov Substitution | Infrastructure implementations satisfy their declared contracts and remain interchangeable where the contract permits. |
| Interface Segregation | Repository and integration contracts expose focused operations rather than large interfaces containing unrelated responsibilities. |
| Dependency Inversion | Application services depend on abstractions, while infrastructure provides concrete implementations. |

## 16. Architecture Constraints

- Next.js App Router is the application routing and backend HTTP boundary.
- TypeScript is the primary application language.
- pnpm is the package manager.
- The architecture remains a modular monolith.
- Frontend features and backend modules maintain explicit boundaries.
- Domain logic does not depend on React, Next.js, Prisma, or external provider SDKs.
- Controllers do not contain database queries.
- Services do not depend on HTTP request or response objects.
- Repositories do not contain presentation or HTTP logic.
- Prisma is the primary database access layer.
- Supabase PostgreSQL is the authoritative persistent data store.
- Auth.js is responsible for authentication integration and session management.
- Protected backend operations enforce authentication and resource ownership on the server.
- External AI provider credentials remain server-side.
- OpenRouter is the primary AI provider and Groq is the fallback provider.
- AI provider selection and fallback logic remain centralized.
- Provider fallback does not conceal application validation or authorization errors.
- Public API contracts do not expose internal Prisma models.
- Client-side authorization checks never replace server-side authorization.
- Theme colors are defined through semantic design tokens.
- Light and dark themes use the same semantic token structure.
- Persistent business data is stored in PostgreSQL rather than an independent browser database.
- Database transactions protect operations requiring atomic persistence.
- Feature modules do not bypass established architectural boundaries.

## 17. Architecture Evolution

### Current Architecture

Dolce Vita operates as a modular layered monolith within a single Next.js application.

Frontend functionality is organized by features, while backend operations follow the controller-service-repository structure.

PostgreSQL provides persistent storage through Prisma. Auth.js manages authentication, and the AI integration layer abstracts OpenRouter and Groq.

The architecture supports independently testable modules without introducing distributed services or unnecessary infrastructure.

### Evolution Constraints

Architectural changes preserve the established boundaries and accommodate changes in application functionality and infrastructure.

Feature modules remain independently organized, and external integrations remain replaceable through their contracts.

The modular monolith is the approved deployment architecture. A transition to microservices is outside the scope of this architecture.

Changes to AI providers, persistence implementations, authentication mechanisms, or presentation technologies must remain isolated to their corresponding architectural boundaries.

### Migration Rules

- Preserve existing domain contracts when modifying infrastructure implementations.
- Introduce new application functionality within the corresponding feature module.
- Update affected DTOs, services, repositories, and tests when changing business operations.
- Maintain resource ownership and authorization invariants during data model changes.
- Use Prisma migrations for relational schema evolution.
- Preserve message and revision relationships during persistence changes.
- Maintain provider-independent AI service contracts when adding or replacing integrations.
- Update related technical documentation whenever a change modifies established architectural boundaries.
- Avoid introducing distributed services without a concrete requirement that justifies their operational complexity.

## 18. Architectural Decisions

| ID | Decision | Reason | Alternatives Considered |
| --- | --- | --- | --- |
| ADR-001 | Modular layered monolith. | Provides separation of concerns without unnecessary distributed-system complexity. | Microservices, traditional monolith without modular boundaries. |
| ADR-002 | Next.js App Router as frontend and backend application framework. | Provides routing, rendering, and server-side HTTP capabilities within one application. | Separate React frontend and independent backend framework. |
| ADR-003 | TypeScript across application layers. | Provides static typing and consistent contracts. | JavaScript. |
| ADR-004 | Tailwind CSS for styling. | Provides reusable utility-based styling and responsive design. | CSS Modules, standalone CSS architecture. |
| ADR-005 | Supabase PostgreSQL with Prisma. | Combines managed relational persistence with typed database access and migrations. | MongoDB, Supabase client-only database access, other relational databases. |
| ADR-006 | Auth.js with Prisma Adapter. | Integrates authentication with the existing relational persistence layer. | Supabase Auth. |
| ADR-007 | Repository and Controller-Service patterns. | Separates persistence, HTTP communication, and application business operations. | Direct database access from controllers, monolithic service handlers. |
| ADR-008 | OpenRouter as primary AI provider. | Provides the primary model integration through a centralized provider boundary. | Direct provider-specific integration. |
| ADR-009 | Groq as AI fallback provider. | Provides an alternative inference provider when the primary provider experiences qualifying availability failures. | Single-provider execution, additional provider dependencies. |
| ADR-010 | Feature-based frontend organization. | Groups related presentation and interaction responsibilities by application capability. | Organization exclusively by technical file type. |
| ADR-011 | Zod for runtime validation. | Provides explicit input validation and TypeScript-compatible schemas. | Manual validation, alternative schema validation libraries. |
| ADR-012 | Vitest, Testing Library, MSW, and Playwright. | Covers isolated logic, component behavior, HTTP interactions, and complete browser workflows. | Single-level testing strategy. |
| ADR-013 | Light and dark themes using semantic design tokens. | Maintains consistent visual behavior and supports theme customization. | Single fixed theme, component-specific hardcoded colors. |
| ADR-014 | Vercel hosting and GitHub Actions CI. | Aligns deployment with the Next.js ecosystem and provides automated integration workflows. | Self-managed hosting, alternative CI/CD platforms. |

## 19. Architecture Verification Checklist

- [x] Architecture matches the approved technology decisions and application scope.
- [x] Dependency direction is explicit.
- [x] Forbidden dependencies are documented.
- [x] Major patterns are documented and justified.
- [x] System context and external actors are defined.
- [x] Testing boundaries are defined.
- [x] SOLID principles are addressed.
- [x] Specialized documents have explicit architectural boundaries.
- [x] No unresolved architectural contradiction remains.

## 20. Change Log

| Version | Date | Change | Reason |
| --- | --- | --- | --- |
| `1.0.0` | `2026-11-06` | Initial approved architecture. | Establish the architectural foundation and technical boundaries of Dolce Vita. |

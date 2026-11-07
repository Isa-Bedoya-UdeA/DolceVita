# Dolce Vita (CodeChef-AI-Chat)

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next JS](https://img.shields.io/badge/Next-%23000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-%233982CE.svg?style=for-the-badge&logo=Prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-%233ECF8E.svg?style=for-the-badge&logo=supabase&logoColor=white)

> Dolce Vita is a full-stack web platform that connects culinary enthusiasts and hospitality professionals with George, an executive chef and sommelier powered by Artificial Intelligence for author recipes, avant-garde cooking techniques, beverage pairings, and precise ingredient substitutions.

---

## Project Information

| Field            | Value                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Status           | Active / Production Ready                                                                                   |
| Project Type     | Fullstack Web Application                                                                                   |
| Platform         | Web (Responsive Desktop & Mobile)                                                                           |
| Primary Language | TypeScript 5                                                                                                |
| Framework        | Next.js 16.4.5 (App Router, Turbopack)                                                                      |
| Repository       | [202602-Ingeniria-Web-Udea/CodeChef-AI-Chat](https://github.com/202602-Ingeniria-Web-Udea/CodeChef-AI-Chat) |
| License          | MIT License                                                                                                 |

---

## Overview

Dolce Vita was developed as the Capstone Project for the **Web Engineering** course at the University of Antioquia (Term 2026-1). The platform addresses the need for a specialized conversational assistant with **technical culinary rigor, enology depth, and food science precision**, surpassing the limitations of general-purpose chatbots.

The virtual assistant, **George**, operates under carefully calibrated system instructions: every preparation is structured with an organoleptic summary, exact weight measurements in grams, sequential procedural steps, curated wine and beverage pairings, and brigade pro-tips. In addition, George politely declines non-gastronomic queries while proactively highlighting critical food safety hygiene points and allergen warnings.

The application adheres to **Feature-Driven Design** on the frontend and **Clean Hexagonal Architecture** on the backend, with relational persistence on PostgreSQL via Supabase and multi-provider AI resilience using **OpenRouter** as the primary provider and **Groq** as an automatic fallback.

---

## Features

### Specialized Gastronomic Assistant (George)

- **Technical Rigor & Standardization:** Formulations with gram-level precision, al dente cooking control, stable culinary emulsions, internal temperature monitoring, and food cost yield optimization.
- **Sommelier & Beverage Pairing:** Classic and contrast harmonies with red, white, sparkling wines, craft beers, and specialty single-origin coffees.
- **Culinary Substitutions:** Exact adaptations for vegan diets, celiac disease, and common allergens without compromising palatability or structural texture.
- **Domain Boundaries:** Courteous refusal of out-of-domain requests and preventive alerts regarding critical food safety control points.

### Conversation Management

- **Creation & Persistence:** Seamless creation of new conversation threads tied to the authenticated user account in PostgreSQL.
- **Full History:** Chronological thread sidebar with real-time selection, search, and responsive mobile access.
- **Editing & Cleanup:** Accessible dialogs to rename chat titles and securely delete conversations with cascade cleanup.

### Interactive Chat & Message Lifecycle

- **Rich Markdown Rendering:** Full support for headings, bold/italic text, ordered/unordered lists, structured tables, and highlighted syntax code blocks via `highlight.js`.
- **Query Editing:** Ability to edit and refine previous user queries, which invalidates downstream branch responses and regenerates a consistent continuation.
- **Retry / Regeneration:** Quick retry action to request an alternative technical culinary response from George.
- **Feedback & Rating:** Qualitative feedback (thumbs up / thumbs down) stored in the database for evaluation metrics and continuous assistant improvement.
- **Clipboard Utility:** Clean copy action for recipe steps with contextual toast notifications.

### Authentication, Security & Roles

- **Auth.js v5 Integration:** Secure cookie-based session management and password hashing with `bcryptjs`.
- **Role-Based Access Control (RBAC):** Server-side and client-side separation between `USER` and `ADMIN` roles enforced at the middleware level (`proxy.ts`).
- **Quick Access for Academic Evaluation:** 1-click test credential buttons on the login screen for pre-configured evaluation accounts:
  - **Administrator:** `admin@dolcevita.com` / `Admin1234!`
  - **Standard User:** `user@dolcevita.com` / `User1234!`

### Administration Panel & Analytics

- **Assistant Configuration:** Administrative interface to tune George's system instructions, model temperature, max tokens, and active LLM provider.
- **User Management:** Inspection of registered user accounts and dynamic role assignment (`USER` / `ADMIN`).
- **General Statistics:** Overview of system activity metrics, including registered users, active chats, total messages, and satisfaction ratios.

### Design System & User Experience

- **Gastronomic Visual Identity:** Warm terracotta, amber, and neutral color palette evocative of high-end kitchens, featuring _Space Grotesk_ and _Inter_ typography.
- **Light & Dark Themes:** Instant theme toggle with local storage persistence (`localStorage`), system preference synchronization, and anti-FOUC (Flash of Unstyled Content) prevention.

---

## Tech Stack

| Category        | Technology                                     | Purpose                                                               |
| --------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| Language        | TypeScript 5                                   | Strict static typing across client, server, and data schemas          |
| Framework       | Next.js 16.4.5 (App Router, Turbopack)         | Server Components, file-based routing, and high-performance bundling  |
| UI Library      | React 19                                       | Declarative UI rendering                                              |
| Styling         | Tailwind CSS v4 & PostCSS                      | Utility-first styling with semantic CSS custom properties             |
| Icons           | Lucide React                                   | Consistent and accessible SVG iconography                             |
| Database & ORM  | PostgreSQL (Supabase) + Prisma 7.10            | Relational database, migrations, and `@prisma/adapter-pg` driver pool |
| AI Integration  | OpenRouter API (Primary) + Groq API (Fallback) | Resilient multi-provider LLM orchestration with automatic failover    |
| Authentication  | Auth.js v5 (NextAuth beta) + bcryptjs          | Credential verification, session handling, and route protection       |
| Form Handling   | React Hook Form + Zod                          | Controlled form states with type-safe schema validation               |
| Markdown        | react-markdown + remark-gfm + highlight.js     | Secure rendering of rich responses and culinary specification tables  |
| Notifications   | Sonner                                         | Accessible and animated toast notifications                           |
| Testing         | Vitest + React Testing Library + Playwright    | Unit, component integration, and end-to-end testing                   |
| Code Quality    | ESLint 9 + Prettier (TabWidth: 4)              | Static code analysis and 4-space code formatting enforcement          |
| Package Manager | pnpm v12                                       | Fast, deterministic, and disk-efficient package management            |

---

## Architecture

Dolce Vita combines **Feature-Driven Design** on the frontend with **Clean Hexagonal Architecture** on the backend:

1. **Presentation Layer:** Next.js Server & Client Components organized by feature domain (`src/features/*`).
2. **HTTP / API Layer:** Next.js Route Handlers (`src/app/api/*`) delegating to application controllers and services.
3. **Application & Domain Layer:** Use cases (`services/`), domain entities (`domain/entities/`), and repository interfaces (`domain/contracts/`).
4. **Infrastructure Layer:** Prisma data repositories (`repositories/`), AI providers (`integrations/ai/`), and database connections (`infrastructure/database/`).

### Main Components

| Component            | Responsibility                                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `AI Orchestrator`    | Coordinates inference requests with the primary provider (OpenRouter) and switches to Groq on failure, timeouts, or rate limits. |
| `Prompt Engine`      | Assembles context-aware conversational prompts incorporating George's culinary guidelines, tone, and conversation history.       |
| `Prisma Client Pool` | Manages PostgreSQL connections to Supabase using Transaction Pooling (port 6543) and Session Pooling (port 5432).                |
| `Theme Engine`       | Manages light and dark theme switching with zero layout shifts or visual flashes upon initial render.                            |
| `Security Proxy`     | Middleware validating session tokens and enforcing role permissions across protected routes.                                     |

### System Context

```mermaid
flowchart TD
    Client["Web Browser (Desktop / Mobile)"] --> NextRouter["Next.js App Router (Proxy & Layouts)"]

    subgraph Frontend["Frontend Layer"]
        NextRouter --> Landing["Public Landing Page"]
        NextRouter --> AuthUI["Login & Register Forms"]
        NextRouter --> ChatUI["Conversations & Chat Interface"]
        NextRouter --> AdminUI["Administration Dashboard"]
    end

    subgraph Backend["Backend Layer (Route Handlers)"]
        NextRouter --> AuthRoute["/api/auth (NextAuth)"]
        NextRouter --> ConvRoute["/api/conversations"]
        NextRouter --> MsgRoute["/api/messages"]
        NextRouter --> AdminRoute["/api/admin"]
    end

    subgraph Core["Services & Business Logic"]
        ConvRoute & MsgRoute --> ChatService["Conversation & Message Services"]
        ChatService --> AIOrchestrator["AI Orchestrator"]
        AdminRoute --> AdminService["Admin & Statistics Services"]
    end

    subgraph Data["External Infrastructure"]
        ChatService & AdminService --> PrismaORM["Prisma 7 ORM"]
        PrismaORM --> SupabaseDB[(PostgreSQL - Supabase)]

        AIOrchestrator -->|Primary| OpenRouter["OpenRouter API"]
        AIOrchestrator -->|Automatic Fallback| GroqAPI["Groq API"]
    end
```

For comprehensive architectural specifications and diagrams, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Repository Structure

```text
dolce-vita/
├── docs/                           # Authoritative technical documentation
│   ├── API.md                      # REST endpoint contracts and payloads
│   ├── ARCHITECTURE.md             # System architecture and C4 diagrams
│   ├── DATABASE.md                 # Data models, schema, and indexes
│   ├── DEPLOY.md                   # Vercel and Supabase deployment guide
│   ├── DESIGNSYSTEM.md             # Visual tokens, typography, and dark mode rules
│   ├── PLAN.md                     # Implementation roadmap and milestones
│   ├── REQUIREMENTS.md             # Functional (FR) and non-functional (NFR) requirements
│   ├── SECURITY.md                 # Security controls, encryption, and RBAC policies
│   └── SPEC.md                     # Product scope and vision
├── prisma/
│   ├── schema.prisma               # Prisma schema defining 9 models and 5 enums
│   └── seed.ts                     # Database seed with Admin/User accounts and sample data
├── public/
│   ├── icons/                      # Web icons and favicon
│   └── images/
│       └── Logo.png                # Official high-resolution Dolce Vita logo
├── src/
│   ├── app/                        # Next.js App Router (Pages, Layouts, and API Routes)
│   │   ├── (auth)/                 # Authentication views (login, register)
│   │   ├── (dashboard)/            # Application views (chat, conversations, admin)
│   │   ├── (errors)/               # Custom error boundary views (forbidden 403)
│   │   ├── api/                    # REST API route handlers
│   │   ├── globals.css             # Global styles and light/dark theme variables
│   │   ├── layout.tsx              # Root layout with anti-FOUC theme initialization
│   │   └── page.tsx                # Public landing page with anchor navigation
│   ├── components/                 # Shared UI components and layout structures
│   │   ├── layout/                 # Header, Footer, Sidebar, UserMenu
│   │   ├── shared/                 # MarkdownRenderer, CodeBlock, EmptyState
│   │   └── ui/                     # UI primitives (Button, Card, Dialog, Input, etc.)
│   ├── features/                   # Business domain modules (Vertical Slices)
│   │   ├── admin/                  # Administration components, hooks, and schemas
│   │   ├── assistant/              # Assistant display and configuration
│   │   ├── auth/                   # Authentication forms and session hooks
│   │   ├── chat/                   # Chat window, input box, and message actions
│   │   ├── conversations/          # Conversation list, rename, and delete dialogs
│   │   └── theme/                  # useTheme hook and ThemeToggle component
│   ├── hooks/                      # Cross-cutting React hooks (useAutoScroll, useCopyToClipboard)
│   ├── lib/                        # Shared utilities, constants, and API helpers
│   ├── proxy.ts                    # Edge-compatible security middleware
│   └── server/                     # Backend Clean Architecture (services, repos, AI)
├── next.config.ts                  # Next.js configuration (Cache Components, Partial Prefetch)
├── package.json                    # Project dependencies and npm scripts
├── postcss.config.mjs              # PostCSS configuration for @tailwindcss/postcss
├── prisma.config.ts                # Prisma 7 database connection configuration
└── tsconfig.json                   # Strict TypeScript compiler options
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed and configured before running the project:

- **Node.js:** Version `>= 20.x`
- **pnpm:** Version `>= 10.x` (`corepack enable pnpm`)
- **PostgreSQL Database:** Active project on [Supabase](https://supabase.com)
- **AI Credentials:** Valid API keys for [OpenRouter](https://openrouter.ai) and [Groq](https://console.groq.com)

### Clone the Repository

```bash
git clone https://github.com/202602-Ingeniria-Web-Udea/CodeChef-AI-Chat.git
cd dolce-vita
```

### Install Dependencies

```bash
pnpm install
```

### Environment Configuration

Create a local environment file from the provided example:

```bash
cp .env.example .env
```

Configure the environment variables in `.env`:

```dotenv
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Authentication (Auth.js / NextAuth v5)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-secure-secret-with-openssl-rand-base64-32

# Database (Supabase PostgreSQL)
# Transaction Pooler connection string (port 6543) for runtime execution
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session Pooler connection string (port 5432) for Prisma CLI migrations
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# AI Model Providers
OPENROUTER_API_KEY="sk-or-v1-..."
GROQ_API_KEY="gsk_..."
```

### Database Synchronization & Seed

Push the schema to PostgreSQL and populate default test users, George's profile, and sample chats:

```bash
# 1. Synchronize Prisma schema with Supabase PostgreSQL
pnpm exec prisma db push

# 2. Seed database with evaluation profiles and test records
pnpm exec prisma db seed
```

### Run Locally

Start the local development server with Turbopack:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Expected Result:** The application should boot in less than 2 seconds, displaying the Dolce Vita landing page with the header, logo, theme selector, and evaluation access links.

---

## Usage

### Evaluation Profiles for Academic Review

To streamline grading without manual registration, the login view (`/login`) provides 1-click test buttons:

| Role              | Email                 | Password     | Permissions                                                                                             |
| :---------------- | :-------------------- | :----------- | :------------------------------------------------------------------------------------------------------ |
| **Administrator** | `admin@dolcevita.com` | `Admin1234!` | Full platform access: conversations, analytics dashboard, assistant configuration, and role management. |
| **Standard User** | `user@dolcevita.com`  | `User1234!`  | Conversational experience: create, rename, delete, and interact with chats.                             |

### Sample Prompts to Evaluate George

Test these questions in the chat interface to verify domain guardrails and culinary depth:

1. **High-End Cooking Technique:** _"What is the golden ratio of 00 flour to whole eggs for fresh pasta that won't tear?"_
2. **Sommelier & Pairing:** _"Which wine pairs best with the richness of a porcini mushroom and black truffle risotto?"_
3. **Ingredient Substitution:** _"How can I replace eggs in traditional baking while preserving rise, moisture, and emulsification?"_
4. **Food Safety & Critical Points:** _"What is the maximum emulsification water temperature to avoid breaking the cheese in a Cacio e Pepe?"_
5. **Out-of-Domain Refusal:** _"How do I repair a car carburetor?"_ _(George must politely refuse and redirect focus to gastronomy)._

---

## Quality Gates & Verification

Run these verification commands before opening pull requests or committing changes:

| Check             | Command                        | Purpose                                                 |
| ----------------- | ------------------------------ | ------------------------------------------------------- |
| Code Formatting   | `pnpm exec prettier --check .` | Verifies adherence to strict 4-space indentation        |
| Fix Formatting    | `pnpm exec prettier --write .` | Automatically formats codebase files using Prettier     |
| Linter            | `pnpm lint`                    | Runs static analysis and Next.js ESLint rules           |
| Typecheck & Build | `pnpm build`                   | Production build validation using Next.js and Turbopack |
| Unit Tests        | `pnpm test`                    | Runs automated test suites with Vitest                  |

---

## Deployment

The application is optimized for continuous deployment on **Vercel** and managed PostgreSQL on **Supabase**:

- **Frontend & API Hosting:** [Vercel](https://vercel.com)
- **Database Hosting:** [Supabase](https://supabase.com)
- **Production Variables:** Set the `.env` values in the Vercel project settings, ensuring `NEXTAUTH_URL` reflects the production domain.

For step-by-step production deployment procedures, see [docs/DEPLOY.md](docs/DEPLOY.md).

---

## Documentation

All project documentation is maintained under the `docs/` directory:

| Document                                     | Description                                                         |
| -------------------------------------------- | ------------------------------------------------------------------- |
| [docs/SPEC.md](docs/SPEC.md)                 | Product vision, goals, target audience, and scope.                  |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | Formal functional (`FR`) and non-functional (`NFR`) requirements.   |
| [docs/PLAN.md](docs/PLAN.md)                 | Implementation phases, milestones, and delivery schedule.           |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, layer responsibilities, and C4 models.         |
| [docs/API.md](docs/API.md)                   | REST contracts, endpoints, request schemas, and responses.          |
| [docs/DATABASE.md](docs/DATABASE.md)         | Relational schema, Prisma models, constraints, and indexes.         |
| [docs/SECURITY.md](docs/SECURITY.md)         | Security controls, session integrity, sanitization, and RBAC.       |
| [docs/DESIGNSYSTEM.md](docs/DESIGNSYSTEM.md) | Visual tokens, color schemes, typography, and dark mode specs.      |
| [docs/DEPLOY.md](docs/DEPLOY.md)             | Production build, environment configuration, and deployment guides. |

---

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contributors

### Development Team (Web Engineering - Term 2026-1 · UdeA)

| Name                              | Institutional Email          | Project Role        |
| --------------------------------- | ---------------------------- | ------------------- |
| **Jesus Estiven Torres Quintero** | `jesus.torresq@udea.edu.co`  | Fullstack Developer |
| **Daniela Vela**                  | `daniela.vela@udea.edu.co`   | Fullstack Developer |
| **Isabela Bedoya**                | `isabela.bedoya@udea.edu.co` | Fullstack Developer |

- **Organization Repository:** [202602-Ingeniria-Web-Udea/CodeChef-AI-Chat](https://github.com/202602-Ingeniria-Web-Udea/CodeChef-AI-Chat)
- **Repository Connected to Vercel:** [Isa-Bedoya-UdeA/DolceVita](https://github.com/Isa-Bedoya-UdeA/DolceVita)
- **Vercel Deployment:**

# Requirements

## 1. Document Information

| Field | Value |
| --- | --- |
| Project | `CodeChef-AI-Chat (Dolce Vita)` |
| Document | Requirements |
| Version | 1.0.0 |
| Status | Approved |
| Last Updated | 2026-11-06 |

## 2. Purpose

This document defines the functional and non-functional requirements of Dolce Vita, a full-stack web application that provides access to George, a specialized gastronomic AI assistant.

It translates the product scope and expected behavior established in `SPEC.md` into individually identifiable, testable, and verifiable requirements.

Functional requirements describe the capabilities and observable behavior of the application. Non-functional requirements establish its quality attributes, operational expectations, and technical constraints.

Each requirement has a unique identifier, a description, acceptance criteria, priority, release assignment, and traceability references.

This document is the authoritative reference for the application's approved requirements. Changes to these requirements follow the change management process defined in this document.

## 3. Product Scope

### 3.1 In Scope

Dolce Vita provides the following capabilities:

- A public landing page introducing the application and its gastronomic assistant.
- User registration, login, session management, and protected access.
- Role-based access control with `ADMIN` and `USER` roles.
- A conversational interface for interacting with George, the application's gastronomic AI assistant.
- Creation, listing, renaming, and deletion of conversations.
- Persistent storage of users, conversations, and messages.
- Context-aware AI responses based on the conversation history.
- Gastronomic assistance focused on recipes, cooking techniques, and ingredient substitutions.
- Markdown rendering for assistant responses.
- Message editing with regeneration of the subsequent assistant response.
- Response regeneration through a retry action.
- Message copying and positive or negative response feedback.
- Loading, success, and error states for relevant interactions.
- Administrative user and role management.
- Administrative assistant configuration.
- General application statistics for administrators.
- Responsive web interfaces with light and dark themes.
- AI provider integration through OpenRouter, with Groq as the fallback provider.

### 3.2 System or Repository Boundaries

- **System type:** Full-stack web application.
- **Repository responsibility:** `CodeChef-AI-Chat` contains the frontend, backend HTTP endpoints, application services, authentication integration, data access, AI provider integration, and automated tests.
- **External dependencies:** Supabase PostgreSQL, OpenRouter, Groq, and the Vercel deployment platform.
- **Interfaces:** Users interact through the web interface. The frontend communicates with Next.js Route Handlers. Server-side services interact with PostgreSQL through Prisma and with external language model providers through their APIs.
- **Authentication:** Auth.js manages authentication and sessions, with the Prisma Adapter for persistence.
- **Persistence:** PostgreSQL stores application users, conversations, messages, and associated records.
- **AI integration:** The backend communicates with OpenRouter as the primary provider and Groq as the fallback provider. Provider credentials remain server-side.

The application implements one specialized assistant: George, focused on gastronomy. It is not a general-purpose assistant platform or a catalog of independently configurable assistants.

### 3.3 Out of Scope

The following capabilities are excluded from the current project:

- Multiple specialized assistants or a public assistant marketplace.
- Native Android or iOS applications.
- Food ordering, restaurant reservations, payments, or e-commerce.
- Social networking features, public conversation sharing, or community discussion spaces.
- Direct email sending or integration with external messaging platforms.
- Training or fine-tuning proprietary language models.
- User access to provider API keys or direct provider configuration.

## 4. Requirement Conventions

### 4.1 Requirement Categories

Requirements are classified into two primary categories:

| Category | Identifier | Description |
| --- | --- | --- |
| Functional Requirement | FR-XXX | Defines an observable system capability or behavior. |
| Non-Functional Requirement | NFR-XXX | Defines a quality attribute, operational expectation, or technical constraint. |

Additional identifiers represent project constraints, business rules, edge cases, and excluded capabilities.

### 4.2 Requirement Identifiers

The document uses the following identifier formats:

- `FR-001` — Functional requirement.
- `NFR-001` — Non-functional requirement.
- `AC-FR-001-01` — Acceptance criterion for a functional requirement.
- `AC-NFR-001-01` — Acceptance criterion for a non-functional requirement.
- `C-001` — Project constraint.
- `BR-001` — Business rule.
- `EC-001` — Edge case.
- `OOS-001` — Out-of-scope item.

Identifiers are unique and permanent. Removed requirements retain their identifiers in the document history and are not reassigned to other requirements.

### 4.3 Requirement Quality

Every requirement:

- Expresses a single, identifiable expectation.
- Is clear, unambiguous, and understandable.
- Is consistent with the approved product scope.
- Is feasible within the project's constraints.
- Is independently verifiable whenever possible.
- Avoids prescribing implementation details unless they represent an explicit project constraint.
- Uses observable or measurable acceptance criteria.

### 4.4 Requirement Description Format

Each requirement follows this structure:

```text
FR-001 — Requirement Name

Description:
[Expected system behavior.]

Acceptance Criteria:
- AC-FR-001-01: [Verifiable condition.]
- AC-FR-001-02: [Verifiable condition.]

Priority:
[Must / Should / Could / Won't]

Release:
[Taller 2 / Proyecto IA]

Traceability:
- SPEC Feature: [Feature reference]
- User Flow: [User flow reference]
- Related Requirements: [Requirement IDs or N/A]
```

The same structure applies to non-functional requirements, using the corresponding `NFR` and `AC-NFR` identifiers.

### 4.5 Priority Levels

The MoSCoW prioritization method determines the importance of each requirement:

| Priority | Meaning |
| --- | --- |
| Must | Essential for the specified release. The release cannot be considered complete without it. |
| Should | Important and expected, but the release can proceed without it under justified circumstances. |
| Could | Desirable if available time and resources permit. |
| Won't | Explicitly excluded from the current release. |

Priority reflects the importance of the requirement, not its implementation difficulty.

## 5. Functional Requirements

Functional requirements define the observable capabilities and behaviors provided by Dolce Vita.

### 5.1 Feature: Authentication and User Management

#### FR-001 — User Registration

**Description:**

The system shall allow visitors to create an account by providing the required registration information.

**Acceptance Criteria:**

- AC-FR-001-01: The registration form shall collect the information required to create a user account.
- AC-FR-001-02: The system shall validate the submitted information before creating the account.
- AC-FR-001-03: The system shall reject registration attempts using an email address already associated with an account.
- AC-FR-001-04: A successfully registered user shall be able to authenticate using the registered credentials.
- AC-FR-001-05: The system shall store passwords as secure hashes and shall never store them in plaintext.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Authentication and users.
- User Flow: Registration.
- Related Requirements: FR-002, NFR-003, NFR-004.

---

#### FR-002 — User Login and Session Management

**Description:**

The system shall authenticate registered users and manage their application sessions.

**Acceptance Criteria:**

- AC-FR-002-01: Users shall be able to sign in using valid credentials.
- AC-FR-002-02: Invalid credentials shall not grant access to protected resources.
- AC-FR-002-03: An authenticated user shall retain access to protected pages while the session remains valid.
- AC-FR-002-04: The system shall provide a logout action that terminates the user's active session.
- AC-FR-002-05: Expired or invalid sessions shall not authorize access to protected resources.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Authentication and users.
- User Flow: Login and logout.
- Related Requirements: FR-001, FR-003, NFR-003.

---

#### FR-003 — Role-Based Access Control

**Description:**

The system shall distinguish between `ADMIN` and `USER` roles and restrict access according to each role's permissions.

**Acceptance Criteria:**

- AC-FR-003-01: Every authenticated account shall have an assigned application role.
- AC-FR-003-02: A `USER` shall have access to conversational features and only their own conversations.
- AC-FR-003-03: An `ADMIN` shall have access to administrative functionality.
- AC-FR-003-04: A `USER` shall not access administrative operations.
- AC-FR-003-05: Role permissions shall be validated on the server for every protected operation.
- AC-FR-003-06: Unauthorized access attempts shall receive an appropriate authorization response.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Authentication and users.
- User Flow: Authenticated navigation and administrative access.
- Related Requirements: FR-002, FR-017, FR-018, FR-019, NFR-003.

---

#### FR-004 — Public Landing Page

**Description:**

The system shall provide a public landing page that introduces Dolce Vita and its gastronomic assistant.

**Acceptance Criteria:**

- AC-FR-004-01: Visitors shall be able to access the landing page without authenticating.
- AC-FR-004-02: The page shall communicate the application's purpose and the assistant's gastronomic specialization.
- AC-FR-004-03: The page shall provide access to the registration and login interfaces.
- AC-FR-004-04: The landing page shall render correctly on supported desktop and mobile viewport sizes.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Public interface.
- User Flow: Public access and account entry.
- Related Requirements: FR-001, FR-002, NFR-005, NFR-007.

### 5.2 Feature: Conversation Management

#### FR-005 — Create Conversation

**Description:**

The system shall allow an authenticated user to create a new conversation with George.

**Acceptance Criteria:**

- AC-FR-005-01: An authenticated user shall be able to start a new conversation.
- AC-FR-005-02: A newly created conversation shall be associated with the authenticated user.
- AC-FR-005-03: The conversation shall be persisted in the database.
- AC-FR-005-04: A newly created conversation shall be available in the user's conversation history.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Chat and conversation management.
- User Flow: Create conversation.
- Related Requirements: FR-006, FR-007, FR-008, FR-009.

---

#### FR-006 — List Conversation History

**Description:**

The system shall display the conversations associated with the authenticated user.

**Acceptance Criteria:**

- AC-FR-006-01: The system shall retrieve conversations belonging to the authenticated user.
- AC-FR-006-02: Conversations shall display their identifying title and relevant date information.
- AC-FR-006-03: The history shall reflect persisted conversation data.
- AC-FR-006-04: A user shall not retrieve conversations belonging to another user.
- AC-FR-006-05: The interface shall provide an appropriate empty state when no conversations exist.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Chat and conversation history.
- User Flow: View conversation history.
- Related Requirements: FR-005, FR-007, FR-008, NFR-003.

---

#### FR-007 — Rename Conversation

**Description:**

The system shall allow a user to modify the title of their own conversation.

**Acceptance Criteria:**

- AC-FR-007-01: A user shall be able to select a conversation and edit its title.
- AC-FR-007-02: The system shall validate the new title before saving it.
- AC-FR-007-03: The updated title shall persist after the conversation is reopened.
- AC-FR-007-04: A user shall not rename a conversation owned by another user.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Conversation management.
- User Flow: Rename conversation.
- Related Requirements: FR-006, FR-008, FR-020.

---

#### FR-008 — Delete Conversation

**Description:**

The system shall allow a user to delete their own conversations.

**Acceptance Criteria:**

- AC-FR-008-01: A user shall be able to request deletion of a conversation they own.
- AC-FR-008-02: The interface shall request confirmation before completing the deletion.
- AC-FR-008-03: A confirmed deletion shall remove the conversation from the user's history.
- AC-FR-008-04: The deletion shall also remove or appropriately handle messages and dependent records associated with the conversation.
- AC-FR-008-05: A user shall not delete conversations owned by another user.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Conversation management.
- User Flow: Delete conversation.
- Related Requirements: FR-006, FR-020, NFR-004.

### 5.3 Feature: Chat and Message Management

#### FR-009 — Send Message

**Description:**

The system shall allow an authenticated user to submit a message to George within an existing conversation.

**Acceptance Criteria:**

- AC-FR-009-01: The user shall be able to enter and submit a message through the chat interface.
- AC-FR-009-02: The system shall validate the message content before processing it.
- AC-FR-009-03: The submitted user message shall be associated with the selected conversation.
- AC-FR-009-04: The system shall process the message through the server-side AI integration.
- AC-FR-009-05: The resulting assistant response shall be associated with the same conversation.
- AC-FR-009-06: Both messages shall be persisted and available when the conversation is reopened.
- AC-FR-009-07: The system shall prevent users from submitting messages to conversations they do not own.

**Priority:** Must

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Chat.
- User Flow: Send message and receive response.
- Related Requirements: FR-005, FR-010, FR-011, FR-012, FR-013, FR-014, NFR-002.

---

#### FR-010 — Display Conversation Messages

**Description:**

The system shall display the messages belonging to the selected conversation in their chronological order.

**Acceptance Criteria:**

- AC-FR-010-01: The interface shall distinguish user messages from assistant messages.
- AC-FR-010-02: Messages shall appear in chronological order.
- AC-FR-010-03: The system shall retrieve persisted messages when a conversation is opened.
- AC-FR-010-04: The interface shall display the conversation's messages without exposing messages from other conversations.
- AC-FR-010-05: The interface shall display an appropriate empty state for a conversation without messages.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Chat and conversation history.
- User Flow: Open conversation.
- Related Requirements: FR-006, FR-009, FR-011.

---

#### FR-011 — Render Markdown Responses

**Description:**

The system shall render assistant responses containing supported Markdown elements.

**Acceptance Criteria:**

- AC-FR-011-01: The interface shall render headings, paragraphs, bold text, and italic text.
- AC-FR-011-02: The interface shall render ordered and unordered lists.
- AC-FR-011-03: The interface shall render tables.
- AC-FR-011-04: The interface shall render code blocks with syntax highlighting.
- AC-FR-011-05: The interface shall render links using safe link-handling behavior.
- AC-FR-011-06: The renderer shall not execute arbitrary HTML contained in model responses.

**Priority:** Must

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Chat response presentation.
- User Flow: Read assistant response.
- Related Requirements: FR-009, NFR-003, NFR-005.

---

#### FR-012 — Copy Message Content

**Description:**

The system shall allow users to copy the content of a displayed message.

**Acceptance Criteria:**

- AC-FR-012-01: A user shall be able to copy the content of an individual message.
- AC-FR-012-02: The copied content shall preserve the message's readable textual content.
- AC-FR-012-03: The interface shall provide feedback when the copy operation succeeds or fails.

**Priority:** Should

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Chat interaction.
- User Flow: Copy message.
- Related Requirements: FR-010, FR-011.

---

#### FR-013 — Edit User Message and Regenerate Response

**Description:**

The system shall allow a user to edit one of their previous messages and regenerate the assistant response using the modified conversation context.

**Acceptance Criteria:**

- AC-FR-013-01: A user shall be able to edit the content of their own messages.
- AC-FR-013-02: The system shall validate the edited content before processing it.
- AC-FR-013-03: The edited message shall replace the previous message content in the active conversation state.
- AC-FR-013-04: Assistant responses and subsequent messages that depend on the previous message context shall be invalidated.
- AC-FR-013-05: The system shall generate a new assistant response using the updated conversation context.
- AC-FR-013-06: The resulting conversation shall remain consistent with the edited message and regenerated response.
- AC-FR-013-07: A user shall not edit messages belonging to another user's conversation.

**Priority:** Must

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Chat interaction and message editing.
- User Flow: Edit message and regenerate response.
- Related Requirements: FR-009, FR-010, FR-014, FR-020.

---

#### FR-014 — Retry Assistant Response

**Description:**

The system shall allow a user to request a new assistant response to a previous user message.

**Acceptance Criteria:**

- AC-FR-014-01: The interface shall provide a retry action for eligible assistant responses.
- AC-FR-014-02: The system shall regenerate the response using the corresponding conversation context.
- AC-FR-014-03: The system shall associate the regenerated response with the correct conversation and user message.
- AC-FR-014-04: The system shall preserve conversation consistency when replacing a previous response.
- AC-FR-014-05: A user shall not retry responses in conversations they do not own.

**Priority:** Must

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Chat interaction.
- User Flow: Retry assistant response.
- Related Requirements: FR-009, FR-010, FR-013.

---

#### FR-015 — Rate Assistant Response

**Description:**

The system shall allow users to submit positive or negative feedback on assistant responses.

**Acceptance Criteria:**

- AC-FR-015-01: The interface shall provide positive and negative feedback actions for assistant messages.
- AC-FR-015-02: The system shall associate each feedback record with the corresponding user and assistant response.
- AC-FR-015-03: The system shall persist the submitted feedback.
- AC-FR-015-04: The interface shall communicate the feedback submission result.
- AC-FR-015-05: A user shall not submit feedback on messages belonging to another user's conversation.

**Priority:** Should

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Chat feedback.
- User Flow: Rate assistant response.
- Related Requirements: FR-009, FR-010, FR-020.

---

#### FR-016 — Display Loading and Error States

**Description:**

The system shall communicate the processing state and relevant errors associated with chat operations.

**Acceptance Criteria:**

- AC-FR-016-01: The interface shall display a loading indicator while the assistant is processing a request.
- AC-FR-016-02: The interface shall prevent accidental duplicate submissions while an equivalent request is being processed.
- AC-FR-016-03: The interface shall display an understandable error when a request cannot be completed.
- AC-FR-016-04: An unsuccessful AI request shall not be presented as a successful assistant response.
- AC-FR-016-05: A failure shall not silently corrupt or duplicate persisted conversation messages.

**Priority:** Must

**Release:** Taller 2 / Proyecto IA

**Traceability:**

- SPEC Feature: Chat and error handling.
- User Flow: Message processing and failure handling.
- Related Requirements: FR-009, FR-013, FR-014, NFR-002.

### 5.4 Feature: Gastronomic Assistant

#### FR-017 — Specialized Gastronomic Responses

**Description:**

The system shall provide George as a specialized gastronomic assistant. Its responses shall focus on the domain defined for Dolce Vita.

**Acceptance Criteria:**

- AC-FR-017-01: The assistant shall provide guidance related to recipes and food preparation.
- AC-FR-017-02: The assistant shall provide explanations of cooking techniques.
- AC-FR-017-03: The assistant shall suggest ingredient substitutions when relevant to the user's request.
- AC-FR-017-04: The assistant shall maintain the gastronomic specialization established by its system instructions.
- AC-FR-017-05: The assistant shall recognize requests outside its specialization and communicate the limits of its domain.
- AC-FR-017-06: The assistant shall acknowledge uncertainty when it cannot provide a sufficiently reliable answer.

**Priority:** Must

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Assistant specialization.
- User Flow: Ask a gastronomic question.
- Related Requirements: FR-009, FR-018, FR-021.

---

#### FR-018 — Apply Assistant System Instructions

**Description:**

The system shall use a system prompt to define George's identity, specialization, behavior, limits, and response format.

**Acceptance Criteria:**

- AC-FR-018-01: Every AI interaction shall use the active assistant instructions.
- AC-FR-018-02: The instructions shall establish George's gastronomic specialization.
- AC-FR-018-03: The instructions shall define the assistant's expected behavior and response boundaries.
- AC-FR-018-04: The instructions shall establish the expected response format.
- AC-FR-018-05: The system shall apply the same active configuration consistently across conversations.

**Priority:** Must

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Assistant specialization.
- User Flow: Send message to George.
- Related Requirements: FR-017, FR-019.

### 5.5 Feature: Administration

#### FR-019 — Manage Users and Roles

**Description:**

The system shall allow administrators to manage registered users and their application roles.

**Acceptance Criteria:**

- AC-FR-019-01: An administrator shall be able to retrieve the registered user list.
- AC-FR-019-02: An administrator shall be able to inspect relevant user information.
- AC-FR-019-03: An administrator shall be able to modify a user's application role.
- AC-FR-019-04: Role changes shall be persisted.
- AC-FR-019-05: Updated permissions shall be enforced by the backend.
- AC-FR-019-06: Non-administrative users shall not access user management operations.

**Priority:** Must

**Release:** Taller 2

**Traceability:**

- SPEC Feature: Administration.
- User Flow: Manage users and roles.
- Related Requirements: FR-003, NFR-003.

---

#### FR-020 — Configure the Assistant

**Description:**

The system shall allow administrators to manage the configuration that defines George's behavior.

**Acceptance Criteria:**

- AC-FR-020-01: An administrator shall be able to access the assistant configuration interface.
- AC-FR-020-02: An administrator shall be able to modify the assistant's system instructions.
- AC-FR-020-03: The system shall validate the submitted configuration before saving it.
- AC-FR-020-04: The active configuration shall be persisted.
- AC-FR-020-05: Subsequent AI interactions shall use the active configuration.
- AC-FR-020-06: Non-administrative users shall not access assistant configuration operations.

**Priority:** Must

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Administration and assistant configuration.
- User Flow: Configure assistant.
- Related Requirements: FR-018, FR-019, NFR-003.

---

#### FR-021 — Consult General Statistics

**Description:**

The system shall provide administrators with general application statistics.

**Acceptance Criteria:**

- AC-FR-021-01: An administrator shall be able to access the statistics interface.
- AC-FR-021-02: The interface shall present general user statistics.
- AC-FR-021-03: The interface shall present general conversation statistics.
- AC-FR-021-04: The interface shall present general message statistics.
- AC-FR-021-05: The statistics shall be derived from persisted application data.
- AC-FR-021-06: Non-administrative users shall not access administrative statistics.

**Priority:** Must

**Release:** Proyecto IA

**Traceability:**

- SPEC Feature: Administration and statistics.
- User Flow: Consult application statistics.
- Related Requirements: FR-003, FR-019, NFR-003.

## 6. Non-Functional Requirements

Non-functional requirements establish measurable quality expectations and operational constraints for Dolce Vita.

### 6.1 Performance

#### NFR-001 — Application Response Performance

**Category:**

Performance

**Description:**

The application shall provide responsive interactions for operations that do not depend on external language model inference.

**Acceptance Criteria:**

- AC-NFR-001-01: Under a test workload of 20 concurrent authenticated users, 95% of successful conversation and message retrieval requests shall complete within 3 seconds.
- AC-NFR-001-02: The measurement shall exclude the time required for external AI provider inference.
- AC-NFR-001-03: Performance measurements shall identify the test environment, workload, and request type.

**Priority:** Should

**Release:** Taller 2 / Proyecto IA

**Traceability:**

- SPEC: Chat, persistence, and conversation management.
- Related Requirements: FR-005, FR-006, FR-009, FR-010.

---

### 6.2 Reliability and Availability

#### NFR-002 — AI Provider Resilience

**Category:**

Reliability

**Description:**

The AI integration shall support provider fallback so that temporary failures in the primary provider do not automatically prevent the application from attempting to generate a response.

**Acceptance Criteria:**

- AC-NFR-002-01: OpenRouter shall be the primary AI provider.
- AC-NFR-002-02: Groq shall be used as the fallback provider when the primary provider experiences a network failure, timeout, HTTP 429 response, HTTP 5xx response, or model unavailability.
- AC-NFR-002-03: The fallback mechanism shall not treat invalid user input or application validation errors as provider availability failures.
- AC-NFR-002-04: If both providers fail, the application shall communicate the failure without presenting an invalid or fabricated assistant response.
- AC-NFR-002-05: Provider failures shall not expose internal credentials or sensitive implementation details to users.

**Priority:** Must

**Release:** Proyecto IA

**Traceability:**

- SPEC: AI integration and error handling.
- Related Requirements: FR-009, FR-016, FR-017.

---

### 6.3 Security

#### NFR-003 — Authentication and Access Protection

**Category:**

Security

**Description:**

The application shall protect authenticated resources, enforce role permissions, and prevent unauthorized access to user-owned data.

**Acceptance Criteria:**

- AC-NFR-003-01: Protected operations shall require a valid authenticated session.
- AC-NFR-003-02: Administrative operations shall require the `ADMIN` role.
- AC-NFR-003-03: Conversation and message operations shall verify resource ownership on the server.
- AC-NFR-003-04: Client-side route protection shall not replace server-side authorization.
- AC-NFR-003-05: Passwords shall be stored using a secure password hashing algorithm.
- AC-NFR-003-06: The application shall not expose authentication secrets, session credentials, or AI provider keys in browser-delivered code.
- AC-NFR-003-07: User input shall be validated before it reaches sensitive application operations.

**Priority:** Must

**Release:** Taller 2 / Proyecto IA

**Traceability:**

- SPEC: Authentication, roles, and backend permissions.
- Related Requirements: FR-001, FR-002, FR-003, FR-008, FR-019, FR-020.

---

### 6.4 Privacy and Data Protection

#### NFR-004 — User Data Isolation

**Category:**

Privacy

**Description:**

The application shall preserve the confidentiality and ownership of user accounts, conversations, messages, and associated feedback.

**Acceptance Criteria:**

- AC-NFR-004-01: Each user's conversations and messages shall be associated with the corresponding account.
- AC-NFR-004-02: A user shall only retrieve and modify resources they are authorized to access.
- AC-NFR-004-03: Administrative access to user information shall be restricted to authorized administrators.
- AC-NFR-004-04: User data shall not be included in responses to unauthorized requests.
- AC-NFR-004-05: Sensitive credentials and provider keys shall not be stored in public source files or exposed through application responses.

**Priority:** Must

**Release:** Taller 2 / Proyecto IA

**Traceability:**

- SPEC: Authentication, persistence, and access control.
- Related Requirements: FR-003, FR-006, FR-008, FR-015, NFR-003.

---

### 6.5 Usability and User Experience

#### NFR-005 — Consistent User Interface

**Category:**

Usability

**Description:**

The application shall provide a consistent interface for public pages, authentication, conversations, and administrative functionality.

**Acceptance Criteria:**

- AC-NFR-005-01: Primary navigation and interactive controls shall have clear labels and predictable behavior.
- AC-NFR-005-02: Forms shall communicate validation errors associated with invalid or missing input.
- AC-NFR-005-03: Destructive operations shall provide confirmation before execution.
- AC-NFR-005-04: Loading, success, empty, and error states shall be visually distinguishable.
- AC-NFR-005-05: The application shall provide consistent visual behavior across light and dark themes.
- AC-NFR-005-06: Chat messages and their actions shall be visually distinguishable by message role and interaction state.

**Priority:** Must

**Release:** Taller 2 / Proyecto IA

**Traceability:**

- SPEC: Interface, authentication, and chat.
- Related Requirements: FR-004, FR-008, FR-010, FR-016.

---

### 6.6 Accessibility

#### NFR-006 — Accessible Interaction

**Category:**

Accessibility

**Description:**

The application shall support accessible interaction with its primary navigation, forms, and conversational controls.

**Acceptance Criteria:**

- AC-NFR-006-01: Interactive elements shall be operable through keyboard navigation.
- AC-NFR-006-02: Form controls shall have programmatically associated labels.
- AC-NFR-006-03: Visible focus indicators shall identify the currently focused interactive element.
- AC-NFR-006-04: Informational icons and controls shall have accessible names or equivalent text alternatives.
- AC-NFR-006-05: Text and interface elements shall maintain sufficient contrast in both themes.

**Priority:** Should

**Release:** Taller 2 / Proyecto IA

**Traceability:**

- SPEC: User interface and responsive design.
- Related Requirements: FR-004, FR-009, FR-016, NFR-005.

---

### 6.7 Compatibility and Portability

#### NFR-007 — Responsive Browser Compatibility

**Category:**

Compatibility

**Description:**

The application shall operate as a responsive web application in current desktop and mobile browsers.

**Acceptance Criteria:**

- AC-NFR-007-01: The application shall support the latest two major versions of Google Chrome, Microsoft Edge, Mozilla Firefox, and Safari.
- AC-NFR-007-02: Public, authentication, conversation, and administrative interfaces shall adapt to desktop and mobile viewport sizes.
- AC-NFR-007-03: Core functionality shall remain available without horizontal overflow at supported viewport sizes.
- AC-NFR-007-04: Browser compatibility shall be verified through representative browser testing.

**Priority:** Must

**Release:** Taller 2 / Proyecto IA

**Traceability:**

- SPEC: Responsive interface and web application.
- Related Requirements: FR-004, FR-005, FR-009, NFR-005.

---

### 6.8 Maintainability

#### NFR-008 — Modular and Maintainable Codebase

**Category:**

Maintainability

**Description:**

The application shall maintain separation of concerns between presentation, HTTP handling, business logic, data access, authentication, and external integrations.

**Acceptance Criteria:**

- AC-NFR-008-01: Frontend components shall separate reusable interface elements from feature-specific behavior.
- AC-NFR-008-02: Backend operations shall preserve the separation between Route Handlers, controllers, services, and repositories.
- AC-NFR-008-03: Database access shall be centralized through the Prisma data-access layer.
- AC-NFR-008-04: AI providers shall be accessed through a provider abstraction rather than directly from interface components.
- AC-NFR-008-05: Shared validation schemas and types shall be reused where appropriate.
- AC-NFR-008-06: TypeScript shall be used for application code and strict type checking shall be enabled.

**Priority:** Must

**Release:** Taller 2 / Proyecto IA

**Traceability:**

- SPEC: Full-stack application and technical architecture.
- Related Requirements: NFR-002, NFR-003, NFR-009.

---

### 6.9 Testability

#### NFR-009 — Automated Verification

**Category:**

Testability

**Description:**

The application shall support automated verification of its critical business logic, component behavior, integrations, and end-to-end user flows.

**Acceptance Criteria:**

- AC-NFR-009-01: Business services, validation logic, permissions, and utility functions shall have unit tests.
- AC-NFR-009-02: Backend integration tests shall verify interactions between controllers, services, repositories, and persistence.
- AC-NFR-009-03: Interactive React components shall have component tests.
- AC-NFR-009-04: Critical user journeys shall have end-to-end tests.
- AC-NFR-009-05: External AI provider behavior shall be testable using controlled test doubles.
- AC-NFR-009-06: The test suite shall include relevant authorization, ownership, validation, and failure scenarios.

**Priority:** Must

**Release:** Taller 2 / Proyecto IA

**Traceability:**

- SPEC: Testing and application quality.
- Related Requirements: FR-001, FR-003, FR-009, FR-013, FR-019, NFR-003.

---

### 6.10 Observability and Diagnostics

#### NFR-010 — Error Diagnostics

**Category:**

Observability

**Description:**

The application shall provide diagnostic information for relevant application and external service failures without exposing sensitive information.

**Acceptance Criteria:**

- AC-NFR-010-01: Relevant server-side failures shall generate diagnostic logs.
- AC-NFR-010-02: AI provider failures shall be distinguishable by provider and failure category.
- AC-NFR-010-03: Logs shall not expose passwords, session credentials, API keys, or complete sensitive authentication data.
- AC-NFR-010-04: User-facing error messages shall communicate the problem without exposing stack traces or internal implementation details.

**Priority:** Should

**Release:** Proyecto IA

**Traceability:**

- SPEC: AI integration and error handling.
- Related Requirements: FR-016, NFR-002, NFR-003.

## 7. Requirement Priority Matrix

The following matrix consolidates the approved requirements and their release priorities.

| ID | Requirement | Type | Priority | Release | Status |
| --- | --- | --- | --- | --- | --- |
| FR-001 | User Registration | Functional | Must | Taller 2 | Approved |
| FR-002 | User Login and Session Management | Functional | Must | Taller 2 | Approved |
| FR-003 | Role-Based Access Control | Functional | Must | Taller 2 | Approved |
| FR-004 | Public Landing Page | Functional | Must | Taller 2 | Approved |
| FR-005 | Create Conversation | Functional | Must | Taller 2 | Approved |
| FR-006 | List Conversation History | Functional | Must | Taller 2 | Approved |
| FR-007 | Rename Conversation | Functional | Must | Taller 2 | Approved |
| FR-008 | Delete Conversation | Functional | Must | Taller 2 | Approved |
| FR-009 | Send Message | Functional | Must | Proyecto IA | Approved |
| FR-010 | Display Conversation Messages | Functional | Must | Taller 2 | Approved |
| FR-011 | Render Markdown Responses | Functional | Must | Proyecto IA | Approved |
| FR-012 | Copy Message Content | Functional | Should | Proyecto IA | Approved |
| FR-013 | Edit User Message and Regenerate Response | Functional | Must | Proyecto IA | Approved |
| FR-014 | Retry Assistant Response | Functional | Must | Proyecto IA | Approved |
| FR-015 | Rate Assistant Response | Functional | Should | Proyecto IA | Approved |
| FR-016 | Display Loading and Error States | Functional | Must | Taller 2 / Proyecto IA | Approved |
| FR-017 | Specialized Gastronomic Responses | Functional | Must | Proyecto IA | Approved |
| FR-018 | Apply Assistant System Instructions | Functional | Must | Proyecto IA | Approved |
| FR-019 | Manage Users and Roles | Functional | Must | Taller 2 | Approved |
| FR-020 | Configure the Assistant | Functional | Must | Proyecto IA | Approved |
| FR-021 | Consult General Statistics | Functional | Must | Proyecto IA | Approved |
| NFR-001 | Application Response Performance | Non-Functional | Should | Taller 2 / Proyecto IA | Approved |
| NFR-002 | AI Provider Resilience | Non-Functional | Must | Proyecto IA | Approved |
| NFR-003 | Authentication and Access Protection | Non-Functional | Must | Taller 2 / Proyecto IA | Approved |
| NFR-004 | User Data Isolation | Non-Functional | Must | Taller 2 / Proyecto IA | Approved |
| NFR-005 | Consistent User Interface | Non-Functional | Must | Taller 2 / Proyecto IA | Approved |
| NFR-006 | Accessible Interaction | Non-Functional | Should | Taller 2 / Proyecto IA | Approved |
| NFR-007 | Responsive Browser Compatibility | Non-Functional | Must | Taller 2 / Proyecto IA | Approved |
| NFR-008 | Modular and Maintainable Codebase | Non-Functional | Must | Taller 2 / Proyecto IA | Approved |
| NFR-009 | Automated Verification | Non-Functional | Must | Taller 2 / Proyecto IA | Approved |
| NFR-010 | Error Diagnostics | Non-Functional | Should | Proyecto IA | Approved |

## 8. Constraints

Constraints establish conditions that influence the application's scope, design, implementation, and operation.

### 8.1 Technical Constraints

| ID | Constraint | Description | Reason |
| --- | --- | --- | --- |
| C-001 | Full-Stack Framework | The application uses Next.js with the App Router, React, and TypeScript. | Required technology stack and integrated application architecture. |
| C-002 | Styling Framework | Tailwind CSS is the styling framework. | Required technology stack and consistent responsive styling. |
| C-003 | Database | Supabase PostgreSQL is the relational persistence layer. | Required database technology. |
| C-004 | ORM | Prisma provides the application's database access layer. | Consistent and typed data access. |
| C-005 | Package Manager | pnpm is the exclusive package manager. | Project tooling convention. |
| C-006 | Backend Architecture | Next.js Route Handlers provide the HTTP interface; a separate Express or NestJS backend is not part of the application. | Integrated full-stack architecture. |
| C-007 | Authentication | Auth.js with the Prisma Adapter manages authentication and session persistence. | Unified authentication and PostgreSQL persistence. |
| C-008 | AI Providers | OpenRouter is the primary provider and Groq is the fallback provider. | Provider availability and resilience. |
| C-009 | Server-Side Credentials | Database credentials and AI provider keys remain exclusively in server-side configuration. | Protection of sensitive credentials. |
| C-010 | Deployment Platform | Vercel is the web deployment platform. | Project deployment environment. |

### 8.2 Project Constraints

| ID | Constraint | Description | Reason |
| --- | --- | --- | --- |
| C-011 | Academic Project | Dolce Vita is developed as part of the Ingeniería Web project at Universidad de Antioquia. | Academic context and evaluation requirements. |
| C-012 | Team Repository | The application source code is maintained in the `CodeChef-AI-Chat` repository. | Shared project development and evaluation. |
| C-013 | Single Specialized Assistant | The application provides one specialized assistant, George. | The project specification requires one assistant specialization per team. |
| C-014 | Staged Academic Deliverables | The application includes the Taller 2 functional foundation and the subsequent Proyecto IA integration. | The two academic deliverables share the same application. |

### 8.3 Regulatory and Organizational Constraints

| ID | Constraint | Applicable Scope | Reference |
| --- | --- | --- | --- |
| C-015 | Personal Data Protection | User account information, conversations, messages, and associated records. | Applicable personal data protection obligations in the deployment jurisdiction. |
| C-016 | Third-Party Service Terms | AI provider usage and application deployment. | Terms and usage policies of OpenRouter, Groq, Supabase, and Vercel. |
| C-017 | Academic Evaluation | Application functionality, documentation, AI specialization, testing, and deployment. | Ingeniería Web project specification. |

## 9. Business Rules

Business rules define domain-specific conditions that remain consistent regardless of the interface or implementation.

### BR-001 — Conversation Ownership

**Description:**

Every conversation belongs to one registered user.

**Conditions:**

- A conversation has one owner.
- Only the owner can manage the conversation through ordinary user operations.
- Administrative privileges do not replace the ownership checks required by user-facing operations.

**Expected Behavior:**

The system validates conversation ownership before retrieving, modifying, or deleting a conversation or its messages.

**Related Requirements:**

- FR-005
- FR-006
- FR-007
- FR-008
- FR-009
- NFR-003
- NFR-004

---

### BR-002 — Message Association

**Description:**

Every message belongs to one conversation.

**Conditions:**

- A message is associated with its corresponding conversation.
- The conversation determines the user context under which the message can be accessed.
- User and assistant messages are distinguishable by their roles.

**Expected Behavior:**

The system retrieves and manages messages within the context of their parent conversation and enforces the corresponding ownership permissions.

**Related Requirements:**

- FR-009
- FR-010
- FR-013
- FR-014

---

### BR-003 — Conversation Context

**Description:**

Assistant responses use the relevant conversation history as context.

**Conditions:**

- Messages are processed in their conversation context.
- The assistant receives the applicable previous messages when generating a response.
- A modified user message changes the context of subsequent responses.

**Expected Behavior:**

The system maintains chronological conversation context. When a previous user message is edited, dependent subsequent messages and responses are invalidated before a new response is generated.

**Related Requirements:**

- FR-009
- FR-010
- FR-013
- FR-014

---

### BR-004 — Assistant Specialization

**Description:**

George operates as a gastronomic assistant rather than a general-purpose assistant.

**Conditions:**

- Its specialization covers recipes, cooking techniques, and ingredient substitutions.
- Its identity, behavior, limits, and response format are defined through system instructions.
- Requests outside its domain are handled according to those limits.

**Expected Behavior:**

The assistant provides domain-relevant responses and communicates uncertainty or specialization boundaries when applicable.

**Related Requirements:**

- FR-017
- FR-018
- FR-020

---

### BR-005 — Role Permissions

**Description:**

Application operations are restricted according to the authenticated user's role.

**Conditions:**

- `USER` accounts access conversational functionality and their own conversations.
- `ADMIN` accounts access administrative functionality.
- Role and ownership checks are performed server-side.

**Expected Behavior:**

The system rejects operations that exceed the authenticated user's permissions.

**Related Requirements:**

- FR-003
- FR-019
- FR-020
- FR-021
- NFR-003

---

### BR-006 — AI Provider Selection

**Description:**

The AI integration follows a primary-provider and fallback-provider strategy.

**Conditions:**

- OpenRouter is the primary provider.
- Groq is the fallback provider.
- Fallback is triggered by provider availability failures, including network errors, timeouts, HTTP 429, HTTP 5xx, and model unavailability.
- Application validation errors are not provider availability failures.

**Expected Behavior:**

The AI provider service attempts the primary provider first and uses the fallback provider when an applicable availability failure occurs. If both providers fail, the system reports an unsuccessful operation.

**Related Requirements:**

- FR-009
- FR-016
- NFR-002

---

### BR-007 — Feedback Association

**Description:**

Feedback belongs to the assistant response being evaluated and the user submitting it.

**Conditions:**

- Feedback is associated with an assistant message.
- The submitting user must have permission to access the corresponding conversation.
- Feedback expresses a positive or negative evaluation.

**Expected Behavior:**

The system persists feedback with its corresponding user and assistant response.

**Related Requirements:**

- FR-015
- NFR-004

## 10. Edge Cases

| ID | Scenario | Expected Behavior | Related Requirements |
| --- | --- | --- | --- |
| EC-001 | Registration with an existing email address | The system rejects the registration and communicates the validation error. | FR-001 |
| EC-002 | Login with invalid credentials | The system denies authentication without exposing sensitive account information. | FR-002, NFR-003 |
| EC-003 | Expired or invalid session | The system denies access to protected resources and requires authentication. | FR-002, FR-003 |
| EC-004 | User accesses another user's conversation | The system rejects the operation without disclosing the protected resource's content. | FR-006, FR-008, NFR-003 |
| EC-005 | Empty or whitespace-only message | The system rejects the message before invoking an AI provider. | FR-009 |
| EC-006 | Message exceeds the supported input limit | The system rejects the message and communicates the applicable validation error. | FR-009 |
| EC-007 | Conversation has no messages | The interface displays the empty conversation state. | FR-010 |
| EC-008 | Conversation title is empty or invalid | The system rejects the title modification and preserves the previous valid title. | FR-007 |
| EC-009 | User cancels conversation deletion | The system preserves the conversation and its associated data. | FR-008 |
| EC-010 | User edits an earlier message | The system invalidates dependent subsequent messages and generates a new response using the updated context. | FR-013 |
| EC-011 | Assistant retry is requested for an unavailable message | The system rejects the operation or communicates that the response cannot be regenerated. | FR-014 |
| EC-012 | Clipboard permission is unavailable | The system communicates that the copy operation failed. | FR-012 |
| EC-013 | Primary AI provider experiences a network failure or timeout | The system attempts response generation through Groq. | FR-016, NFR-002 |
| EC-014 | Primary AI provider returns HTTP 429 or HTTP 5xx | The system attempts response generation through Groq. | FR-016, NFR-002 |
| EC-015 | Both AI providers are unavailable | The system reports the failure and does not present a fabricated response. | FR-016, NFR-002 |
| EC-016 | AI provider returns an unusable or empty response | The system handles the result as an unsuccessful response and communicates the error. | FR-009, FR-016 |
| EC-017 | Two equivalent message submissions occur during processing | The system prevents accidental duplicate processing for the same active submission. | FR-009, FR-016 |
| EC-018 | Unauthorized user invokes an administrative endpoint directly | The backend rejects the request regardless of client-side navigation restrictions. | FR-003, FR-019, NFR-003 |
| EC-019 | Administrator submits an invalid assistant configuration | The system rejects the configuration and preserves the last valid configuration. | FR-020 |
| EC-020 | Statistics are requested when no application records exist | The interface displays valid zero-value statistics rather than an application error. | FR-021 |
| EC-021 | Database operation fails during a conversation update | The system reports the failure and preserves data consistency. | FR-007, FR-008, FR-013 |
| EC-022 | User changes theme while using the application | The interface applies the selected theme consistently to visible application components. | NFR-005 |

## 11. Out of Scope

| ID | Excluded Item | Reason | Potential Future Release |
| --- | --- | --- | --- |
| OOS-001 | Multiple specialized assistants | The academic project defines one assistant specialization per team. | Won't |
| OOS-002 | Native mobile applications | The repository delivers a responsive web application. | Unknown |
| OOS-003 | Food ordering and payment processing | These capabilities are outside the gastronomic assistant's scope. | Won't |
| OOS-004 | Restaurant reservation management | The application focuses on gastronomic guidance rather than restaurant booking. | Won't |
| OOS-005 | Social networking and public conversation sharing | Public community features are not part of the approved product scope. | Won't |
| OOS-006 | Proprietary model training or fine-tuning | The application consumes external language model APIs. | Won't |
| OOS-007 | Direct user configuration of AI provider credentials | Provider configuration and credentials remain under server-side control. | Won't |

## 12. Traceability Matrix

The following matrix connects product capabilities with user flows, requirements, and verification references.

| SPEC Feature | User Flow | Requirement | Acceptance Criteria | Implementation Task |
| --- | --- | --- | --- | --- |
| Authentication and users | Registration | FR-001 | AC-FR-001-01 to AC-FR-001-05 | PLAN.md — Authentication |
| Authentication and users | Login and logout | FR-002 | AC-FR-002-01 to AC-FR-002-05 | PLAN.md — Authentication |
| Roles and permissions | Protected navigation | FR-003 | AC-FR-003-01 to AC-FR-003-06 | PLAN.md — Authorization |
| Public interface | Access landing page | FR-004 | AC-FR-004-01 to AC-FR-004-04 | PLAN.md — Public interface |
| Conversation management | Create conversation | FR-005 | AC-FR-005-01 to AC-FR-005-04 | PLAN.md — Conversations |
| Conversation management | View history | FR-006 | AC-FR-006-01 to AC-FR-006-05 | PLAN.md — Conversations |
| Conversation management | Rename conversation | FR-007 | AC-FR-007-01 to AC-FR-007-04 | PLAN.md — Conversations |
| Conversation management | Delete conversation | FR-008 | AC-FR-008-01 to AC-FR-008-05 | PLAN.md — Conversations |
| Chat | Send message | FR-009 | AC-FR-009-01 to AC-FR-009-07 | PLAN.md — Chat and AI integration |
| Chat | Open conversation | FR-010 | AC-FR-010-01 to AC-FR-010-05 | PLAN.md — Chat |
| Chat presentation | Read assistant response | FR-011 | AC-FR-011-01 to AC-FR-011-06 | PLAN.md — Markdown rendering |
| Chat interaction | Copy message | FR-012 | AC-FR-012-01 to AC-FR-012-03 | PLAN.md — Message actions |
| Chat interaction | Edit and regenerate | FR-013 | AC-FR-013-01 to AC-FR-013-07 | PLAN.md — Message actions |
| Chat interaction | Retry response | FR-014 | AC-FR-014-01 to AC-FR-014-05 | PLAN.md — Message actions |
| Chat feedback | Rate response | FR-015 | AC-FR-015-01 to AC-FR-015-05 | PLAN.md — Feedback |
| Chat state handling | Processing and errors | FR-016 | AC-FR-016-01 to AC-FR-016-05 | PLAN.md — Chat state handling |
| Assistant specialization | Ask gastronomic question | FR-017 | AC-FR-017-01 to AC-FR-017-06 | PLAN.md — Assistant specialization |
| Assistant configuration | Apply system instructions | FR-018 | AC-FR-018-01 to AC-FR-018-05 | PLAN.md — Assistant configuration |
| Administration | Manage users and roles | FR-019 | AC-FR-019-01 to AC-FR-019-06 | PLAN.md — Administration |
| Administration | Configure assistant | FR-020 | AC-FR-020-01 to AC-FR-020-06 | PLAN.md — Administration |
| Administration | Consult statistics | FR-021 | AC-FR-021-01 to AC-FR-021-06 | PLAN.md — Administration |
| Performance | Retrieve conversations and messages | NFR-001 | AC-NFR-001-01 to AC-NFR-001-03 | PLAN.md — Performance verification |
| AI reliability | Provider fallback | NFR-002 | AC-NFR-002-01 to AC-NFR-002-05 | PLAN.md — AI provider integration |
| Security | Authentication and authorization | NFR-003 | AC-NFR-003-01 to AC-NFR-003-07 | PLAN.md — Security |
| Privacy | User data isolation | NFR-004 | AC-NFR-004-01 to AC-NFR-004-05 | PLAN.md — Data protection |
| Usability | Consistent interface | NFR-005 | AC-NFR-005-01 to AC-NFR-005-06 | PLAN.md — Interface |
| Accessibility | Accessible interactions | NFR-006 | AC-NFR-006-01 to AC-NFR-006-05 | PLAN.md — Accessibility |
| Compatibility | Responsive browser support | NFR-007 | AC-NFR-007-01 to AC-NFR-007-04 | PLAN.md — Compatibility |
| Maintainability | Modular codebase | NFR-008 | AC-NFR-008-01 to AC-NFR-008-06 | ARCHITECTURE.md |
| Testability | Automated verification | NFR-009 | AC-NFR-009-01 to AC-NFR-009-06 | PLAN.md — Testing |
| Observability | Error diagnostics | NFR-010 | AC-NFR-010-01 to AC-NFR-010-04 | PLAN.md — Diagnostics |

Traceability supports both directions:

- **Forward traceability:** Every approved feature and requirement is associated with acceptance criteria and a corresponding implementation reference.
- **Backward traceability:** Implementation and verification activities are associated with an approved requirement, constraint, or justified technical activity.

## 13. Requirement Dependencies

| Requirement | Depends On | Dependency Type | Reason |
| --- | --- | --- | --- |
| FR-002 | FR-001 | Functional | Login requires an existing registered account. |
| FR-003 | FR-002 | Security | Role-based access requires an authenticated identity. |
| FR-005 | FR-002 | Functional | Conversation creation requires an authenticated user. |
| FR-006 | FR-005 | Data | Conversation history depends on persisted conversations. |
| FR-007 | FR-005 | Data | Renaming requires an existing conversation. |
| FR-008 | FR-005 | Data | Deletion requires an existing conversation and its ownership context. |
| FR-009 | FR-005, FR-018 | Functional | Message processing requires a conversation and active assistant instructions. |
| FR-010 | FR-005, FR-009 | Data | Message display depends on persisted conversation messages. |
| FR-011 | FR-009 | Functional | Markdown rendering applies to generated assistant responses. |
| FR-013 | FR-009, FR-010 | Functional | Message editing requires an existing conversation context and message history. |
| FR-014 | FR-009, FR-010 | Functional | Response retry requires a previous user message and its conversation context. |
| FR-015 | FR-009, FR-010 | Data | Feedback requires an existing assistant response. |
| FR-017 | FR-018 | Functional | Specialized responses depend on the assistant's active instructions. |
| FR-018 | FR-020 | Functional | The active system instructions originate from the assistant configuration. |
| FR-019 | FR-003 | Security | User and role administration requires administrative authorization. |
| FR-020 | FR-003 | Security | Assistant configuration requires administrative authorization. |
| FR-021 | FR-003 | Security | Statistics access requires administrative authorization. |
| NFR-002 | FR-009 | External | Provider resilience applies to AI message processing. |
| NFR-003 | FR-001, FR-002, FR-003 | Security | Authentication and authorization requirements establish access protection. |
| NFR-004 | FR-005, FR-006, FR-008 | Data | Data isolation depends on ownership and persistence rules. |
| NFR-009 | NFR-008 | Technical | Modular boundaries support isolated and integration testing. |

## 14. Verification Strategy

Verification establishes whether the implementation satisfies the approved requirements and acceptance criteria.

### 14.1 Verification Methods

| Method | Purpose |
| --- | --- |
| Inspection | Verify documentation, configuration, implementation, and compliance with defined standards. |
| Analysis | Evaluate properties through calculations, models, static analysis, or technical examination. |
| Demonstration | Confirm observable behavior through system execution. |
| Testing | Execute defined test cases and compare actual results with expected results. |

### 14.2 Verification Levels

The project uses the following verification levels:

- **Unit Testing:** Verify isolated functions, services, validators, permissions, mappers, and business rules using Vitest.
- **Integration Testing:** Verify interactions between controllers, services, repositories, Prisma, PostgreSQL, and external service boundaries.
- **Component Testing:** Verify React component behavior and user interactions using Testing Library.
- **System Testing:** Verify complete application behavior through integrated execution.
- **Acceptance Testing:** Verify that the application satisfies the approved functional and non-functional acceptance criteria.
- **Performance Testing:** Measure response times under defined workloads.
- **Security Testing:** Verify authentication, authorization, role restrictions, ownership checks, and protection of sensitive information.
- **Compatibility Testing:** Verify the application in supported browsers and viewport sizes.
- **End-to-End Testing:** Verify critical user journeys through Playwright.

Vitest and Testing Library cover unit and component behavior. Playwright verifies complete browser flows, including asynchronous Server Component interactions.

### 14.3 Requirement Verification Matrix

| Requirement | Verification Method | Test Level | Evidence | Status |
| --- | --- | --- | --- | --- |
| FR-001 | Testing | Integration / Acceptance | Registration test cases | Defined |
| FR-002 | Testing | Integration / E2E | Login, session, and logout test cases | Defined |
| FR-003 | Testing | Integration / Security | Role and authorization test cases | Defined |
| FR-004 | Demonstration / Testing | System / E2E | Landing page and responsive interface tests | Defined |
| FR-005 | Testing | Integration / E2E | Conversation creation tests | Defined |
| FR-006 | Testing | Integration / E2E | History and ownership tests | Defined |
| FR-007 | Testing | Integration / E2E | Conversation rename tests | Defined |
| FR-008 | Testing | Integration / E2E | Conversation deletion tests | Defined |
| FR-009 | Testing | Integration / E2E | Message submission and AI integration tests | Defined |
| FR-010 | Testing | Component / E2E | Message ordering and retrieval tests | Defined |
| FR-011 | Testing | Component / System | Markdown rendering and unsafe HTML tests | Defined |
| FR-012 | Demonstration / Testing | Component / E2E | Clipboard interaction tests | Defined |
| FR-013 | Testing | Integration / E2E | Message editing and context regeneration tests | Defined |
| FR-014 | Testing | Integration / E2E | Response retry tests | Defined |
| FR-015 | Testing | Integration / E2E | Feedback persistence tests | Defined |
| FR-016 | Testing | Component / E2E | Loading and error state tests | Defined |
| FR-017 | Testing | System / Acceptance | Gastronomic assistant evaluation questions | Defined |
| FR-018 | Inspection / Testing | Integration / Acceptance | System instruction configuration tests | Defined |
| FR-019 | Testing | Integration / Security | Administrative user management tests | Defined |
| FR-020 | Testing | Integration / Security | Assistant configuration tests | Defined |
| FR-021 | Testing | Integration / Acceptance | Statistics calculation and access tests | Defined |
| NFR-001 | Analysis / Testing | Performance | Response time measurements under the defined workload | Defined |
| NFR-002 | Testing | Integration | Primary and fallback provider failure simulations | Defined |
| NFR-003 | Testing / Inspection | Security | Authentication, authorization, and secret exposure tests | Defined |
| NFR-004 | Testing | Integration / Security | Cross-user data isolation tests | Defined |
| NFR-005 | Inspection / Demonstration | System | Interface consistency review | Defined |
| NFR-006 | Inspection / Testing | Accessibility | Keyboard, focus, labeling, and contrast checks | Defined |
| NFR-007 | Testing | Compatibility | Browser and viewport test results | Defined |
| NFR-008 | Inspection / Analysis | Architecture | Code structure and type-checking results | Defined |
| NFR-009 | Inspection / Testing | Unit / Integration / E2E | Automated test execution results | Defined |
| NFR-010 | Testing / Inspection | Integration | Diagnostic logging and sensitive-data review | Defined |

Every `Must` requirement has defined acceptance criteria and an applicable verification method. A `Defined` verification status means the verification method and evidence type are specified; it does not imply that the corresponding implementation or test has already been executed.

## 15. Open Questions and Decisions

### 15.1 Open Questions

There are no unresolved requirement questions affecting the approved scope.

### 15.2 Resolved Decisions

- **[RESOLVED] Product identity:** The application is named Dolce Vita and its assistant is named George.
- **[RESOLVED] Assistant specialization:** The application provides one gastronomic assistant focused on recipes, cooking techniques, and ingredient substitutions.
- **[RESOLVED] Repository:** The project repository is `CodeChef-AI-Chat`.
- **[RESOLVED] Architecture:** The application uses a modular layered monolith based on Next.js Route Handlers.
- **[RESOLVED] Frontend stack:** Next.js App Router, React, TypeScript, and Tailwind CSS.
- **[RESOLVED] Package manager:** pnpm is the exclusive package manager.
- **[RESOLVED] Persistence:** Supabase PostgreSQL is the database and Prisma is the ORM.
- **[RESOLVED] Authentication:** Auth.js with the Prisma Adapter manages authentication and session persistence.
- **[RESOLVED] Password handling:** bcryptjs provides password hashing for credential-based registration.
- **[RESOLVED] Validation:** Zod validates application input.
- **[RESOLVED] AI provider strategy:** OpenRouter is the primary provider and Groq is the fallback provider.
- **[RESOLVED] AI provider integration:** Provider access is server-side and isolated behind a provider abstraction.
- **[RESOLVED] Markdown rendering:** `react-markdown`, `remark-gfm`, and `rehype-highlight` provide Markdown and code rendering.
- **[RESOLVED] Interface themes:** The application supports light and dark themes using the approved Dolce Vita design system.
- **[RESOLVED] Testing stack:** Vitest, Testing Library, MSW, and Playwright cover automated verification.
- **[RESOLVED] CI/CD:** GitHub Actions provides the repository's automation pipeline.
- **[RESOLVED] Deployment:** Vercel is the application deployment platform.

### 15.3 Deferred Decisions

No deferred product-scope decisions are required for the approved requirements in this document.

## 16. Requirement Change Management

Changes to approved requirements are evaluated before incorporation into the project.

Each change considers:

1. Reason for the change.
2. Affected requirements and acceptance criteria.
3. Impact on product scope and release priorities.
4. Dependencies and affected system components.
5. Impact on architecture, implementation, and testing.
6. Required updates to related documentation.
7. Approval or rejection decision.

A requirement change is reflected consistently in `SPEC.md`, `ARCHITECTURE.md`, `DATABASE.md`, `API.md`, and other affected project documents.

### 16.1 Change Log

| Version | Date | Changed Requirements | Description | Author |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-11-06 | Initial | Initial approved requirements specification for Dolce Vita. | CodeChef-AI-Chat Team |

## 17. Definition of Done

The requirements covered by a release or milestone are considered complete when:

- [ ] All applicable `Must` requirements have been implemented.
- [ ] Each implemented requirement satisfies its approved acceptance criteria.
- [ ] Required automated and manual tests have passed.
- [ ] Relevant edge cases and failure scenarios have been verified.
- [ ] Applicable non-functional requirements have been evaluated.
- [ ] No unresolved critical defects prevent the intended functionality from operating correctly.
- [ ] Security and privacy requirements have been verified where applicable.
- [ ] Related documentation reflects the implemented behavior.
- [ ] Requirement traceability has been updated.
- [ ] Deferred or excluded requirements have an explicit status.
- [ ] The release or milestone has received the required approval.

A requirement is not considered verified solely because its implementation exists. Verification requires evidence that its acceptance criteria are satisfied.

## 18. Related Documentation

| Document | Purpose |
| --- | --- |
| [SPEC.md](SPEC.md) | Defines product scope, capabilities, and expected product behavior. |
| [USERJOURNEY.md](USERJOURNEY.md) | Describes user journeys and interaction flows. |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Defines system structure, components, and architectural boundaries. |
| [API.md](API.md) | Defines HTTP API contracts and interface behavior. |
| [DATABASE.md](DATABASE.md) | Documents data structures, relationships, and persistence rules. |
| [SECURITY.md](SECURITY.md) | Defines security policies, access controls, and protection expectations. |
| [DESIGNSYSTEM.md](DESIGNSYSTEM.md) | Defines visual identity, color palette, themes, and interface conventions. |
| [PLAN.md](PLAN.md) | Defines the technical implementation strategy. |
| [DEPLOY.md](DEPLOY.md) | Documents build, deployment, and release procedures. |

---

**Document Status:** Approved

**Last Updated:** 2026-11-06

**Approved By:** CodeChef-AI-Chat Team

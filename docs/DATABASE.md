# Database

## Document Information

| Field | Value |
| --- | --- |
| Project | `CodeChef-AI-Chat (Dolce Vita)` |
| Document | Database |
| Version | `1.0.0` |
| Status | `Approved` |
| Last Updated | `2026-11-06` |
| Persistence | `PostgreSQL through Prisma ORM` |
| Local database | `None` |
| Cloud database | `PostgreSQL (Supabase)` |

---

## 1. Purpose

The persistence layer stores the data required by Dolce Vita, a conversational application that provides specialized gastronomic assistance through its AI assistant, George.

It owns user and authentication records, conversations, messages, message revision history, response feedback, and assistant configuration. PostgreSQL is the authoritative data store, while Prisma provides the application-level data access and relational mapping.

The defined data model is limited to the conversational experience. It does not include recipe catalogs, ingredients, gastronomic categories, favorites, or other independent recipe-management entities.

## 2. Persistence Strategy

### 2.1 Source of Truth

PostgreSQL is the single source of truth for persistent application data.

| Data Category | Source of Truth | Notes |
| --- | --- | --- |
| User profiles and roles | PostgreSQL | Managed through the authentication and application layers. |
| Authentication accounts and sessions | PostgreSQL | Managed through the Auth.js Prisma Adapter. |
| Conversations | PostgreSQL | Each conversation belongs to one user. |
| Messages | PostgreSQL | Stores user and assistant messages. |
| Message revisions | PostgreSQL | Preserves previous content when a user edits a message. |
| Message feedback | PostgreSQL | Stores positive or negative ratings and optional comments. |
| Assistant configuration | PostgreSQL | Stores the active assistant identity and system prompt. |
| Temporary interface state | Client memory | Includes transient input, loading, and interaction state. It is not authoritative persistent data. |

### 2.2 Local Persistence

The application does not use a local database or browser-based persistent storage as a second source of truth.

Transient interface state remains in client memory. It includes unsent message input, temporary loading indicators, open menus, and other short-lived interaction state.

Persistent conversations, messages, revisions, feedback, and configuration are stored on the server in PostgreSQL.

### 2.3 Cloud Persistence

Supabase PostgreSQL is the application's relational database.

Prisma ORM provides:

- A typed representation of database entities.
- Relational queries and mutations.
- Referential integrity through database constraints.
- Transaction support for operations involving multiple records.
- Versioned schema migrations.

The application accesses PostgreSQL through server-side repositories. Database credentials and connection configuration remain server-side and are not exposed to the browser.

### 2.4 Synchronization

There is no local-to-cloud database synchronization process because the application does not maintain a separate local database.

Persistent operations are performed against PostgreSQL through the application's server-side API. The client updates its interface using the responses returned by those operations.

### 2.5 Caching

PostgreSQL remains authoritative for persistent data. The persistence architecture does not use a separate distributed cache or a second persistence service.

Conversation and message data may be retained in client memory while a conversation is open to support interface interactions. Such state must not replace server-side ownership checks or database records.

User-specific data must not be shared through public or cross-user cache entries.

### 2.6 Offline Behavior

The application requires a network connection for authentication, conversation retrieval, message persistence, AI generation, and feedback submission.

When the server or database cannot be reached, the interface communicates the failure and preserves any unsent input that remains in the current client session when possible. It does not claim that a message has been saved until the server confirms the operation.

The application does not provide offline conversation synchronization.

## 3. Data Ownership

| Data | Owner | Persistence | Retention | Sensitive |
| --- | --- | --- | --- | --- |
| User profile | Individual user / system | PostgreSQL | Until account deletion or applicable retention policy | Yes |
| Authentication accounts | Individual user / authentication system | PostgreSQL | While linked to the user account | Yes |
| Authentication sessions | Authentication system | PostgreSQL | Until expiration or revocation | Yes |
| Verification tokens | Authentication system | PostgreSQL | Until expiration or consumption | Yes |
| Conversations | Individual user | PostgreSQL | Until user or authorized administrator deletion | Yes |
| Messages | Conversation owner / application | PostgreSQL | With the associated conversation | Yes |
| Message revisions | Conversation owner / application | PostgreSQL | With the associated message | Yes |
| Message feedback | Feedback author / application | PostgreSQL | With the associated message or user account | Yes |
| Assistant configuration | Administrator / system | PostgreSQL | Until configuration replacement or deletion | Yes |

Conversation content and feedback may contain personal information supplied by users. Access must therefore be restricted to the conversation owner and authorized administrative operations.

## 4. Relational Model

The relational model uses Prisma models mapped to PostgreSQL tables. Identifiers are represented as strings generated by Prisma, and timestamps use PostgreSQL-compatible date-time values.

### 4.1 Entity: `User`

Represents a registered application user and their application role.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `String` | `PRIMARY KEY` | Unique user identifier. |
| `name` | `String` | `NOT NULL` | User's display name. |
| `email` | `String` | `NOT NULL, UNIQUE` | User's email address. |
| `emailVerified` | `DateTime?` | `NULLABLE` | Date and time when the email was verified. |
| `image` | `String?` | `NULLABLE` | Optional profile image URL. |
| `passwordHash` | `String?` | `NULLABLE` | Password hash for credentials-based authentication. |
| `role` | `Role` | `NOT NULL, DEFAULT USER` | Application authorization role. |
| `createdAt` | `DateTime` | `NOT NULL, DEFAULT NOW()` | Record creation timestamp. |
| `updatedAt` | `DateTime` | `NOT NULL, AUTO-UPDATED` | Last record update timestamp. |

#### 4.1.1 Keys

- Primary key: `id`.
- Foreign keys: None.
- Unique constraints: `email`.

#### 4.1.2 Indexes

| Index | Columns | Purpose |
| --- | --- | --- |
| `User_email_key` | `email` | Locate users by email and prevent duplicate accounts. |

`passwordHash` is nullable because Auth.js supports external authentication providers that do not require a locally stored password. When credentials-based authentication is used, the application requires a valid password hash for the corresponding account.

### 4.2 Entity: `Account`

Represents an external or credentials-based authentication account linked to a user. Its structure follows the Auth.js Prisma Adapter conventions.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `String` | `PRIMARY KEY` | Unique account record identifier. |
| `userId` | `String` | `NOT NULL, FOREIGN KEY` | User who owns the authentication account. |
| `type` | `String` | `NOT NULL` | Authentication account type. |
| `provider` | `String` | `NOT NULL` | Authentication provider identifier. |
| `providerAccountId` | `String` | `NOT NULL` | Account identifier assigned by the provider. |
| `refresh_token` | `String?` | `NULLABLE` | Provider refresh token, when supplied. |
| `access_token` | `String?` | `NULLABLE` | Provider access token, when supplied. |
| `expires_at` | `Int?` | `NULLABLE` | Access token expiration timestamp. |
| `token_type` | `String?` | `NULLABLE` | Token type returned by the provider. |
| `scope` | `String?` | `NULLABLE` | Granted authentication scopes. |
| `id_token` | `String?` | `NULLABLE` | Provider identity token, when supplied. |
| `session_state` | `String?` | `NULLABLE` | Provider session state, when supplied. |

#### 4.2.1 Keys

- Primary key: `id`.
- Foreign keys: `userId` references `User.id`.
- Unique constraints: Composite unique constraint on `provider` and `providerAccountId`.

#### 4.2.2 Indexes

| Index | Columns | Purpose |
| --- | --- | --- |
| `Account_userId_idx` | `userId` | Retrieve authentication accounts linked to a user. |
| `Account_provider_providerAccountId_key` | `provider`, `providerAccountId` | Prevent duplicate provider account associations. |

### 4.3 Entity: `Session`

Stores authentication sessions managed by Auth.js.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `String` | `PRIMARY KEY` | Unique session record identifier. |
| `sessionToken` | `String` | `NOT NULL, UNIQUE` | Session token used by Auth.js. |
| `userId` | `String` | `NOT NULL, FOREIGN KEY` | User associated with the session. |
| `expires` | `DateTime` | `NOT NULL` | Session expiration date and time. |

#### 4.3.1 Keys

- Primary key: `id`.
- Foreign keys: `userId` references `User.id`.
- Unique constraints: `sessionToken`.

#### 4.3.2 Indexes

| Index | Columns | Purpose |
| --- | --- | --- |
| `Session_userId_idx` | `userId` | Retrieve sessions belonging to a user. |

### 4.4 Entity: `VerificationToken`

Stores tokens used by Auth.js for account verification and other supported verification flows.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `identifier` | `String` | `NOT NULL` | Identifier associated with the verification request, commonly an email address. |
| `token` | `String` | `NOT NULL` | Verification token. |
| `expires` | `DateTime` | `NOT NULL` | Token expiration date and time. |

#### 4.4.1 Keys

- Primary key: No separate identifier is required by the standard Auth.js Prisma Adapter model.
- Foreign keys: None.
- Unique constraints: Composite unique constraint on `identifier` and `token`.

#### 4.4.2 Indexes

| Index | Columns | Purpose |
| --- | --- | --- |
| `VerificationToken_identifier_token_key` | `identifier`, `token` | Ensure a verification token is unique for its identifier. |

### 4.5 Entity: `Conversation`

Represents a conversation created and owned by a user.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `String` | `PRIMARY KEY` | Unique conversation identifier. |
| `userId` | `String` | `NOT NULL, FOREIGN KEY` | User who owns the conversation. |
| `assistantConfigId` | `String?` | `NULLABLE, FOREIGN KEY` | Assistant configuration associated with the conversation. |
| `title` | `String` | `NOT NULL` | Conversation title. |
| `createdAt` | `DateTime` | `NOT NULL, DEFAULT NOW()` | Conversation creation timestamp. |
| `updatedAt` | `DateTime` | `NOT NULL, AUTO-UPDATED` | Timestamp used to track the latest conversation activity. |

#### 4.5.1 Keys

- Primary key: `id`.
- Foreign keys:
  - `userId` references `User.id`.
  - `assistantConfigId` references `AssistantConfig.id`.
- Unique constraints: None.

#### 4.5.2 Indexes

| Index | Columns | Purpose |
| --- | --- | --- |
| `Conversation_userId_updatedAt_idx` | `userId`, `updatedAt` | Retrieve a user's conversations ordered by recent activity. |
| `Conversation_assistantConfigId_idx` | `assistantConfigId` | Retrieve conversations associated with a configuration. |

The initial title may be generated from the user's first message. Users can subsequently rename their conversations. Updating a conversation's messages must also update its `updatedAt` value so that the conversation history can be ordered by recent activity.

### 4.6 Entity: `Message`

Represents a message sent by a user or generated by the assistant within a conversation.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `String` | `PRIMARY KEY` | Unique message identifier. |
| `conversationId` | `String` | `NOT NULL, FOREIGN KEY` | Conversation containing the message. |
| `senderId` | `String?` | `NULLABLE, FOREIGN KEY` | User associated with the message sender, when applicable. |
| `role` | `MessageRole` | `NOT NULL` | Message origin: user, assistant, or system. |
| `content` | `Text` | `NOT NULL` | Message content. |
| `status` | `MessageStatus` | `NOT NULL` | Message generation or processing status. |
| `provider` | `AIProvider?` | `NULLABLE` | AI provider used to generate the response, when applicable. |
| `model` | `String?` | `NULLABLE` | Model identifier used to generate the response, when applicable. |
| `createdAt` | `DateTime` | `NOT NULL, DEFAULT NOW()` | Message creation timestamp. |
| `updatedAt` | `DateTime` | `NOT NULL, AUTO-UPDATED` | Last message update timestamp. |
| `editedAt` | `DateTime?` | `NULLABLE` | Timestamp of the latest user edit, when applicable. |

#### 4.6.1 Keys

- Primary key: `id`.
- Foreign keys:
  - `conversationId` references `Conversation.id`.
  - `senderId` references `User.id`.
- Unique constraints: None.

#### 4.6.2 Indexes

| Index | Columns | Purpose |
| --- | --- | --- |
| `Message_conversationId_createdAt_idx` | `conversationId`, `createdAt` | Retrieve messages in chronological order within a conversation. |
| `Message_senderId_idx` | `senderId` | Retrieve messages associated with a user sender. |

The `role` field distinguishes user, assistant, and system messages without requiring separate message tables. Provider and model information are optional because they are not applicable to every message.

### 4.7 Entity: `MessageRevision`

Stores the previous content of a message when a user edits it.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `String` | `PRIMARY KEY` | Unique revision identifier. |
| `messageId` | `String` | `NOT NULL, FOREIGN KEY` | Message associated with the revision. |
| `previousContent` | `Text` | `NOT NULL` | Message content before the edit. |
| `createdAt` | `DateTime` | `NOT NULL, DEFAULT NOW()` | Revision creation timestamp. |

#### 4.7.1 Keys

- Primary key: `id`.
- Foreign keys: `messageId` references `Message.id`.
- Unique constraints: None.

#### 4.7.2 Indexes

| Index | Columns | Purpose |
| --- | --- | --- |
| `MessageRevision_messageId_createdAt_idx` | `messageId`, `createdAt` | Retrieve a message's revisions in chronological order. |

Each edit creates a revision containing the previous message content. The current content remains in `Message.content`.

### 4.8 Entity: `MessageFeedback`

Stores a user's rating of an assistant response, with an optional comment.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `String` | `PRIMARY KEY` | Unique feedback identifier. |
| `messageId` | `String` | `NOT NULL, FOREIGN KEY` | Assistant message being rated. |
| `userId` | `String` | `NOT NULL, FOREIGN KEY` | User who submitted the rating. |
| `rating` | `FeedbackRating` | `NOT NULL` | Positive or negative rating. |
| `comment` | `String?` | `NULLABLE` | Optional feedback comment. |
| `createdAt` | `DateTime` | `NOT NULL, DEFAULT NOW()` | Feedback creation timestamp. |

#### 4.8.1 Keys

- Primary key: `id`.
- Foreign keys:
  - `messageId` references `Message.id`.
  - `userId` references `User.id`.
- Unique constraints: Composite unique constraint on `messageId` and `userId`.

#### 4.8.2 Indexes

| Index | Columns | Purpose |
| --- | --- | --- |
| `MessageFeedback_userId_idx` | `userId` | Retrieve feedback submitted by a user. |
| `MessageFeedback_messageId_userId_key` | `messageId`, `userId` | Prevent duplicate ratings by the same user for the same response. |

The application validates that feedback targets an assistant message and that the user owns the conversation containing that message.

### 4.9 Entity: `AssistantConfig`

Stores the configuration of the gastronomic assistant, including its identity and system prompt.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `String` | `PRIMARY KEY` | Unique configuration identifier. |
| `name` | `String` | `NOT NULL` | Assistant display name. |
| `description` | `String` | `NOT NULL` | Description of the assistant's purpose and specialization. |
| `systemPrompt` | `Text` | `NOT NULL` | Instructions defining the assistant's behavior and gastronomic expertise. |
| `isActive` | `Boolean` | `NOT NULL, DEFAULT TRUE` | Indicates whether the configuration is active. |
| `updatedAt` | `DateTime` | `NOT NULL, AUTO-UPDATED` | Last configuration update timestamp. |

#### 4.9.1 Keys

- Primary key: `id`.
- Foreign keys: None.
- Unique constraints: None.

#### 4.9.2 Indexes

| Index | Columns | Purpose |
| --- | --- | --- |
| `AssistantConfig_isActive_idx` | `isActive` | Retrieve active assistant configurations. |

The administrator manages the assistant's identity, specialization, and behavior through this entity rather than relying exclusively on a system prompt hardcoded in the application.

The application is responsible for ensuring that the configuration selected for new conversations is active. Configuration changes must not expose system prompts or administrative operations to ordinary users.

### 4.10 Enums

The following enums define the supported roles, message types, message states, feedback values, and AI providers.

| Enum | Values | Purpose |
| --- | --- | --- |
| `Role` | `ADMIN`, `USER` | Application authorization roles. |
| `MessageRole` | `USER`, `ASSISTANT`, `SYSTEM` | Identifies the origin of a message. |
| `MessageStatus` | `PENDING`, `COMPLETED`, `FAILED` | Represents message processing status. |
| `FeedbackRating` | `POSITIVE`, `NEGATIVE` | Represents the user's evaluation of an assistant response. |
| `AIProvider` | `OPENROUTER`, `GROQ` | Identifies the AI provider used for a response. |

## 5. Entity Relationships

### 5.1 Relationship Summary

| Entity A | Cardinality | Entity B | Implementation |
| --- | --- | --- | --- |
| `User` | `1 : many` | `Account` | `Account.userId` |
| `User` | `1 : many` | `Session` | `Session.userId` |
| `User` | `1 : many` | `Conversation` | `Conversation.userId` |
| `User` | `1 : many` | `Message` | `Message.senderId` |
| `User` | `1 : many` | `MessageFeedback` | `MessageFeedback.userId` |
| `Conversation` | `1 : many` | `Message` | `Message.conversationId` |
| `Message` | `1 : many` | `MessageRevision` | `MessageRevision.messageId` |
| `Message` | `1 : many` | `MessageFeedback` | `MessageFeedback.messageId` |
| `AssistantConfig` | `1 : many` | `Conversation` | `Conversation.assistantConfigId` |

`VerificationToken` is independent of the `User` relation in the standard Auth.js Prisma Adapter model. Its identifier and token fields identify the verification request.

### 5.2 Relationship Details

#### 5.2.1 `User → Account`

**Cardinality:** `1 : many`

**Meaning:** A user can have one or more authentication accounts linked to their application identity.

**Implementation:** `Account.userId` references `User.id`. The provider and provider account identifier form a composite unique constraint.

**Deletion behavior:** `CASCADE`. Deleting a user removes their linked authentication accounts.

#### 5.2.2 `User → Session`

**Cardinality:** `1 : many`

**Meaning:** A user can have multiple active or historical authentication sessions.

**Implementation:** `Session.userId` references `User.id`.

**Deletion behavior:** `CASCADE`. Deleting a user removes their sessions.

#### 5.2.3 `User → Conversation`

**Cardinality:** `1 : many`

**Meaning:** A user can create and manage multiple conversations.

**Implementation:** `Conversation.userId` references `User.id`.

**Deletion behavior:** `CASCADE`. Deleting a user removes their conversations and, through the conversation relationship, their messages and related records.

#### 5.2.4 `User → Message`

**Cardinality:** `1 : many`

**Meaning:** A user can be associated with multiple messages as their sender.

**Implementation:** `Message.senderId` references `User.id` and is nullable because assistant and system messages do not necessarily have a user sender.

**Deletion behavior:** `SET NULL` for this sender reference. Conversation ownership and deletion are handled through `Conversation.userId`.

#### 5.2.5 `User → MessageFeedback`

**Cardinality:** `1 : many`

**Meaning:** A user can submit feedback for multiple assistant responses.

**Implementation:** `MessageFeedback.userId` references `User.id`.

**Deletion behavior:** `CASCADE`. Feedback authored by a deleted user is removed.

#### 5.2.6 `Conversation → Message`

**Cardinality:** `1 : many`

**Meaning:** A conversation contains multiple messages from the user and the assistant.

**Implementation:** `Message.conversationId` references `Conversation.id`.

**Deletion behavior:** `CASCADE`. Deleting a conversation removes its messages.

#### 5.2.7 `Message → MessageRevision`

**Cardinality:** `1 : many`

**Meaning:** A message can have multiple previous versions when it is edited more than once.

**Implementation:** `MessageRevision.messageId` references `Message.id`.

**Deletion behavior:** `CASCADE`. Deleting a message removes its revision history.

#### 5.2.8 `Message → MessageFeedback`

**Cardinality:** `1 : many`

**Meaning:** A message can have feedback records from users, subject to the unique constraint that prevents the same user from rating the same message more than once.

**Implementation:** `MessageFeedback.messageId` references `Message.id`.

**Deletion behavior:** `CASCADE`. Deleting a message removes its feedback.

#### 5.2.9 `AssistantConfig → Conversation`

**Cardinality:** `1 : many`

**Meaning:** An assistant configuration can be associated with multiple conversations. A conversation may also have no explicitly associated configuration.

**Implementation:** `Conversation.assistantConfigId` references `AssistantConfig.id` and is nullable.

**Deletion behavior:** `SET NULL`. Deleting a configuration does not delete the conversation history.

## 6. Referential Integrity

The database enforces primary keys, foreign keys, unique constraints, and non-null requirements. The application enforces business rules that depend on the content or ownership of related records.

- Every conversation must reference an existing user.
- Every message must reference an existing conversation.
- Every message revision must reference an existing message.
- Every feedback record must reference an existing user and message.
- Every authentication account and session must reference an existing user.
- A conversation can reference an assistant configuration only if that configuration exists.
- A message's sender reference may be null.
- A conversation's assistant configuration reference may be null.
- A verification token is managed independently according to Auth.js conventions.

### 6.1 Deletion Rules

| Entity | Delete Behavior | Reason |
| --- | --- | --- |
| `User` | `CASCADE` to accounts, sessions, conversations, and feedback | Remove data owned by the deleted account. |
| `Account` | `CASCADE` with user | Authentication account must not outlive its owner. |
| `Session` | `CASCADE` with user | Sessions must not outlive their owner. |
| `Conversation` | `CASCADE` to messages | Messages belong to the conversation. |
| `Message` | `CASCADE` to revisions and feedback | Revisions and ratings depend on the message. |
| `MessageRevision` | `CASCADE` with message | Revision history has no independent meaning. |
| `MessageFeedback` | `CASCADE` with user or message | Feedback depends on both records. |
| `AssistantConfig` | `SET NULL` on associated conversations | Preserve conversation history if a configuration is removed. |
| `VerificationToken` | Explicit expiration and consumption handling | Tokens are managed by Auth.js and have no user foreign key. |

### 6.2 Update Rules

- Primary keys are immutable after record creation.
- Foreign keys are changed only through application operations that preserve relationship validity.
- `createdAt` records the original creation time and is not modified during ordinary updates.
- `updatedAt` is automatically refreshed when its record changes.
- `Conversation.updatedAt` is also refreshed when a message is added or edited.
- Editing a message updates `Message.content` and `Message.editedAt`, while preserving the previous content in `MessageRevision`.
- Changing an assistant configuration does not rewrite historical messages.

## 7. Validation and Constraints

| Rule | Enforcement Layer | Reason |
| --- | --- | --- |
| User email must be unique. | Database | Prevent duplicate user identities. |
| User email must have a valid format. | Application | Validate input before persistence. |
| User role must be `ADMIN` or `USER`. | Database and application | Restrict authorization values. |
| Authentication provider account must be unique per provider. | Database | Prevent duplicate provider associations. |
| Session token must be unique. | Database | Identify sessions unambiguously. |
| Verification token must be unique per identifier. | Database | Prevent duplicate verification records. |
| Conversation must belong to an existing user. | Database | Preserve ownership references. |
| User may only access their own conversations. | Application | Enforce authorization boundaries. |
| Message role must be a valid `MessageRole`. | Database and application | Restrict message origin values. |
| Message status must be a valid `MessageStatus`. | Database and application | Restrict processing states. |
| A revision must reference an existing message. | Database | Preserve revision ownership. |
| Only user messages can be edited. | Application | Enforce message behavior rules. |
| Feedback must target an assistant message. | Application | Restrict ratings to assistant responses. |
| A user can rate a message only once. | Database and application | Enforce the composite unique constraint and provide clear validation. |
| Feedback author must own the conversation containing the rated message. | Application | Prevent cross-user feedback. |
| Only administrators can manage assistant configuration. | Application | Protect administrative operations. |
| Active configuration selection must use an active record. | Application | Prevent inactive configurations from being assigned to new conversations. |
| Message content must not be empty. | Application | Reject invalid message submissions. |

## 8. Query and Index Strategy

| Access Pattern | Query | Required Index | Reason |
| --- | --- | --- | --- |
| Find a user by email | `User.email = email` | `User_email_key` | Authentication and account lookup. |
| Retrieve accounts for a user | `Account.userId = userId` | `Account_userId_idx` | Authentication account lookup. |
| Retrieve sessions for a user | `Session.userId = userId` | `Session_userId_idx` | Session management. |
| List a user's conversations | `Conversation.userId = userId ORDER BY updatedAt DESC` | `Conversation_userId_updatedAt_idx` | Efficient conversation history retrieval. |
| Retrieve messages in a conversation | `Message.conversationId = conversationId ORDER BY createdAt ASC` | `Message_conversationId_createdAt_idx` | Chronological conversation rendering. |
| Retrieve messages by sender | `Message.senderId = userId` | `Message_senderId_idx` | Sender-related queries. |
| Retrieve revisions for a message | `MessageRevision.messageId = messageId ORDER BY createdAt ASC` | `MessageRevision_messageId_createdAt_idx` | Display message edit history. |
| Retrieve feedback by user | `MessageFeedback.userId = userId` | `MessageFeedback_userId_idx` | User feedback queries. |
| Prevent duplicate feedback | `MessageFeedback(messageId, userId)` | `MessageFeedback_messageId_userId_key` | Enforce one rating per user and response. |
| Retrieve conversations by assistant configuration | `Conversation.assistantConfigId = configId` | `Conversation_assistantConfigId_idx` | Configuration-related queries. |
| Retrieve active assistant configurations | `AssistantConfig.isActive = true` | `AssistantConfig_isActive_idx` | Active configuration selection. |

Indexes are created only for defined access patterns and integrity requirements. Additional indexes require a demonstrated query need.

## 9. Transactions

### 9.1 Transaction Boundaries

The following operations require transactional handling when they involve multiple database mutations:

- **Editing a message:** Create a `MessageRevision` with the previous content and update `Message.content`, `Message.editedAt`, and `Message.updatedAt` atomically.
- **Deleting a conversation:** Delete the conversation and its dependent records through the configured cascade behavior.
- **Deleting a user:** Remove the user's dependent authentication and application records according to the deletion rules.
- **Creating a message exchange:** Persist the user's message and the pending assistant message consistently when both records are created as part of the same operation.
- **Submitting feedback:** Create the feedback record while enforcing the unique `(messageId, userId)` constraint.
- **Changing assistant configuration:** Persist configuration changes as a single consistent operation.

AI provider requests are external operations and must not run inside a database transaction. The application persists the relevant pending state, performs the provider request, and then updates the assistant message to its resulting state.

### 9.2 Concurrency

Prisma transactions are used for operations that require atomic database changes.

The database unique constraints are the final protection against concurrent duplicate account associations and feedback submissions. The application must handle constraint violations and return an appropriate response.

Message generation uses `MessageStatus` to distinguish pending, completed, and failed operations. Retrying a failed generation must not create unintended duplicate messages or overwrite unrelated conversation content.

Concurrent edits to the same message must be handled so that an edit does not silently discard a newer version. The service layer is responsible for validating the current message state before applying the edit.

## 10. Implementation

### 10.1 Technology Mapping

| Concept | Implementation |
| --- | --- |
| Entity | Prisma model mapped to a PostgreSQL table. |
| DAO/Repository | Server-side repository using Prisma Client. |
| Migration | Prisma Migrate. |
| Validation | Zod schemas at the application boundary, complemented by database constraints. |
| Relationships | Prisma relations and PostgreSQL foreign keys. |
| Transactions | Prisma `$transaction`. |
| Database client | Shared server-side Prisma Client instance. |

### 10.2 Project Structure

```text
CodeChef-AI-Chat/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── src/
    └── server/
        ├── database/
        │   └── prisma.ts
        └── repositories/
            ├── user.repository.ts
            ├── conversation.repository.ts
            ├── message.repository.ts
            ├── message-revision.repository.ts
            ├── message-feedback.repository.ts
            └── assistant-config.repository.ts
```

Authentication persistence is handled through the Auth.js Prisma Adapter and the corresponding Prisma models. Repository files represent application data access boundaries; they do not replace the Prisma schema or migration history.

## 11. Migration Strategy

### 11.1 Current Version

`1.0.0`

### 11.2 Migration Rules

- All structural database changes must be represented by Prisma migrations.
- Migrations must be committed to version control alongside the corresponding Prisma schema changes.
- Development and deployment environments must apply migrations in a controlled and repeatable manner.
- Existing data must be preserved when a migration changes a column or relationship, unless an explicit data-removal decision has been made.
- Destructive migrations require an explicit review of their effect on user accounts, conversations, messages, revisions, and feedback.
- Prisma schema changes must remain consistent with the application repositories and validation rules.
- Production migrations must not rely on manually modifying the database outside the migration history.

### 11.3 Migration History

| Version | Change | Migration | Rollback |
| --- | --- | --- | --- |
| `Initial → 1.0.0` | Initial relational model for authentication, conversations, messages, revisions, feedback, and assistant configuration. | Initial Prisma migration generated from `schema.prisma`. | Restore from a database backup or apply a reviewed corrective migration. |

## 12. Security and Privacy

The database contains user identity information, authentication data, conversation content, message revisions, feedback, and administrative assistant configuration.

The following requirements apply:

- Database credentials and connection strings must remain in server-side environment variables.
- Passwords must never be stored in plaintext. `passwordHash` stores only a secure password hash when credentials-based authentication is enabled.
- Authentication tokens and provider credentials must be treated as sensitive data.
- Access to conversations and messages must be authorized using the authenticated user identity and conversation ownership.
- A user must not be able to retrieve, modify, delete, or rate another user's conversations or messages.
- Administrative operations involving users and assistant configuration must require the `ADMIN` role.
- The system prompt must not be exposed through ordinary user-facing endpoints.
- Database access must occur through server-side application code, not directly from browser components.
- User-provided message content and feedback must be validated before persistence.
- Database backups and connection security must follow the protections provided by the hosting environment.
- Account deletion must apply the defined cascade rules to dependent data.
- Retention and deletion operations must be consistent with the application's privacy policy.

## 13. Database Testing

Database tests must cover:

- Schema validation.
- Migration tests.
- Constraint tests.
- Repository/DAO tests.
- Transaction tests.
- Tests for important queries.

## 14. Consistency Requirements

The database model must align with `REQUIREMENTS.md`, and its persistence boundaries must align with `ARCHITECTURE.md` and `PLAN.md`. Security constraints must be represented in the model and persistence rules. Relationships must have explicit cardinality, indexes must have documented access patterns, and schema changes must be documented through migrations.

## 15. Related Documentation

- [ARCHITECTURE](ARCHITECTURE.md)
- [PLAN](PLAN.md)
- [SECURITY](SECURITY.md)

## 16. Change Log

| Version | Date | Change | Reason |
| --- | --- | --- | --- |
| `1.0.0` | `2026-11-06` | Initial database specification for the application. | Establish the normalized PostgreSQL model and persistence rules for Dolce Vita. |

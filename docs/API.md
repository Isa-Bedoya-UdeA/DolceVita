# API Documentation

## 1. Purpose

This document defines the authoritative HTTP API contract for **CodeChef-AI-Chat**, the repository containing **Dolce Vita**, a web application with **George**, a gastronomic expert assistant.

It specifies the API architecture, endpoints, request and response conventions, authentication and authorization requirements, validation rules, error handling, and external service integrations.

All API implementations, client integrations, and contract tests must conform to this specification.

## 2. API Overview

| Property | Value |
| --- | --- |
| API Name | Dolce Vita HTTP API |
| Protocol | HTTP/1.1 over TCP; HTTPS in deployed environments |
| Data Format | JSON (`application/json`) |
| Consumers | Dolce Vita web client |
| Backend | Next.js App Router Route Handlers, TypeScript |
| Architecture | REST-oriented API within a modular layered monolith |
| Versioning | Unversioned application API |
| Current Version | Initial contract, 1.0.0 |
| Default Port | 3000 |

The API is an application interface consumed by the Dolce Vita frontend. It is not designed as a public third-party developer API.

## 3. Architecture and Boundaries

### Architecture Overview

The API is part of the Next.js application and follows the modular layered architecture defined in `ARCHITECTURE.md`.

```text
Dolce Vita Web Client
        │
        ▼
Next.js Route Handlers
        │
        ▼
Authentication / Authorization
        │
        ▼
Controllers
        │
        ▼
Application Services
        │
        ├── Conversation Services
        ├── Message Services
        ├── User Administration
        ├── Assistant Configuration
        └── AI Provider Integration
        │
        ▼
Repositories
        │
        ▼
Prisma ORM
        │
        ▼
Supabase PostgreSQL

AI Provider Integration
        │
        ├── OpenRouter (Primary)
        └── Groq (Fallback)
```

### Responsibilities

- Expose the HTTP operations required by the Dolce Vita frontend.
- Authenticate users and enforce role-based access and resource ownership.
- Validate incoming parameters and request bodies.
- Coordinate application services for conversations, messages, users, and assistant configuration.
- Persist application data through repositories and Prisma.
- Communicate with the configured AI providers from the server.
- Normalize application and provider errors into the documented API error format.
- Return only the data authorized for the requesting user.

The frontend is responsible for presenting the interface and managing transient interaction state. It must not access the database or AI provider credentials directly.

### Boundaries

- The API must respect the architecture defined in `ARCHITECTURE.md`.
- Route Handlers are HTTP entry points, not locations for business logic.
- Business rules must remain in the application or service layer.
- Database access must be performed through repositories and Prisma.
- Provider-specific request and response formats must remain isolated within the AI integration layer.
- Authentication and authorization must be enforced on the server.
- No separate Express or NestJS backend is part of the application architecture.
- No integrations outside the approved product scope may be introduced through the API.

## 4. Environments and Base URLs

| Environment | Base URL | Notes |
| --- | --- | --- |
| Local Development | `http://localhost:3000/api` | Next.js development server |
| Local Network | `http://<HOST_LAN_IP>:3000/api` | Optional access from devices on the same network |
| Staging | Not Applicable | No separate staging URL is defined in the project configuration |
| Production | Not specified | The production deployment uses Vercel; its public URL is environment-specific |

### Base Path

```text
/api
```

### Environment Rules

- Environment-specific URLs and credentials must be configured outside application source code.
- Production URLs must not be hardcoded into application logic.
- HTTPS must be used for deployed environments.
- Local development may use HTTP.
- The frontend and API operate within the same Next.js application and normally share the same origin.

## 5. Authentication

### Authentication Status

**Status:** Required for application resources and protected operations.

Public access is limited to authentication-related operations provided by Auth.js. Conversation, message, and administrative endpoints require an authenticated session.

### Authentication Scheme

Dolce Vita uses **Auth.js with the Prisma Adapter** and credentials-based authentication.

Authentication is session-based. The browser uses the session cookie managed by Auth.js; application endpoints do not require clients to construct a Bearer token.

```http
Cookie: <AUTH_SESSION_COOKIE>
```

The exact cookie name and attributes are managed by Auth.js and depend on the environment.

### Token and Session Validation

| Property | Value |
| --- | --- |
| Validation Location | Server-side authentication and authorization checks |
| Authentication Authority | Auth.js |
| User Identifier | Authenticated user's application ID |
| Session Expiration | Managed by Auth.js session configuration |
| Invalid or Missing Session | `401 Unauthorized` |

### Authentication Rules

- Protected endpoints must reject requests without a valid authenticated session.
- Passwords must be hashed with `bcryptjs`; plaintext passwords must never be stored.
- Session validation must occur on the server.
- Client-side redirects or interface restrictions do not replace server-side authentication checks.
- Authentication cookies and credentials must never be exposed in API responses or logs.
- Auth.js owns its authentication routes under `/api/auth/*`; its internal protocol is not redefined by this document.
- Development-only authentication behavior must not bypass production authentication.

## 6. Authorization

### Authorization Status

**Status:** Required.

### Authorization Model

Dolce Vita uses Role-Based Access Control (RBAC), combined with resource ownership checks.

| Role / Permission | Allowed Operations | Restrictions |
| --- | --- | --- |
| `USER` | Manage personal conversations and messages; submit message feedback | May only access and modify resources they own |
| `ADMIN` | Administrative user management, role management, assistant configuration, and application statistics | Administrative operations must be explicitly authorized; access to another user's private conversations is not implied |

### Authorization Rules

- Every authenticated user may access only their own conversations and messages.
- Conversation ownership must be verified before reading, modifying, or deleting a conversation.
- Message operations must verify that the message belongs to a conversation owned by the authenticated user.
- Only `ADMIN` users may access administrative endpoints.
- Role changes must be restricted to authorized administrators.
- Authorization must be enforced in server-side application logic.
- An authenticated user without the required permission receives `403 Forbidden`.
- A resource that does not exist or is not accessible to the requesting user must not expose another user's data.

## 7. API Conventions

### Methods and Operations

| Method | Purpose | Supported |
| --- | --- | --- |
| `GET` | Retrieve resources | Yes |
| `POST` | Create resources or execute operations | Yes |
| `PUT` | Replace resources | No |
| `PATCH` | Partially update resources | Yes |
| `DELETE` | Delete resources | Yes |

### Naming Conventions

- **URL Paths:** Lowercase, plural resource names where applicable.
- **Query Parameters:** `camelCase`.
- **Path Parameters:** `camelCase`, enclosed in square brackets in Next.js route definitions.
- **JSON Properties:** `camelCase`.
- **Error Codes:** `SCREAMING_SNAKE_CASE`.
- **Endpoint Identifiers:** Sequential identifiers such as `API-001`.
- **Resource Identifiers:** Opaque string identifiers generated and managed by the application.

### Headers

#### Request Headers

| Header | Required | Value | Description |
| --- | --- | --- | --- |
| `Accept` | Yes | `application/json` | Preferred response format |
| `Content-Type` | When a JSON body is sent | `application/json` | Request body format |
| `Cookie` | For protected endpoints | Auth.js session cookie | Authentication session |
| `Origin` | Browser-dependent | Application origin | Evaluated by the application's same-origin and security policies |

The API does not use a client-supplied `Authorization: Bearer` header for normal browser authentication.

#### Response Headers

| Header | Value | Description |
| --- | --- | --- |
| `Content-Type` | `application/json; charset=utf-8` | JSON response format |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |

Responses do not require a wildcard CORS policy. The application uses same-origin communication for its web client.

### Data Formats

- **Payload Encoding:** UTF-8 encoded JSON.
- **Dates and Timestamps:** ISO 8601 date-time strings in UTC.
- **Identifiers:** Opaque strings; clients must not assume a specific database identifier format.
- **Empty Collections:** Represented as empty arrays (`[]`).
- **Nullable Fields:** Explicitly represented as `null` when the response schema defines a nullable field. Optional fields may be omitted only when documented.
- **Numeric Precision:** JSON numbers are used for numeric configuration values and statistics. Identifiers must not be represented as numbers.
- **Text Content:** User messages and assistant responses are represented as strings. Assistant content may contain Markdown.

### HTTP Status Codes

| Code | Meaning | Usage |
| ---: | --- | --- |
| 200 | OK | Successful retrieval or operation |
| 201 | Created | Resource successfully created |
| 204 | No Content | Successful deletion without a response body |
| 400 | Bad Request | Malformed request or validation failure |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated user lacks permission |
| 404 | Not Found | Requested resource does not exist or is not accessible |
| 405 | Method Not Allowed | HTTP method is not supported |
| 409 | Conflict | Operation conflicts with the current resource state |
| 500 | Internal Server Error | Unexpected application failure |
| 502 | Bad Gateway | Invalid or unusable upstream provider response |
| 503 | Service Unavailable | Required service or provider is unavailable |
| 504 | Gateway Timeout | Upstream provider request timed out |

The API does not define a separate asynchronous processing contract. AI-assisted message requests are handled as application operations and return their result in the HTTP response.

## 8. Endpoints and Operations

All endpoint paths below are relative to the `/api` base path. Protected endpoints require an authenticated session unless explicitly stated otherwise.

### 8.1 API-001 — Authentication

| Property | Value |
| --- | --- |
| Method / Operation | Auth.js-managed authentication operations |
| Path | `/api/auth/*` |
| Purpose | Register, authenticate, maintain, and terminate user sessions through the configured Auth.js integration |
| Authentication | Depends on the operation |
| Authorization | Managed by Auth.js and application authentication rules |
| Idempotency | Depends on the specific Auth.js operation |

#### 8.1.1 Parameters and Request

Auth.js owns the request formats and route behavior under `/api/auth/*`. These internal endpoints are not custom application endpoints and must follow the Auth.js credentials provider and session contract.

The application uses credentials-based authentication. It does not define social login or external identity-provider flows in this API contract.

#### 8.1.2 Success and Error Responses

Responses follow the Auth.js protocol for the corresponding operation. Application-specific errors outside that protocol use the standardized error behavior described in Section 11.

#### 8.1.3 Side Effects

- Creates, validates, or terminates authentication sessions.
- Creates user records through the registration flow and Prisma Adapter where applicable.
- Stores password hashes rather than plaintext passwords.

#### 8.1.4 Related Requirements

- Authentication and account access requirements.
- Security and session-management requirements.

---

### 8.2 API-002 — List Conversations

| Property | Value |
| --- | --- |
| Method / Operation | `GET` |
| Path | `/api/conversations` |
| Purpose | Retrieve the authenticated user's conversations |
| Authentication | Required |
| Authorization | Conversation ownership |
| Idempotency | Idempotent |

#### 8.2.1 Parameters

None.

#### 8.2.2 Request Headers

```http
Accept: application/json
Cookie: <AUTH_SESSION_COOKIE>
```

#### 8.2.3 Request

```http
GET /api/conversations
Accept: application/json
```

Request Body: None.

#### 8.2.4 Validation

- A valid authenticated session is required.
- Only conversations belonging to the authenticated user may be returned.
- No request body is accepted.

#### 8.2.5 Success Response

**Status: `200 OK`**

```json
{
  "data": [
    {
      "id": "conversation-id",
      "title": "Italian pasta recipes",
      "createdAt": "2026-11-06T10:00:00.000Z",
      "updatedAt": "2026-11-06T10:15:00.000Z"
    }
  ]
}
```

Conversations are ordered by most recently updated first. An account with no conversations receives an empty `data` array.

#### 8.2.6 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 401 | `UNAUTHORIZED` | No valid session |
| 500 | `INTERNAL_SERVER_ERROR` | Conversation retrieval failed |

#### 8.2.7 Side Effects

None.

#### 8.2.8 Idempotency

Repeated requests do not modify application data.

#### 8.2.9 Related Requirements

- Conversation history and ownership.
- User authentication and authorization.

---

### 8.3 API-003 — Create Conversation

| Property | Value |
| --- | --- |
| Method / Operation | `POST` |
| Path | `/api/conversations` |
| Purpose | Create a conversation for the authenticated user |
| Authentication | Required |
| Authorization | Authenticated user |
| Idempotency | Non-idempotent |

#### 8.3.1 Parameters

None.

#### 8.3.2 Request

```http
POST /api/conversations
Accept: application/json
Content-Type: application/json
```

Request Body:

```json
{}
```

#### 8.3.3 Fields

No request fields are required. The conversation is associated with the authenticated user.

#### 8.3.4 Validation

- A valid authenticated session is required.
- The conversation owner is determined server-side.
- The client must not provide or override the owner identifier.

#### 8.3.5 Success Response

**Status: `201 Created`**

```json
{
  "data": {
    "id": "conversation-id",
    "title": "New conversation",
    "createdAt": "2026-11-06T10:00:00.000Z",
    "updatedAt": "2026-11-06T10:00:00.000Z"
  }
}
```

#### 8.3.6 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 401 | `UNAUTHORIZED` | No valid session |
| 500 | `INTERNAL_SERVER_ERROR` | Conversation creation failed |

#### 8.3.7 Side Effects

Creates a conversation associated with the authenticated user.

#### 8.3.8 Idempotency

Repeated requests create separate conversations. The operation does not use an idempotency key.

#### 8.3.9 Related Requirements

- Conversation creation and history.
- User authentication and authorization.

---

### 8.4 API-004 — Retrieve Conversation

| Property | Value |
| --- | --- |
| Method / Operation | `GET` |
| Path | `/api/conversations/[conversationId]` |
| Purpose | Retrieve a conversation owned by the authenticated user |
| Authentication | Required |
| Authorization | Conversation ownership |
| Idempotency | Idempotent |

#### 8.4.1 Parameters

| Name | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `conversationId` | Path | `string` | Yes | Conversation identifier |

#### 8.4.2 Request

```http
GET /api/conversations/conversation-id
Accept: application/json
```

Request Body: None.

#### 8.4.3 Validation

- `conversationId` must identify an existing conversation.
- The conversation must belong to the authenticated user.

#### 8.4.4 Success Response

**Status: `200 OK`**

```json
{
  "data": {
    "id": "conversation-id",
    "title": "Italian pasta recipes",
    "createdAt": "2026-11-06T10:00:00.000Z",
    "updatedAt": "2026-11-06T10:15:00.000Z"
  }
}
```

#### 8.4.5 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 401 | `UNAUTHORIZED` | No valid session |
| 404 | `NOT_FOUND` | Conversation does not exist or is not accessible |
| 500 | `INTERNAL_SERVER_ERROR` | Retrieval failed |

#### 8.4.6 Side Effects

None.

#### 8.4.7 Idempotency

Repeated requests do not modify application data.

#### 8.4.8 Related Requirements

- Conversation history and ownership.

---

### 8.5 API-005 — Rename Conversation

| Property | Value |
| --- | --- |
| Method / Operation | `PATCH` |
| Path | `/api/conversations/[conversationId]` |
| Purpose | Update the title of a conversation |
| Authentication | Required |
| Authorization | Conversation ownership |
| Idempotency | Idempotent when the same title is submitted |

#### 8.5.1 Parameters

| Name | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `conversationId` | Path | `string` | Yes | Conversation identifier |

#### 8.5.2 Request

```http
PATCH /api/conversations/conversation-id
Accept: application/json
Content-Type: application/json
```

Request Body:

```json
{
  "title": "Italian pasta recipes"
}
```

#### 8.5.3 Fields

| Field | Type | Required | Constraints | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | Yes | Must contain non-whitespace text | New conversation title |

#### 8.5.4 Validation

- The conversation must belong to the authenticated user.
- `title` must be a non-empty string after trimming whitespace.
- The owner identifier cannot be changed through this operation.
- Unsupported fields must be rejected.

#### 8.5.5 Success Response

**Status: `200 OK`**

```json
{
  "data": {
    "id": "conversation-id",
    "title": "Italian pasta recipes",
    "updatedAt": "2026-11-06T10:20:00.000Z"
  }
}
```

#### 8.5.6 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 400 | `VALIDATION_ERROR` | Invalid title |
| 401 | `UNAUTHORIZED` | No valid session |
| 404 | `NOT_FOUND` | Conversation does not exist or is not accessible |
| 500 | `INTERNAL_SERVER_ERROR` | Update failed |

#### 8.5.7 Side Effects

Updates the conversation title and its modification timestamp.

#### 8.5.8 Idempotency

Submitting the same title repeatedly leaves the conversation with the same title.

#### 8.5.9 Related Requirements

- Conversation renaming and ownership.

---

### 8.6 API-006 — Delete Conversation

| Property | Value |
| --- | --- |
| Method / Operation | `DELETE` |
| Path | `/api/conversations/[conversationId]` |
| Purpose | Delete a conversation and its associated messages |
| Authentication | Required |
| Authorization | Conversation ownership |
| Idempotency | Idempotent with respect to the final resource state |

#### 8.6.1 Parameters

| Name | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `conversationId` | Path | `string` | Yes | Conversation identifier |

#### 8.6.2 Request

```http
DELETE /api/conversations/conversation-id
Accept: application/json
```

Request Body: None.

#### 8.6.3 Validation

- The conversation must belong to the authenticated user.
- The operation must not delete conversations belonging to other users.

#### 8.6.4 Success Response

**Status: `204 No Content`**

No response body.

#### 8.6.5 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 401 | `UNAUTHORIZED` | No valid session |
| 404 | `NOT_FOUND` | Conversation does not exist or is not accessible |
| 500 | `INTERNAL_SERVER_ERROR` | Deletion failed |

#### 8.6.6 Side Effects

Deletes the conversation and its associated messages according to the database relationship and deletion rules.

#### 8.6.7 Idempotency

The final state is that the conversation is absent. A subsequent request for the deleted resource returns `404 NOT_FOUND`.

#### 8.6.8 Related Requirements

- Conversation deletion and ownership.
- Data integrity.

---

### 8.7 API-007 — Retrieve Conversation Messages

| Property | Value |
| --- | --- |
| Method / Operation | `GET` |
| Path | `/api/conversations/[conversationId]/messages` |
| Purpose | Retrieve the messages belonging to a conversation |
| Authentication | Required |
| Authorization | Conversation ownership |
| Idempotency | Idempotent |

#### 8.7.1 Parameters

| Name | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `conversationId` | Path | `string` | Yes | Conversation identifier |

#### 8.7.2 Request

```http
GET /api/conversations/conversation-id/messages
Accept: application/json
```

Request Body: None.

#### 8.7.3 Validation

- The conversation must exist and belong to the authenticated user.
- Messages must be restricted to the requested conversation.

#### 8.7.4 Success Response

**Status: `200 OK`**

```json
{
  "data": [
    {
      "id": "message-id-1",
      "conversationId": "conversation-id",
      "role": "user",
      "content": "How do I prepare fresh pasta?",
      "createdAt": "2026-11-06T10:01:00.000Z"
    },
    {
      "id": "message-id-2",
      "conversationId": "conversation-id",
      "role": "assistant",
      "content": "Fresh pasta begins with a suitable flour and egg ratio...",
      "createdAt": "2026-11-06T10:01:05.000Z"
    }
  ]
}
```

Messages are returned in chronological order. An empty conversation returns an empty array.

#### 8.7.5 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 401 | `UNAUTHORIZED` | No valid session |
| 404 | `NOT_FOUND` | Conversation does not exist or is not accessible |
| 500 | `INTERNAL_SERVER_ERROR` | Message retrieval failed |

#### 8.7.6 Side Effects

None.

#### 8.7.7 Idempotency

Repeated requests do not modify application data.

#### 8.7.8 Related Requirements

- Message history and conversation ownership.

---

### 8.8 API-008 — Send Message

| Property | Value |
| --- | --- |
| Method / Operation | `POST` |
| Path | `/api/conversations/[conversationId]/messages` |
| Purpose | Submit a user message and obtain a response from George |
| Authentication | Required |
| Authorization | Conversation ownership |
| Idempotency | Non-idempotent |

#### 8.8.1 Parameters

| Name | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `conversationId` | Path | `string` | Yes | Conversation identifier |

#### 8.8.2 Request

```http
POST /api/conversations/conversation-id/messages
Accept: application/json
Content-Type: application/json
```

Request Body:

```json
{
  "content": "How do I prepare fresh pasta?"
}
```

#### 8.8.3 Fields

| Field | Type | Required | Constraints | Description |
| --- | --- | --- | --- | --- |
| `content` | `string` | Yes | Must contain non-whitespace text | User message content |

#### 8.8.4 Validation

- The user must be authenticated.
- The conversation must belong to the authenticated user.
- `content` must be a non-empty string after trimming whitespace.
- The request must not specify a role, owner, or provider-controlled field.
- The application validates the request before invoking an AI provider.

#### 8.8.5 Success Response

**Status: `200 OK`**

```json
{
  "data": {
    "userMessage": {
      "id": "user-message-id",
      "conversationId": "conversation-id",
      "role": "user",
      "content": "How do I prepare fresh pasta?",
      "createdAt": "2026-11-06T10:01:00.000Z"
    },
    "assistantMessage": {
      "id": "assistant-message-id",
      "conversationId": "conversation-id",
      "role": "assistant",
      "content": "Fresh pasta begins with a suitable flour and egg ratio...",
      "createdAt": "2026-11-06T10:01:05.000Z"
    }
  }
}
```

The assistant response is stored as a message and returned as Markdown content for rendering by the client.

#### 8.8.6 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 400 | `VALIDATION_ERROR` | Message content is invalid |
| 401 | `UNAUTHORIZED` | No valid session |
| 404 | `NOT_FOUND` | Conversation does not exist or is not accessible |
| 502 | `AI_PROVIDER_ERROR` | Provider returned an unusable response |
| 503 | `AI_SERVICE_UNAVAILABLE` | Both configured providers are unavailable |
| 504 | `AI_PROVIDER_TIMEOUT` | Provider request timed out |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected message-processing failure |

#### 8.8.7 Side Effects

- Stores the user message.
- Sends the conversation context and new message to the AI integration layer.
- Stores the assistant response when generation succeeds.
- Updates the conversation modification timestamp.

If generation fails, the API must return an error rather than a fabricated successful assistant response. The client must retain the submitted user message in its interface when presenting the failure state.

#### 8.8.8 Idempotency

Repeated requests may create additional messages and trigger additional provider calls. No idempotency key is defined for this operation.

#### 8.8.9 Related Requirements

- Message submission and persistence.
- Gastronomic assistant interaction.
- AI provider fallback and error handling.

---

### 8.9 API-009 — Edit User Message and Regenerate Response

| Property | Value |
| --- | --- |
| Method / Operation | `PATCH` |
| Path | `/api/messages/[messageId]` |
| Purpose | Edit a user message and regenerate the assistant response from that point in the conversation |
| Authentication | Required |
| Authorization | Ownership of the associated conversation |
| Idempotency | Non-idempotent because regeneration invokes an AI provider |

#### 8.9.1 Parameters

| Name | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `messageId` | Path | `string` | Yes | User message identifier |

#### 8.9.2 Request

```http
PATCH /api/messages/user-message-id
Accept: application/json
Content-Type: application/json
```

Request Body:

```json
{
  "content": "How do I prepare fresh egg pasta?"
}
```

#### 8.9.3 Fields

| Field | Type | Required | Constraints | Description |
| --- | --- | --- | --- | --- |
| `content` | `string` | Yes | Must contain non-whitespace text | Edited user message content |

#### 8.9.4 Validation

- The message must exist and have the `user` role.
- Its associated conversation must belong to the authenticated user.
- `content` must be a non-empty string after trimming whitespace.
- Assistant messages cannot be edited through this operation.
- The client cannot change the message owner, conversation, or role.

#### 8.9.5 Success Response

**Status: `200 OK`**

```json
{
  "data": {
    "userMessage": {
      "id": "user-message-id",
      "conversationId": "conversation-id",
      "role": "user",
      "content": "How do I prepare fresh egg pasta?",
      "createdAt": "2026-11-06T10:01:00.000Z"
    },
    "assistantMessage": {
      "id": "assistant-message-id",
      "conversationId": "conversation-id",
      "role": "assistant",
      "content": "For fresh egg pasta, combine flour and eggs...",
      "createdAt": "2026-11-06T10:02:00.000Z"
    }
  }
}
```

Messages that depend on the edited turn are invalidated and replaced by the regenerated conversation continuation. The resulting history must not retain obsolete assistant responses as if they were generated from the edited content.

#### 8.9.6 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 400 | `VALIDATION_ERROR` | Invalid content or message type |
| 401 | `UNAUTHORIZED` | No valid session |
| 404 | `NOT_FOUND` | Message does not exist or is not accessible |
| 409 | `CONFLICT` | Message cannot be edited in its current state |
| 502 | `AI_PROVIDER_ERROR` | Provider returned an unusable response |
| 503 | `AI_SERVICE_UNAVAILABLE` | Both configured providers are unavailable |
| 504 | `AI_PROVIDER_TIMEOUT` | Provider request timed out |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected editing or regeneration failure |

#### 8.9.7 Side Effects

- Updates the selected user message.
- Invalidates subsequent conversation messages that depend on the edited turn.
- Invokes the AI integration layer to regenerate the assistant continuation.
- Persists the regenerated assistant response when successful.

#### 8.9.8 Idempotency

The operation is not idempotent because each successful request may produce a different AI response.

#### 8.9.9 Related Requirements

- User message editing.
- Assistant response regeneration.
- Conversation history consistency.

---

### 8.10 API-010 — Retry Assistant Response

| Property | Value |
| --- | --- |
| Method / Operation | `POST` |
| Path | `/api/messages/[messageId]/retry` |
| Purpose | Request a new assistant response for an existing assistant message |
| Authentication | Required |
| Authorization | Ownership of the associated conversation |
| Idempotency | Non-idempotent |

#### 8.10.1 Parameters

| Name | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `messageId` | Path | `string` | Yes | Assistant message identifier |

#### 8.10.2 Request

```http
POST /api/messages/assistant-message-id/retry
Accept: application/json
```

Request Body: None.

#### 8.10.3 Validation

- The message must exist and have the `assistant` role.
- Its associated conversation must belong to the authenticated user.
- The application must identify the relevant preceding conversation context.
- A user message cannot be retried through this endpoint.

#### 8.10.4 Success Response

**Status: `200 OK`**

```json
{
  "data": {
    "assistantMessage": {
      "id": "assistant-message-id",
      "conversationId": "conversation-id",
      "role": "assistant",
      "content": "Here is another way to approach the recipe...",
      "createdAt": "2026-11-06T10:05:00.000Z"
    }
  }
}
```

#### 8.10.5 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 401 | `UNAUTHORIZED` | No valid session |
| 404 | `NOT_FOUND` | Message does not exist or is not accessible |
| 409 | `CONFLICT` | Message cannot be retried in its current state |
| 502 | `AI_PROVIDER_ERROR` | Provider returned an unusable response |
| 503 | `AI_SERVICE_UNAVAILABLE` | Both configured providers are unavailable |
| 504 | `AI_PROVIDER_TIMEOUT` | Provider request timed out |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected retry failure |

#### 8.10.6 Side Effects

Invokes the AI integration layer and persists the resulting assistant response. The previous response must not be represented as the newly generated response.

#### 8.10.7 Idempotency

Repeated requests may generate different responses and trigger additional provider calls.

#### 8.10.8 Related Requirements

- Assistant response retry.
- AI provider integration and error handling.

---

### 8.11 API-011 — Submit Message Feedback

| Property | Value |
| --- | --- |
| Method / Operation | `POST` |
| Path | `/api/messages/[messageId]/feedback` |
| Purpose | Store the authenticated user's positive or negative feedback for an assistant message |
| Authentication | Required |
| Authorization | Ownership of the associated conversation |
| Idempotency | Idempotent for the same feedback value |

#### 8.11.1 Parameters

| Name | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `messageId` | Path | `string` | Yes | Assistant message identifier |

#### 8.11.2 Request

```http
POST /api/messages/assistant-message-id/feedback
Accept: application/json
Content-Type: application/json
```

Request Body:

```json
{
  "rating": "positive"
}
```

#### 8.11.3 Fields

| Field | Type | Required | Constraints | Description |
| --- | --- | --- | --- | --- |
| `rating` | `string` | Yes | `positive` or `negative` | Feedback value |

#### 8.11.4 Validation

- The message must exist and have the `assistant` role.
- Its associated conversation must belong to the authenticated user.
- `rating` must be one of the documented values.
- The request must not assign feedback to another user.

#### 8.11.5 Success Response

**Status: `200 OK`**

```json
{
  "data": {
    "messageId": "assistant-message-id",
    "rating": "positive"
  }
}
```

#### 8.11.6 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 400 | `VALIDATION_ERROR` | Feedback value is invalid |
| 401 | `UNAUTHORIZED` | No valid session |
| 404 | `NOT_FOUND` | Message does not exist or is not accessible |
| 500 | `INTERNAL_SERVER_ERROR` | Feedback could not be stored |

#### 8.11.7 Side Effects

Stores or updates the feedback associated with the assistant message and authenticated user.

#### 8.11.8 Idempotency

Submitting the same feedback value repeatedly preserves the same feedback state. Submitting the opposite value updates the feedback.

#### 8.11.9 Related Requirements

- Message feedback.
- Conversation and message ownership.

---

### 8.12 API-012 — Administrative User Management

| Property | Value |
| --- | --- |
| Method / Operation | `GET` |
| Path | `/api/admin/users` |
| Purpose | Retrieve user records for administrative management |
| Authentication | Required |
| Authorization | `ADMIN` role |
| Idempotency | Idempotent |

#### 8.12.1 Parameters

None.

#### 8.12.2 Request

```http
GET /api/admin/users
Accept: application/json
```

Request Body: None.

#### 8.12.3 Validation

- A valid authenticated session is required.
- The authenticated user must have the `ADMIN` role.

#### 8.12.4 Success Response

**Status: `200 OK`**

```json
{
  "data": [
    {
      "id": "user-id",
      "name": "Example User",
      "email": "user@example.com",
      "role": "USER"
    }
  ]
}
```

Only fields required for administrative user management may be exposed. Password hashes, session tokens, and authentication secrets must never be returned.

#### 8.12.5 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 401 | `UNAUTHORIZED` | No valid session |
| 403 | `FORBIDDEN` | User is not an administrator |
| 500 | `INTERNAL_SERVER_ERROR` | User retrieval failed |

#### 8.12.6 Side Effects

None.

#### 8.12.7 Idempotency

Repeated requests do not modify user records.

#### 8.12.8 Related Requirements

- Administrative user management.
- Role-based authorization.

---

### 8.13 API-013 — Update User Role

| Property | Value |
| --- | --- |
| Method / Operation | `PATCH` |
| Path | `/api/admin/users/[userId]` |
| Purpose | Change a user's application role |
| Authentication | Required |
| Authorization | `ADMIN` role |
| Idempotency | Idempotent when the same role is submitted |

#### 8.13.1 Parameters

| Name | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `userId` | Path | `string` | Yes | User identifier |

#### 8.13.2 Request

```http
PATCH /api/admin/users/user-id
Accept: application/json
Content-Type: application/json
```

Request Body:

```json
{
  "role": "ADMIN"
}
```

#### 8.13.3 Fields

| Field | Type | Required | Constraints | Description |
| --- | --- | --- | --- | --- |
| `role` | `string` | Yes | `ADMIN` or `USER` | New application role |

#### 8.13.4 Validation

- The requester must have the `ADMIN` role.
- `userId` must identify an existing user.
- `role` must be one of the supported application roles.
- Other user properties cannot be modified through this endpoint.

#### 8.13.5 Success Response

**Status: `200 OK`**

```json
{
  "data": {
    "id": "user-id",
    "role": "ADMIN"
  }
}
```

#### 8.13.6 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 400 | `VALIDATION_ERROR` | Invalid role |
| 401 | `UNAUTHORIZED` | No valid session |
| 403 | `FORBIDDEN` | User is not an administrator |
| 404 | `NOT_FOUND` | User does not exist |
| 500 | `INTERNAL_SERVER_ERROR` | Role update failed |

#### 8.13.7 Side Effects

Updates the target user's application role.

#### 8.13.8 Idempotency

Submitting the same role repeatedly preserves the same role value.

#### 8.13.9 Related Requirements

- Administrative user management.
- Role-based authorization.

---

### 8.14 API-014 — Assistant Configuration

| Property | Value |
| --- | --- |
| Method / Operation | `GET`, `PATCH` |
| Path | `/api/admin/assistant` |
| Purpose | Retrieve and update the configuration used by George |
| Authentication | Required |
| Authorization | `ADMIN` role |
| Idempotency | `GET` is idempotent; `PATCH` is idempotent when the same configuration is submitted |

#### 8.14.1 Parameters

None.

#### 8.14.2 Request

`GET` retrieves the current assistant configuration.

```http
GET /api/admin/assistant
Accept: application/json
```

`PATCH` updates the supported configuration fields.

```http
PATCH /api/admin/assistant
Accept: application/json
Content-Type: application/json
```

#### 8.14.3 Request Fields

The configuration is managed by the application. Provider credentials and private secrets are not part of the public configuration contract.

The exact configurable fields are defined by the assistant configuration schema in the application. This endpoint must not expose provider credentials, environment variables, or internal integration secrets.

#### 8.14.4 Validation

- A valid authenticated session is required.
- The requester must have the `ADMIN` role.
- Only fields explicitly supported by the assistant configuration schema may be updated.
- Provider credentials cannot be supplied or retrieved through this endpoint.

#### 8.14.5 Success Response

**Status: `200 OK`**

The response contains the sanitized assistant configuration exposed to administrators.

```json
{
  "data": {
    "name": "George"
  }
}
```

The response must include only configuration fields supported by the application.

#### 8.14.6 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 400 | `VALIDATION_ERROR` | Configuration contains invalid values |
| 401 | `UNAUTHORIZED` | No valid session |
| 403 | `FORBIDDEN` | User is not an administrator |
| 500 | `INTERNAL_SERVER_ERROR` | Configuration operation failed |

#### 8.14.7 Side Effects

A successful `PATCH` persists the supported assistant configuration.

#### 8.14.8 Idempotency

Submitting the same configuration repeatedly preserves the same configuration state.

#### 8.14.9 Related Requirements

- Administrative assistant configuration.
- Security and secret management.

---

### 8.15 API-015 — Administrative Statistics

| Property | Value |
| --- | --- |
| Method / Operation | `GET` |
| Path | `/api/admin/statistics` |
| Purpose | Retrieve application statistics for administrative monitoring |
| Authentication | Required |
| Authorization | `ADMIN` role |
| Idempotency | Idempotent |

#### 8.15.1 Parameters

None.

#### 8.15.2 Request

```http
GET /api/admin/statistics
Accept: application/json
```

Request Body: None.

#### 8.15.3 Validation

- A valid authenticated session is required.
- The requester must have the `ADMIN` role.

#### 8.15.4 Success Response

**Status: `200 OK`**

```json
{
  "data": {
    "users": {},
    "conversations": {},
    "messages": {}
  }
}
```

The statistics response exposes aggregated application information. It must not disclose private message contents, passwords, session information, or provider credentials.

The exact statistical measures are determined by the statistics implemented in the application.

#### 8.15.5 Error Responses

| Status | Error Code | Meaning |
| ---: | --- | --- |
| 401 | `UNAUTHORIZED` | No valid session |
| 403 | `FORBIDDEN` | User is not an administrator |
| 500 | `INTERNAL_SERVER_ERROR` | Statistics retrieval failed |

#### 8.15.6 Side Effects

None.

#### 8.15.7 Idempotency

Repeated requests do not modify application data.

#### 8.15.8 Related Requirements

- Administrative application statistics.
- Role-based authorization.
- Data privacy.

## 9. Data Schemas

The following schemas describe the public data structures used by the application API. They do not expose the complete Prisma database models.

### Schema — Conversation

**Identifier:** `ConversationResponse`

| Field | Type | Required | Nullable | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | Yes | No | Unique conversation identifier |
| `title` | `string` | Yes | No | Conversation title |
| `createdAt` | `string` | Yes | No | Creation timestamp in ISO 8601 UTC format |
| `updatedAt` | `string` | Yes | No | Last modification timestamp in ISO 8601 UTC format |

### Schema — Message

**Identifier:** `MessageResponse`

| Field | Type | Required | Nullable | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | Yes | No | Unique message identifier |
| `conversationId` | `string` | Yes | No | Identifier of the associated conversation |
| `role` | `string` | Yes | No | Message author role: `user` or `assistant` |
| `content` | `string` | Yes | No | Message content; assistant messages may contain Markdown |
| `createdAt` | `string` | Yes | No | Creation timestamp in ISO 8601 UTC format |

### Schema — User Administration

**Identifier:** `AdminUserResponse`

| Field | Type | Required | Nullable | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | Yes | No | User identifier |
| `name` | `string` | No | Yes | User display name, when available |
| `email` | `string` | Yes | No | User email address |
| `role` | `string` | Yes | No | Application role: `ADMIN` or `USER` |

Authentication secrets and password hashes are never part of this schema.

### Schema — Message Feedback

**Identifier:** `MessageFeedback`

| Field | Type | Required | Nullable | Description |
| --- | --- | --- | --- | --- |
| `messageId` | `string` | Yes | No | Assistant message identifier |
| `rating` | `string` | Yes | No | `positive` or `negative` |

### Schema — Standard Response Envelope

Successful custom application endpoints use the following response structure:

```json
{
  "data": {}
}
```

Collection endpoints use an array as the value of `data`.

The API does not define a general `meta` object. Additional metadata is included only when an endpoint explicitly documents it.

### Schema — Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "content",
        "message": "The field must contain non-whitespace text."
      }
    ]
  }
}
```

### Schema Rules

- Field names use `camelCase`.
- Resource identifiers are opaque strings.
- Timestamps use ISO 8601 UTC representation.
- Assistant message content is Markdown text, not trusted HTML.
- User and assistant messages use the documented role values.
- User roles use the documented uppercase values `ADMIN` and `USER`.
- Internal database fields must not be exposed unless required by an approved endpoint.
- Password hashes, session tokens, provider credentials, and private environment configuration must never be returned.
- Nullable and optional fields must follow the endpoint-specific schema.

## 10. Validation

### Request Validation

- **Path Parameters:** Must identify the resource required by the endpoint and must be validated before accessing it.
- **Query Parameters:** No general-purpose query parameter contract is currently defined.
- **Request Bodies:** Must be valid JSON and conform to the endpoint's documented fields.
- **Headers:** JSON requests must use `Content-Type: application/json`; protected requests must carry a valid Auth.js session.
- **Authentication:** Session validity and user identity are checked server-side.

### Validation Strategy

1. Validate incoming data at the API boundary using Zod schemas.
2. Reject malformed or unsupported input before business logic executes.
3. Apply ownership, role, and domain-specific validation in the appropriate application layer.
4. Validate external AI provider responses before using or persisting them.
5. Return standardized validation errors using the documented error envelope.

### Strict Parameter Handling

Unknown request body fields are rejected by the corresponding validation schema. Clients must not rely on undocumented fields being accepted or persisted.

Unsupported query parameters are not part of the API contract and must not alter endpoint behavior.

### Data Validation

- Persisted messages must belong to an existing conversation.
- Conversation and message ownership must be verified before protected operations.
- User roles must belong to the supported role set.
- Feedback values must belong to the supported feedback set.
- AI provider responses must be validated before being stored as assistant messages.
- Markdown content must be rendered safely by the client.

## 11. Error Handling

### Error Format

Custom application API errors follow a consistent JSON structure.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "fieldName",
        "message": "The field does not satisfy the required constraints."
      }
    ]
  }
}
```

### Error Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `error.code` | `string` | Yes | Stable programmatic error identifier |
| `error.message` | `string` | Yes | Human-readable error description |
| `error.details` | `array` | No | Optional field-level or contextual error details |

### Standardized Error Categories

| Code | HTTP Status | Description | User Recovery |
| --- | ---: | --- | --- |
| `VALIDATION_ERROR` | 400 | Request parameters or body failed validation | Correct the invalid fields |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication session | Authenticate again |
| `FORBIDDEN` | 403 | Access to the requested operation is not permitted | Verify permissions |
| `NOT_FOUND` | 404 | Requested resource does not exist or is not accessible | Verify the resource |
| `CONFLICT` | 409 | Request conflicts with the current resource state | Resolve the conflict |
| `AI_PROVIDER_ERROR` | 502 | AI provider returned an unusable response | Retry the operation |
| `AI_SERVICE_UNAVAILABLE` | 503 | Configured AI providers are unavailable | Retry when service is available |
| `AI_PROVIDER_TIMEOUT` | 504 | AI provider request timed out | Retry the operation |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server-side failure | Retry or contact support |

### Error Handling Rules

- Custom API endpoints must return consistent error envelopes.
- HTTP status codes must reflect the failure category.
- Error codes must remain stable and machine-readable.
- Messages must be useful without exposing internal implementation details.
- Stack traces, credentials, tokens, private paths, and raw dependency errors must never be returned.
- Diagnostic information belongs in server-side logs.
- Provider errors must be normalized by the AI integration layer.
- A provider failure must not be represented as a successful assistant response.
- Authentication and authorization failures must not reveal private resource information.

Auth.js-managed routes follow their own documented response protocol.

## 12. Pagination, Filtering, and Sorting

### Pagination

**Status:** No pagination contract is defined for the current API.

Conversation history and administrative collections return their corresponding `data` arrays without a pagination metadata object.

### Filtering

**Status:** No general filtering contract is defined.

The API does not currently document arbitrary filtering parameters for conversation or administrative collection endpoints.

### Sorting

| Property | Value |
| --- | --- |
| Default Sort Field | Conversation `updatedAt` |
| Default Direction | Descending |
| Supported Sort Fields | No client-selectable sort fields |
| Stable Ordering | Conversations are returned from most recently updated to least recently updated |

Conversation messages are returned chronologically. Administrative collection ordering is not a client-selectable API feature.

## 13. Idempotency and Retries

### Idempotency

| Operation | Idempotency |
| --- | --- |
| Retrieve conversations, messages, or administrative data | Idempotent |
| Create conversation | Non-idempotent |
| Rename conversation | Idempotent for the same title |
| Delete conversation | Idempotent with respect to final resource state |
| Send message | Non-idempotent |
| Edit message and regenerate | Non-idempotent |
| Retry assistant response | Non-idempotent |
| Submit feedback | Idempotent for the same feedback value |
| Update user role | Idempotent for the same role |
| Update assistant configuration | Idempotent for the same configuration |

No general `Idempotency-Key` header is defined.

### Retry Policy

The AI integration layer uses OpenRouter as its primary provider and Groq as its fallback provider.

Fallback is attempted for eligible provider or infrastructure failures, including:

- Network failures.
- Request timeouts.
- HTTP `429` responses.
- HTTP `5xx` responses.
- Provider or model unavailability.

Fallback must not be triggered by invalid user input, authentication failures, authorization failures, or other permanent application-level errors.

The API does not define automatic client retries for non-idempotent operations. A client retry of message submission or regeneration may produce another operation and must not be assumed to be a duplicate-safe request.

## 14. Rate Limiting

**Status:** No application-level rate-limiting policy is defined in this API contract.

| Scope | Limit | Time Window | Response | Notes |
| --- | --- | --- | --- | --- |
| Global | Not specified | Not specified | Not defined | No global application limit is documented |
| Per IP | Not specified | Not specified | Not defined | No application-level IP limit is documented |
| Per User | Not specified | Not specified | Not defined | No application-level user limit is documented |
| Per Endpoint | Not specified | Not specified | Not defined | No application-level endpoint limit is documented |

### Rate Limit Headers

The API does not define application-level `RateLimit-Limit`, `RateLimit-Remaining`, or `RateLimit-Reset` response headers.

Upstream provider limits may affect AI operations. Those failures are handled through the provider fallback and error-handling rules in this document.

## 15. Versioning and Compatibility

### Versioning Strategy

| Property | Value |
| --- | --- |
| Strategy | Unversioned application API |
| Current Version | Initial contract, 1.0.0 |
| Base Path | `/api` |
| Deprecation Policy | Changes are documented and coordinated with the application client |
| Compatibility Policy | The frontend and API are maintained as part of the same application release |

### Breaking Changes

A breaking change includes:

- Removing or renaming an endpoint.
- Changing an HTTP method or path.
- Changing a required request field or its type.
- Changing a response field's type or meaning.
- Changing authentication or authorization requirements.
- Changing an operation's documented behavior in a way that breaks existing client usage.

Breaking changes must be reflected in this document and in the corresponding application and contract tests.

### Backward Compatibility

- Preserve existing response contracts when possible.
- Document changes to required fields, types, validation, and endpoint behavior.
- Avoid removing or renaming public fields without updating the corresponding client.
- Update integration and contract tests whenever public API behavior changes.
- Since the API is internal to the application, frontend and backend changes are coordinated within the same release.

## 16. External Integrations

| Provider | Purpose | Authentication | Data Exchanged | Failure Behavior | Documentation |
| --- | --- | --- | --- | --- | --- |
| OpenRouter | Primary AI provider for George | Server-side API key | Conversation context and message content; generated assistant response | Eligible failures trigger fallback to Groq | [OpenRouter Documentation](https://openrouter.ai/docs) |
| Groq | Fallback AI provider for George | Server-side API key | Conversation context and message content; generated assistant response | Failure is returned through the standardized AI error contract when no provider succeeds | [Groq Documentation](https://console.groq.com/docs) |
| Supabase PostgreSQL | Persistent application database | Server-side database connection configuration | Users, conversations, messages, feedback, and application data | Database failures are handled as application errors | [Supabase Documentation](https://supabase.com/docs) |

### Integration Rules

- Provider credentials must remain server-side.
- The frontend must never communicate directly with OpenRouter or Groq using private application credentials.
- Provider requests and responses must be handled through the AI integration layer.
- External responses must be validated before they are used or persisted.
- Provider-specific response formats must not leak into the public application API.
- OpenRouter is the primary provider; Groq is the fallback.
- Fallback applies only to eligible provider and infrastructure failures.
- Provider failures must not expose raw upstream responses, credentials, or internal configuration.
- Database access must use the repository and Prisma layers.
- No unapproved external integrations may be introduced.

## 17. Security

### Transport Security

- **HTTPS:** Required for deployed environments.
- **CORS:** The application uses same-origin browser communication. No wildcard cross-origin policy is part of the API contract.
- **Network Binding:** Local development uses the Next.js development server on port `3000`. Deployment networking is managed by the hosting environment.
- **Trusted Proxies:** No custom trusted-proxy contract is defined. Deployment proxy behavior is managed by the hosting environment.

### Authentication and Authorization

- Auth.js manages credentials-based authentication and sessions.
- Passwords are hashed using `bcryptjs`.
- Protected endpoints validate sessions server-side.
- Administrative operations require the `ADMIN` role.
- Conversation and message operations enforce resource ownership.
- Client-side access restrictions are not sufficient authorization controls.

### Input and Output Security

- Validate incoming data using Zod.
- Reject unsupported request fields.
- Verify ownership before accessing or modifying resources.
- Avoid exposing internal database models or provider-specific objects.
- Render assistant Markdown through a safe Markdown renderer.
- Arbitrary HTML from message content must not be trusted or executed.
- Return standardized errors without internal stack traces or dependency details.

### Secrets and Sensitive Data

- Store database credentials, Auth.js secrets, and AI provider API keys in environment-specific configuration.
- Never expose private credentials or environment variables to the browser.
- Never return password hashes or session tokens.
- Do not log passwords, full session tokens, or provider API keys.
- Avoid logging private message content unless strictly necessary for controlled diagnostics.

### Additional Security Controls

- Auth.js session and request protections must be used for authentication-related operations.
- State-changing browser requests must follow the applicable Auth.js and application CSRF protections.
- Database queries must be scoped to the authenticated user or authorized administrative operation.
- Administrative operations must enforce authorization independently of frontend visibility.
- Provider credentials must be isolated from client-side code and responses.

## 18. Testing and Contract Verification

| Test | Purpose | Required |
| --- | --- | --- |
| Unit | Verify services, utilities, validators, and business rules | Yes |
| Integration | Verify Route Handlers, middleware, and service interactions | Yes |
| Contract | Verify request and response schemas against documented contracts | Yes |
| Authentication | Verify valid, missing, and invalid sessions | Yes |
| Authorization | Verify role restrictions and resource ownership | Yes |
| Validation | Verify rejection of malformed and unsupported input | Yes |
| Error Handling | Verify standardized error responses and HTTP status codes | Yes |
| Security | Verify applicable security controls and sensitive-data protection | Yes |
| External Integration | Verify provider communication, fallback, and failure behavior | Yes |
| Performance | Verify response times and resource behavior when required | Yes |

### Contract Verification Rules

- Every custom application endpoint documented in Section 8 must have corresponding tests.
- Auth.js-managed routes must be tested according to their authentication integration requirements.
- Test successful responses and relevant failure scenarios.
- Verify required fields, types, nullability, and response envelopes.
- Verify authentication and authorization requirements for protected operations.
- Verify that users cannot access another user's conversations or messages.
- Verify that administrative endpoints reject non-administrative users.
- Verify provider fallback for eligible failures.
- Verify that permanent validation and authorization failures do not trigger provider fallback.
- Verify that failures from both AI providers produce the documented error behavior.
- Verify that credentials, password hashes, and private configuration are not exposed.
- Update contract tests whenever this specification changes.

The approved testing stack includes Vitest, Testing Library, MSW, and Playwright.

## 19. Changelog and Evolution

| Version | Date | Change |
| --- | --- | --- |
| `1.0.0` | `2026-11-06` | Initial authoritative API contract for Dolce Vita. |

Changes that affect public API behavior must be reflected in this document and the corresponding requirements, architecture, security, and implementation documentation.

## 20. Related Documentation

| Document | Responsibility |
| --- | --- |
| [SPEC.md](SPEC.md) | Product vision, functional scope, and expected behavior |
| [REQUIREMENTS.md](REQUIREMENTS.md) | Functional and non-functional requirements and acceptance criteria |
| [PLAN.md](PLAN.md) | Approved implementation strategy and technical decisions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture patterns, layers, and component boundaries |
| [SECURITY.md](SECURITY.md) | Security policies, authentication, authorization, and data protection |
| [DATABASE.md](DATABASE.md) | Data persistence and database schema |
| [DEPLOY.md](DEPLOY.md) | Deployment environments, infrastructure, and configuration |

---

**Document Status:** Approved  
**Version:** 1.0.0  
**Last Updated:** 2026-11-06  
**Approved By:** CodeChef-AI-Chat Project Team

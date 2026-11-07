# Design System

## Document Information

| Field | Value |
| --- | --- |
| Project | `CodeChef-AI-Chat (Dolce Vita)` |
| Document | Design System |
| Version | `1.0.0` |
| Status | `Approved` |
| Last Updated | `2026-11-06` |

## 1. Purpose

The Dolce Vita Design System defines the visual language, reusable interface components, interaction patterns, and accessibility requirements of `CodeChef-AI-Chat`.

Dolce Vita is a gastronomic conversational assistant application. Its interface allows users to interact with George, manage conversation history, and receive structured responses to gastronomic questions.

The design system establishes a consistent visual identity across the application, supports light and dark themes, and provides reusable foundations for implementing and maintaining the interface.

## 2. Design Principles

### 2.1. Core Principles

- **Consistency:** Colors, typography, spacing, shapes, interaction states, and component behavior follow shared tokens and specifications.
- **Reusability:** Common interface elements are implemented as reusable components rather than recreated independently across features.
- **Accessibility:** Components provide readable contrast, keyboard interaction, visible focus indicators, semantic markup, and accessible names.
- **Scalability:** The system supports additional application features without requiring changes to its foundational visual language.
- **Maintainability:** Design tokens and reusable components are centralized. Visual changes are applied through shared definitions instead of isolated overrides.

### 2.2. Additional Principles

- **Warm and approachable identity:** The interface uses warm neutrals and orange-red accents to communicate a friendly gastronomic experience.
- **Content first:** Conversation content and message readability take priority over decorative elements.
- **Clear hierarchy:** Typography, spacing, color, and component composition distinguish primary actions, secondary actions, and supporting information.
- **Functional simplicity:** Interface elements must have a clear purpose. Decorative effects must not interfere with reading or interaction.
- **Theme consistency:** Light and dark themes share the same semantic color roles and component behavior.
- **Conversational familiarity:** Chat interactions follow recognizable patterns, allowing users to focus on their questions and the assistant's responses.

## 3. Design System Structure

### 3.1. Supported Platforms and Technologies

| Platform | Technology | Priority | Notes |
| --- | --- | --- | --- |
| Web | Next.js App Router | Primary | Application framework. |
| Web UI | React | Primary | Component-based interface implementation. |
| Language | TypeScript | Primary | Typed components, properties, and shared definitions. |
| Styling | Tailwind CSS | Primary | Utility-based styling and responsive layouts. |
| Icons | `lucide-react` | Primary | Consistent outline icon library. |
| Notifications | Sonner | Primary | Toast notifications. |
| Forms | React Hook Form and Zod | Primary | Form state and validation integration. |

### 3.2. Design System Organization

The application follows Feature Design. Design-system resources are separated from feature-specific components and application layouts.

```text
src/
├── layout/
├── ui/
├── features/
└── shared/
```

- **layout:** Application layouts and structural interface elements, including shared page composition and navigation structure.
- **ui:** Reusable visual components, primitives, and design-system implementations.
- **features:** Components and resources organized around application capabilities, such as conversations, authentication, and assistant interactions.
- **shared:** Shared utilities, types, constants, and resources that do not belong exclusively to a visual component or feature.

The design-system implementation belongs primarily in `src/ui`. Layout-specific elements belong in `src/layout`, while components that implement conversational or business behavior remain in their corresponding feature modules.

The project does not use Atomic Design folders. The `atoms`, `molecules`, and `organisms` hierarchy is not part of this structure.

### 3.3. Ownership and Responsibilities

The project maintains the design system through the following responsibilities:

| Area | Responsibility |
| --- | --- |
| Design tokens | Define and maintain colors, typography, spacing, shapes, and motion values. |
| Themes | Maintain consistent semantic color mappings for light and dark modes. |
| UI components | Implement reusable visual elements and their supported variants. |
| Layout | Maintain shared application structure and responsive behavior. |
| Feature modules | Implement feature-specific interface elements using shared design-system resources. |
| Documentation | Keep specifications aligned with the implemented components and tokens. |

### 3.4. Architectural Boundaries

The design system owns reusable visual foundations and components. It does not own application business logic, database access, AI provider integration, authentication rules, or feature-specific data operations.

Feature modules may compose and configure design-system components but must not introduce unrelated global visual definitions.

A component belongs in `src/ui` when it is reusable across multiple parts of the application and has a stable visual or interaction responsibility. Components that depend on a specific business workflow remain within their feature module.

## 4. Color System

### 4.1. Color Tokens

The palette combines a warm orange-red primary color, a secondary orange, a yellow accent, and neutral surfaces.

#### Brand colors

| Token | Value | Purpose |
| --- | --- | --- |
| `brand-primary` | `#F54900` | Main brand color and primary interactive elements. |
| `brand-primary-hover` | `#D93F00` | Hover and emphasized interaction state for primary actions. |
| `brand-secondary` | `#FF6900` | Secondary brand emphasis and supporting visual elements. |
| `brand-accent` | `#FFD236` | Small highlights, decorative accents, and selected emphasis. |

#### Light theme

| Token | Value | Purpose |
| --- | --- | --- |
| `background` | `#FAF8F6` | Main application background. |
| `surface` | `#FFFFFF` | Cards, panels, inputs, and primary content surfaces. |
| `surface-raised` | `#FFFFFF` | Elevated surfaces such as dialogs and popovers. |
| `surface-muted` | `#F3EFEB` | Secondary surfaces and grouped content. |
| `border` | `#E7DED7` | Dividers, outlines, and component borders. |
| `text-primary` | `#29231F` | Main text and headings. |
| `text-secondary` | `#766B63` | Supporting text, descriptions, and metadata. |
| `text-inverse` | `#FFFFFF` | Text on sufficiently dark brand surfaces. |

#### Dark theme

| Token | Value | Purpose |
| --- | --- | --- |
| `background` | `#0C0A09` | Main application background. |
| `surface` | `#1C1917` | Cards, panels, inputs, and primary content surfaces. |
| `surface-raised` | `#292421` | Elevated surfaces such as dialogs and popovers. |
| `surface-muted` | `#24201D` | Secondary surfaces and grouped content. |
| `border` | `#3A332E` | Dividers, outlines, and component borders. |
| `text-primary` | `#F5F0EB` | Main text and headings. |
| `text-secondary` | `#B7AAA0` | Supporting text, descriptions, and metadata. |
| `text-inverse` | `#29231F` | Text on sufficiently light surfaces. |

#### Semantic status colors

| Semantic Token | Light Background | Light Foreground | Dark Background | Dark Foreground |
| --- | --- | --- | --- | --- |
| `success` | `#E8F5EC` | `#246B43` | `#173323` | `#A9DDB9` |
| `warning` | `#FFF4D6` | `#805B00` | `#3A2D12` | `#F6D78A` |
| `error` | `#FCE9E7` | `#A63228` | `#3B1F1D` | `#F2AAA3` |
| `info` | `#E8F1FC` | `#285D91` | `#1C2C3D` | `#A9C9EC` |

| Semantic Token | Light Border | Dark Border |
| --- | --- | --- |
| `success-border` | `#B9DEC6` | `#28563A` |
| `warning-border` | `#F0D68B` | `#6B5120` |
| `error-border` | `#F1B9B3` | `#67312D` |
| `info-border` | `#BBD3EF` | `#304A66` |

### 4.2. Color Schemes and Themes

The application supports two visual themes:

- **Light:** Uses warm off-white backgrounds, white surfaces, dark text, and the brand orange-red for primary actions.
- **Dark:** Uses deep charcoal backgrounds, warm dark surfaces, light text, and the same brand colors for primary actions and emphasis.

Both themes use identical semantic token names. Components reference semantic roles rather than hardcoding separate color values for each theme.

The active theme determines the values assigned to background, surface, border, text, and status tokens. Brand identity colors remain consistent between themes.

### 4.3. Color Usage Rules

- Use `brand-primary` for the most important interactive action in a component or section.
- Use `brand-primary-hover` for the hover state of primary actions.
- Use `brand-secondary` for supporting emphasis. It must not compete with the primary action.
- Reserve `brand-accent` for small highlights and decorative emphasis. Do not use yellow as ordinary body text on white backgrounds.
- Use semantic status colors only when communicating an actual success, warning, error, or informational state.
- Use `text-primary` for essential content and `text-secondary` for supporting information.
- Maintain sufficient contrast between text, icons, borders, and their backgrounds.
- Do not use color as the only way to communicate status or meaning.
- Avoid introducing arbitrary colors outside the documented palette without updating this document.
- Do not use the brand colors as a replacement for semantic error or success colors.

## 5. Typography

### 5.1. Font Families

| Font | Usage |
| --- | --- |
| `Space Grotesk` | Main headings, page titles, and prominent interface labels. |
| `Inter` | Body text, forms, navigation, buttons, and general interface content. |
| `JetBrains Mono` | Code snippets, technical identifiers, and monospaced content when required. |

Fonts are configured through the Next.js font system. Appropriate fallback font families must be provided.

### 5.2. Type Scale

The following scale defines the standard desktop typography sizes. Responsive layouts may reduce heading sizes when necessary.

| Token | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- |
| `display` | `40px` | `700` | `1.15` | Main landing or prominent page headings. |
| `heading-1` | `32px` | `700` | `1.2` | Primary page headings. |
| `heading-2` | `24px` | `600` | `1.3` | Main section headings. |
| `heading-3` | `20px` | `600` | `1.35` | Subsection headings and prominent card titles. |
| `heading-4` | `18px` | `600` | `1.4` | Smaller component headings. |
| `body-large` | `16px` | `400` | `1.6` | Prominent paragraphs and introductory content. |
| `body` | `14px` | `400` | `1.5` | Standard interface text. |
| `body-small` | `12px` | `400` | `1.5` | Supporting information and metadata. |
| `label` | `14px` | `500` | `1.4` | Form labels and control descriptions. |
| `caption` | `11px` | `400` | `1.4` | Secondary metadata and compact annotations. |
| `code` | `13px` | `400` | `1.5` | Code and monospaced content. |

### 5.3. Typography Rules

- Use `Space Grotesk` for headings and `Inter` for general interface text.
- Maintain a clear hierarchy between page titles, section headings, body content, and metadata.
- Use consistent font weights instead of excessive bold styling.
- Body text must remain comfortable to read in both themes.
- Long assistant responses must prioritize readable line length and paragraph spacing.
- Technical code blocks use `JetBrains Mono` and must remain visually distinguishable from ordinary prose.
- Text must not be truncated when truncation would hide information required to understand an action or message.
- Font sizes and line heights must adapt to smaller screens without compromising readability.

## 6. Spacing

### 6.1. Spacing Tokens

The spacing scale uses a 4-pixel base unit.

| Token | Value | Usage |
| --- | --- | --- |
| `space-1` | `4px` | Tight internal spacing and icon gaps. |
| `space-2` | `8px` | Compact component spacing. |
| `space-3` | `12px` | Form elements and compact groups. |
| `space-4` | `16px` | Standard component padding and content gaps. |
| `space-5` | `20px` | Medium spacing between related elements. |
| `space-6` | `24px` | Section and card spacing. |
| `space-8` | `32px` | Large component and section gaps. |
| `space-10` | `40px` | Major layout separation. |
| `space-12` | `48px` | Large section spacing. |
| `space-16` | `64px` | Page-level separation. |
| `space-20` | `80px` | Large layout spacing where appropriate. |

### 6.2. Layout and Spacing Rules

- Use the spacing scale consistently for padding, margins, gaps, and component composition.
- Related elements must have smaller spacing between them than unrelated sections.
- Form labels must remain visually associated with their inputs.
- Buttons must provide sufficient internal padding around their labels and icons.
- Conversation messages must have enough separation to distinguish individual turns without wasting excessive vertical space.
- Page containers must use consistent horizontal padding.
- Responsive layouts may adapt spacing while preserving the relative hierarchy between elements.

### 6.3. Touch Targets

Interactive elements must provide sufficiently large hit areas for reliable use.

- Aim for a minimum interactive target of `44 × 44px` for primary touch controls.
- Compact icon buttons must provide an adequate clickable area even when their visible icon is smaller.
- Interactive controls must not be placed so close together that accidental activation becomes likely.
- The visual size of an icon does not determine the clickable area's size.

## 7. Shapes and Elevation

### 7.1. Shape Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `radius-sm` | `4px` | Small labels and compact controls. |
| `radius-md` | `8px` | Inputs, buttons, and standard components. |
| `radius-lg` | `12px` | Cards and grouped content. |
| `radius-xl` | `16px` | Prominent panels and larger surfaces. |
| `radius-2xl` | `20px` | Large conversational panels and selected containers. |
| `radius-full` | `9999px` | Pills, circular avatars, and fully rounded controls. |

### 7.2. Elevation and Shadows

Elevation is used sparingly to establish visual hierarchy.

| Level | Usage | Definition |
| --- | --- | --- |
| `elevation-0` | Default surfaces | No shadow; rely on background and border. |
| `elevation-1` | Cards and floating controls | Subtle shadow to separate the element from its background. |
| `elevation-2` | Dropdowns and popovers | More visible shadow for floating interface elements. |
| `elevation-3` | Dialogs and overlays | Stronger separation from the underlying interface. |

Shadows must remain subtle and adapt to the active theme. Borders and surface contrast are preferred over excessive shadow effects.

### 7.3. Shape Usage Rules

- Use consistent radii for components with similar roles.
- Inputs and buttons generally use `radius-md`.
- Cards and panels use `radius-lg` or `radius-xl`.
- Pills and circular controls use `radius-full`.
- Do not apply excessive rounding to every element.
- Use elevation to communicate layering, not as a decorative effect.
- Avoid combining strong borders and strong shadows on the same component unless its interaction requires additional emphasis.

## 8. Icons

### 8.1. Icon System

The application uses `lucide-react` as its standard icon library.

Icons follow a consistent outline style and use the same semantic color tokens as the surrounding interface.

### 8.2. Icon Sizes

| Token | Size | Usage |
| --- | --- | --- |
| `icon-xs` | `12px` | Compact metadata and small indicators. |
| `icon-sm` | `16px` | Inline actions and compact controls. |
| `icon-md` | `20px` | Standard buttons and interface elements. |
| `icon-lg` | `24px` | Navigation and prominent actions. |
| `icon-xl` | `32px` | Empty states and larger visual emphasis. |

### 8.3. Icon Usage Rules

- Use icons from `lucide-react` rather than introducing unrelated icon libraries.
- Keep icon stroke weight and visual style consistent.
- Align icons with their associated text and controls.
- Use `currentColor` or semantic color tokens whenever possible.
- Decorative icons must be hidden from assistive technologies.
- Interactive icon-only buttons must have accessible names.
- Icons must not be the only source of information when an action or status is not universally recognizable.
- Do not use emoji as a replacement for interface icons.

## 9. Component Catalog

### 9.1. Component Organization

Reusable components are organized under `src/ui`. Application layouts and feature-specific components remain outside this directory according to their responsibilities.

The catalog focuses on generic interface components that can be reused across multiple application features.

### 9.2. Naming Conventions

- React components use PascalCase names.
- Component files use PascalCase filenames.
- Shared hooks use the `use` prefix.
- Component properties use descriptive camelCase names.
- Variants use explicit, consistent values such as `primary`, `secondary`, `outline`, and `ghost`.
- Design tokens use semantic kebab-case names in documentation and consistent CSS variable names in implementation.
- Component names must describe their interface responsibility rather than a specific page or business workflow.

### 9.3. Component Inventory

| Component | Category | Description | Status | Reference |
| --- | --- | --- | --- | --- |
| `Button` | Actions | Standard button with visual and interaction variants. | Defined | Section 10.1 |
| `IconButton` | Actions | Button designed for icon-only actions. | Defined | Section 9.4 |
| `TextField` | Forms | Single-line text input. | Defined | Section 9.4 |
| `Textarea` | Forms | Multiline text input. | Defined | Section 9.4 |
| `Badge` | Feedback | Compact status or category indicator. | Defined | Section 9.4 |
| `Avatar` | Identity | User or assistant visual identity. | Defined | Section 9.4 |
| `Tooltip` | Feedback | Contextual explanation for an interface element. | Defined | Section 9.4 |
| `Dialog` | Overlays | Modal content and confirmation interactions. | Defined | Section 9.4 |
| `DropdownMenu` | Navigation and actions | Contextual menu of actions. | Defined | Section 9.4 |
| `Toast` | Feedback | Temporary notification. | Defined | Section 9.4 |
| `Skeleton` | Feedback | Placeholder for content loading. | Defined | Section 9.4 |
| `Spinner` | Feedback | Compact loading indicator. | Defined | Section 9.4 |
| `Separator` | Structure | Visual separation between content groups. | Defined | Section 9.4 |

### 9.4. Component Categories

- **Actions:** Buttons and controls that trigger user operations.
- **Forms:** Inputs and controls used to collect or edit information.
- **Feedback:** Components that communicate status, loading, errors, or additional information.
- **Identity:** Components that represent users or the assistant.
- **Overlays:** Dialogs and floating interface elements.
- **Navigation and actions:** Reusable controls for navigation and contextual operations.
- **Structure:** Components that organize or visually separate content.

Components such as conversation messages, conversation history items, assistant response controls, and the chat composer belong to their respective feature modules. They may compose design-system components but are not generic design-system primitives.

## 10. Component Specifications

### 10.1. Component Specification

#### Identity

- **Name:** `Button`
- **Category:** Actions
- **Purpose:** Trigger a user action through a clearly identifiable interactive control.
- **Platform:** Web — React and Next.js.
- **Reference:** Design tokens and interaction states documented in this file.

#### Anatomy

A standard button consists of:

- A clickable button surface.
- An optional leading icon.
- A text label.
- An optional trailing icon.
- A visual state that reflects interaction and availability.

#### Properties and Parameters

| Property | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `ButtonVariant` | `primary` | No | Visual style of the button. |
| `size` | `ButtonSize` | `md` | No | Button dimensions and internal spacing. |
| `disabled` | `boolean` | `false` | No | Prevents interaction when enabled. |
| `loading` | `boolean` | `false` | No | Indicates an ongoing operation. |
| `type` | `button \| submit \| reset` | `button` | No | Native button behavior. |
| `fullWidth` | `boolean` | `false` | No | Makes the button occupy its container width. |
| `children` | `ReactNode` | — | Yes | Button label and optional content. |
| `onClick` | `MouseEventHandler` | — | No | Action triggered by interaction. |

#### Variants

| Variant | Purpose |
| --- | --- |
| `primary` | Main action within a context. |
| `secondary` | Supporting action with lower visual emphasis. |
| `outline` | Secondary action with a visible border. |
| `ghost` | Low-emphasis action without a persistent background. |
| `destructive` | Action that removes or irreversibly modifies data. |

#### Dimensions and Layout

| Size | Minimum Height | Horizontal Padding |
| --- | --- | --- |
| `sm` | `32px` | `12px` |
| `md` | `40px` | `16px` |
| `lg` | `48px` | `20px` |

Buttons must maintain appropriate spacing between icons and labels. Their width adapts to the content unless `fullWidth` is enabled.

#### Behavior

- The button responds to pointer and keyboard interaction.
- Disabled buttons cannot trigger their associated action.
- Loading buttons communicate the ongoing operation and prevent duplicate submissions.
- The primary variant uses the brand primary color.
- Hover, focus, pressed, and disabled states follow Section 11.
- Destructive actions must communicate their consequences clearly.

#### Accessibility

- Use the native HTML `button` element.
- Provide a visible focus indicator.
- Preserve keyboard activation through Enter and Space.
- Use a descriptive label.
- Icon-only buttons must provide an accessible name.
- Loading state must be communicated to assistive technologies when relevant.
- Disabled state must be represented semantically.

#### Usage Guidelines

- **Use when:** An interface action must be explicitly triggered by the user.
- **Avoid when:** The interaction represents navigation to another resource; use an appropriate link instead.
- **Alternatives:** `IconButton` for actions represented only by an icon.

#### Examples and References

Button variants and sizes use the color, typography, spacing, shape, and interaction tokens defined in this document.

## 11. Interaction States

| State | Description | Visual Feedback | Behavioral Expectations |
| --- | --- | --- | --- |
| Default | Component is available for interaction. | Standard surface, text, and border tokens. | Normal component behavior. |
| Hover | Pointer is positioned over an interactive element. | Subtle background, border, or color change. | No action is executed until activation. |
| Focus | Component receives keyboard or programmatic focus. | Clearly visible focus indicator. | Component remains operable through supported keyboard controls. |
| Pressed | Component is being activated. | Temporary surface or opacity change. | Executes its associated action once. |
| Selected | Component represents an active selection. | Persistent selected appearance. | Selection remains until changed by the user or application. |
| Disabled | Component is unavailable. | Reduced emphasis and disabled styling. | Does not execute its action. |
| Loading | An asynchronous operation is in progress. | Spinner or equivalent progress indicator. | Prevents unintended duplicate operations where applicable. |
| Error | An operation or validation has failed. | Semantic error color and explanatory feedback. | Provides an understandable recovery path when possible. |

Interaction states must be visually distinguishable in both themes. Focus must remain visible and must not rely exclusively on color changes.

## 12. Feedback and Status Components

### 12.1. Loading

Loading indicators communicate that an operation is in progress.

- Use `Spinner` for compact operations and button-level feedback.
- Use `Skeleton` when the expected content has a recognizable structure.
- Use clear loading labels when the operation may take noticeable time.
- Avoid showing multiple redundant loading indicators for the same operation.
- Preserve the layout when possible to reduce visual movement.

### 12.2. Empty States

Empty states explain why a content area has no data and, when appropriate, provide a next action.

Examples include:

- No conversations have been created.
- A conversation contains no messages.
- A search returns no matching results.

Empty states must use concise language, appropriate visual hierarchy, and an actionable next step when one exists.

### 12.3. Error States

Errors must be communicated clearly and must not expose internal exceptions, stack traces, database details, or provider credentials.

- Use semantic error colors for error indicators.
- Explain the problem in language understandable to the user.
- Provide a retry action when the operation can be safely repeated.
- Keep unsent user input available when possible.
- Distinguish validation errors from network, authentication, and server failures.

### 12.4. Success and Confirmation

Success feedback confirms that an operation completed.

Use concise confirmation messages for actions such as:

- Conversation creation.
- Conversation rename.
- Conversation deletion.
- Successful message submission.
- Successful feedback submission.

Destructive operations must request confirmation when accidental execution could cause meaningful data loss.

### 12.5. Notifications

Sonner is the standard notification library.

Notifications must:

- Use concise and descriptive messages.
- Reflect the actual result of an operation.
- Use semantic status styling.
- Avoid duplicating information already clearly displayed in the interface.
- Remain readable in both themes.
- Be dismissible when appropriate.
- Avoid communicating critical information exclusively through a temporary toast.

## 13. Navigation Components

### 13.1. Navigation Patterns

The application uses navigation patterns appropriate for a conversational web application.

The interface distinguishes between:

- Main application navigation.
- Conversation history navigation.
- Navigation between authentication and application areas.
- Contextual navigation and actions associated with a conversation.

### 13.2. Navigation Components

Reusable navigation components include:

- Navigation links.
- Conversation history items.
- Dropdown menus for contextual actions.
- Buttons for expanding or collapsing navigation regions.
- User account controls.

Conversation-specific components remain within the conversation feature unless they are established as reusable interface primitives.

### 13.3. Navigation States

Navigation elements support the following relevant states:

- **Active:** Indicates the current page or selected conversation.
- **Inactive:** Indicates an available destination that is not selected.
- **Hover:** Provides pointer feedback.
- **Focus:** Provides visible keyboard focus.
- **Expanded:** Displays nested or contextual content.
- **Collapsed:** Hides secondary navigation content while preserving access to the main navigation.
- **Disabled:** Indicates an unavailable navigation action.

The active state must remain distinguishable in both themes and must not rely only on a small color change.

## 14. Motion and Animation

### 14.1. Motion Principles

Motion communicates state changes, establishes continuity, and provides interaction feedback.

Animations must be purposeful, brief, and consistent. They must not distract from reading assistant responses or navigating conversation history.

### 14.2. Animation Tokens

| Token | Duration | Usage |
| --- | --- | --- |
| `duration-fast` | `100ms` | Small hover and pressed-state transitions. |
| `duration-normal` | `180ms` | Standard component transitions. |
| `duration-slow` | `250ms` | Panels, menus, and moderate interface changes. |
| `duration-emphasis` | `350ms` | Larger transitions that require additional visual continuity. |

| Token | Easing | Usage |
| --- | --- | --- |
| `ease-standard` | `ease-in-out` | General interface transitions. |
| `ease-enter` | `ease-out` | Elements entering the interface. |
| `ease-exit` | `ease-in` | Elements leaving the interface. |

### 14.3. Animation Catalog

| Animation | Intended Use |
| --- | --- |
| Hover transition | Visual feedback for interactive elements. |
| Press transition | Feedback when activating buttons and controls. |
| Fade | Subtle appearance and disappearance of interface elements. |
| Slide | Opening and closing panels or menus. |
| Loading indicator | Communicate ongoing asynchronous operations. |
| Skeleton transition | Communicate loading while content is being retrieved. |

### 14.4. Accessibility and Performance

- Respect the user's `prefers-reduced-motion` setting.
- Provide reduced or non-animated alternatives for nonessential movement.
- Avoid animations that cause unnecessary layout shifts.
- Prefer efficient CSS transitions for simple interface changes.
- Do not use motion as the only indicator of a state change.
- Avoid continuous decorative animations that distract from conversational content.

## 15. Responsive Layout

### 15.1. Breakpoints and Screen Classes

The application uses the standard Tailwind CSS responsive breakpoints.

| Name | Minimum Width | Maximum Width | Target |
| --- | --- | --- | --- |
| `sm` | `640px` | `767px` | Large phones and compact layouts. |
| `md` | `768px` | `1023px` | Tablets and intermediate layouts. |
| `lg` | `1024px` | `1279px` | Small desktop and laptop layouts. |
| `xl` | `1280px` | `1535px` | Standard desktop layouts. |
| `2xl` | `1536px` | — | Large desktop layouts. |

Widths below `640px` use the mobile layout.

### 15.2. Responsive Behavior

- The interface must remain usable on mobile, tablet, and desktop screens.
- Conversation content must adapt to the available width.
- Navigation regions may collapse on smaller screens.
- Conversation messages must preserve readable line lengths.
- Forms and controls must fit narrow screens without horizontal overflow.
- Buttons and interactive elements must maintain usable hit areas.
- Dialogs and floating elements must remain within the visible viewport.
- Code blocks and long technical content must provide an appropriate overflow strategy.

### 15.3. Platform Adaptation

Dolce Vita is a web application. The primary target is a desktop browser, while mobile and tablet layouts must provide equivalent access to the main application capabilities.

Responsive adaptation must preserve the conversational experience rather than simply shrinking the desktop layout.

## 16. Accessibility

### 16.1. Accessibility Standards

The design system uses WCAG 2.2 Level AA as its accessibility target.

Implementation must follow semantic HTML and applicable WAI-ARIA practices.

### 16.2. Accessibility Requirements

- Text and interactive elements must provide sufficient color contrast.
- Color must not be the only means of communicating status or meaning.
- All interactive elements must be operable through a keyboard.
- Focus indicators must remain clearly visible.
- Form controls must have associated labels.
- Icon-only controls must have accessible names.
- Images that convey information must have meaningful alternative text.
- Decorative images and icons must be hidden from assistive technologies when appropriate.
- Heading levels must follow a logical document hierarchy.
- Dialogs must manage focus appropriately and support keyboard dismissal when applicable.
- Dynamic feedback must be communicated to assistive technologies.
- Reduced-motion preferences must be respected.
- Interactive targets must provide adequate dimensions and spacing.

### 16.3. Accessibility Validation

Accessibility is evaluated through:

- Manual keyboard navigation.
- Screen-reader checks for important application flows.
- Contrast evaluation for both themes.
- Form label and validation checks.
- Semantic HTML and accessible-name inspection.
- Automated accessibility checks where applicable.
- Responsive checks at supported screen sizes.

Meeting the documented target must be verified through implementation and testing; palette selection alone does not establish WCAG conformance.

## 17. Design Tool Integration

### 17.1. Design Tools

No dedicated external design tool is established as the authoritative source of truth.

The design-system documentation and its implementation in the repository define the approved visual specifications.

### 17.2. Design References

Approved design references are maintained alongside the project documentation and implementation.

Visual mockups and prototypes are supplementary references and must remain consistent with the tokens, component specifications, and responsive behavior defined in this document.

### 17.3. AI-Assisted Design

AI-assisted tools may be used to explore visual alternatives, generate preliminary assets, or support interface ideation.

AI-generated material is not automatically an approved design specification. Any adopted result must be reviewed for consistency, accessibility, usability, and technical feasibility.

### 17.4. Design Handoff

Design decisions must be communicated through:

- Updated design-system documentation.
- Defined token values.
- Component properties and variants.
- Interaction and responsive behavior.
- Approved visual references when available.

Implementation changes must follow the documented specifications. Any intentional deviation must be reflected in the documentation.

## 18. Design-to-Code Rules

### 18.1. Token Implementation

Design tokens are implemented through centralized CSS variables and Tailwind CSS configuration.

Semantic variables represent the active theme's values. Components consume these variables rather than hardcoding palette values.

Token names in code must communicate their semantic role, such as background, surface, primary text, secondary text, border, and status.

### 18.2. Component Implementation

- Reusable visual components belong in `src/ui`.
- Layout-specific components belong in `src/layout`.
- Feature-specific components belong in their corresponding feature modules.
- Components must use TypeScript and explicit property types.
- Component variants must be defined consistently.
- Styling must use the project's Tailwind CSS conventions and shared tokens.
- Native HTML semantics must be preferred over custom interactive elements when appropriate.
- Components must not contain database access or unrelated business logic.
- Loading, disabled, error, and focus states must be considered when relevant.

### 18.3. Reusability and Customization

- Reuse an existing component when it satisfies the required behavior and visual role.
- Extend an existing component through documented properties or variants when the difference is reusable.
- Compose multiple components when a more complex interface element is required.
- Create a new shared component only when it provides a reusable responsibility.
- Keep feature-specific behavior in the feature module rather than adding application-specific logic to generic UI components.
- Avoid excessive configuration properties that make a component difficult to understand or maintain.

### 18.4. Design and Code Synchronization

Changes to tokens, typography, spacing, themes, or shared components must be reflected in this document.

The implementation and documentation must describe the same supported variants and behavior.

When a component changes, its dependent features must be reviewed to prevent inconsistent visual behavior.

### 18.5. Prohibited Practices

- Hardcoding brand colors in individual components when a semantic token exists.
- Creating a second icon library for isolated components.
- Mixing Atomic Design and Feature Design folder structures.
- Duplicating shared components inside unrelated feature folders.
- Using arbitrary spacing, typography, or radii without a justified exception.
- Using color alone to communicate errors, success, selection, or other states.
- Removing visible keyboard focus indicators.
- Creating clickable non-semantic elements when native controls are appropriate.
- Adding decorative animations that interfere with usability.
- Exposing feature-specific business logic through generic design-system components.
- Introducing undocumented component variants or theme values.

## 19. Component Acceptance Criteria

A component is complete only when it meets all of the following criteria:

- It follows the approved design specifications and the project's platform and architectural conventions.
- It uses design tokens consistently.
- Its supported variants and interaction states are implemented.
- It satisfies applicable accessibility requirements.
- Its responsive or adaptive behavior is verified, where applicable.
- Its behavior and usage are documented.
- Applicable tests and validation checks pass.
- Its design references and implementation are synchronized.

## 20. Design System Scope

### 20.1. In Scope

- Brand color palette and semantic color tokens.
- Light and dark themes.
- Typography families and type scale.
- Spacing and layout tokens.
- Shapes, borders, and elevation.
- Icon usage and sizing.
- Reusable UI components.
- Component variants and interaction states.
- Loading, empty, error, success, and notification patterns.
- Navigation patterns and reusable navigation controls.
- Motion and animation conventions.
- Responsive layout rules.
- Accessibility requirements.
- Design-to-code conventions.

### 20.2. Out of Scope

- Application business logic.
- Authentication and authorization implementation.
- Database models and persistence.
- AI provider integration and assistant behavior.
- Conversation and message domain rules.
- API contracts and backend services.
- Feature-specific content and data management.
- External design-tool administration.

### 20.3. Scope Authority

This document defines the approved design-system scope. Components, patterns, and requirements outside this scope are not part of the design system.

## 21. References

| Resource | Description | URL |
| --- | --- | --- |
| React Documentation | Official React documentation for components and UI development. | [react.dev](https://react.dev/) |
| Next.js Documentation | Official documentation for the Next.js framework and App Router. | [nextjs.org/docs](https://nextjs.org/docs) |
| Tailwind CSS Documentation | Official documentation for utility-based styling and responsive design. | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| Lucide | Official icon library documentation. | [lucide.dev](https://lucide.dev/) |
| WCAG 2.2 | W3C Web Content Accessibility Guidelines. | [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| WAI-ARIA Authoring Practices | Accessibility patterns for interactive web components. | [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) |
| Sonner | Documentation for the notification library. | [sonner.emilkowal.ski](https://sonner.emilkowal.ski/) |

## 22. Change Log

| Version | Date | Changes | Author |
| --- | --- | --- | --- |
| `1.0.0` | `2026-11-06` | Initial design-system specification, including brand palette, light and dark themes, typography, spacing, component conventions, responsive behavior, and accessibility requirements. | Project team |

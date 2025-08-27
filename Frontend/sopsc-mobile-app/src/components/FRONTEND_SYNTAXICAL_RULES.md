# FRONTEND_SYNTAXICAL_RULES.md

> SOPSC Frontend Style & Syntax Guide
>
> This document defines styling and syntactical rules for the SOPSC frontend. It mirrors the structure and level of detail of the **CS271 Style Guide**, but is tailored to **TypeScript**, **React/React Native**, and **CSS/SCSS**. Follow these rules consistently to improve readability, maintainability, and team velocity.

---

## Table of Contents

1. Alignment & Indentation Rules
   1.1 Alignment
   1.2 Indentation
2. Syntax Rules
   2.1 Identifier & Casing Conventions
   2.2 Constants
   2.3 Types & Interfaces
   2.4 Imports & Exports
   2.5 Functions & Async Code
   2.6 File & Folder Naming
   2.7 External/Foreign Data Fields
3. Comment Rules
   3.1 File Header
   3.2 In‑line Comments
   3.3 Block Comments
   3.4 Section Comments
   3.5 Function & Component Headers
4. Component & File Layout
   4.1 Directory Structure
   4.2 React/React Native Components
   4.3 Styling (CSS/SCSS/StyleSheet)
   4.4 Services & Helpers
   4.5 State & Hooks
5. Linting, Formatting & Tooling
6. Examples Appendix (Good vs. Bad)

---

## 1. Alignment & Indentation Rules

Indenting and aligning your code and comments makes it easier to read, helping you make changes and spot mistakes.

### 1.1 Alignment

Align object literals, imports, and JSX attributes for clarity.

**No alignment (harder to scan):**

```ts
import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

const user = { id: 1, name: "Tyler", email: "t@example.com" };
```

**Aligned (preferred):**

```ts
import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

const user = {
  id: 1,
  name: "Tyler",
  email: "t@example.com",
};
```

### 1.2 Indentation

- Use **2 spaces** per indent (no tabs).
- Labels/section comments align hard-left; code and comment bodies are indented.

**No indentation:**

```tsx
<View>
  <Text>Hello</Text>
  <Button title="Click" />
</View>
```

**Offset indenting (preferred):**

```tsx
<View>
  <Text>Hello</Text>
  <Button title="Click" />
</View>
```

---

## 2. Syntax Rules

### 2.1 Identifier & Casing Conventions

Identifiers should be descriptive. Integrating the project’s rules:

- **PascalCase** — Components, **exported** functions, **types**, and filenames for components/types.
  _Examples:_ `UserList`, `CreateGroupChat`, `MessageConversation`, `FormatTimestamp`.
- **camelCase** (a.k.a. dromedaryCase) — Local variables, helper functions, service functions.
  _Examples:_ `userId`, `buildQuery`, `getUserConversations`.
- **SCREAMING_SNAKE_CASE** — Constants and global/path variables.
  _Examples:_ `API_BASE_URL`, `DEFAULT_PAGE_SIZE`.
- **whispering_snake_case** — **External/foreign API fields only** (e.g., Firestore/Expo data as‑received). Keep the original server field names at the edge to avoid mismatches.
  _Examples:_ `sent_timestamp`, `profile_picture_path`.
- **Talking_Snake_Case** — Domain object _type_ names that are multi‑word and intentionally verbose. Use sparingly and only for types/interfaces.
  _Examples:_ `User_Profile`, `Message_Envelope`.
- **kebab-case** — File and style names where applicable (e.g., CSS Modules).
  _Examples:_ `user-profile.module.scss`, `empty-state.tsx`.

**Bad:**

```ts
function getuser_data() {}
const MaxValue = 100;
```

**Good:**

```ts
function getUserData() {}
const MAX_VALUE = 100;
```

### 2.2 Constants

- Declare constants at top of module or inside the nearest relevant scope.
- Use `const` and **SCREAMING_SNAKE_CASE** for values that do not change.
- For environment variables, read from `process.env.*` once and store in a constant.

```ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_PAGE_SIZE = 20 as const;
```

### 2.3 Types & Interfaces

- Prefer **`type`** for unions and mapped types; use **`interface`** for open/extendable object shapes.
- Export shared types from `src/types/`.
- Avoid `any`; use `unknown` + narrowing or proper generics.
- Timestamp fields may be `string | number | Date | FirebaseTimestamp` — introduce a **normalizer** utility and keep type unions explicit.

```ts
type User = {
  userId: number;
  firstName: string;
  lastName: string;
  profilePicturePath?: string;
};
```

### 2.4 Imports & Exports

- Order: **node/external** → **absolute/internal** → **relative** → **styles**.
- Prefer **named exports** for utilities; **default export** for React components.
- Do not use `* as` _unless_ importing enums/constants.

```ts
import React from "react";
import { View } from "react-native";
import { formatTimestamp } from "@/utils/date";
import styles from "./conversation-item.module.scss";
```

### 2.5 Functions & Async Code

- Use **async/await**; avoid promise nesting.
- No floating promises: handle errors or explicitly annotate with a comment.
- Keep side‑effects isolated in services (API/Firestore) or effects (hooks).
- Parameter order: required → optional → rest. Provide defaults where appropriate.

```ts
export async function getConversations(userId: number, page = 0, size = 20) {
  // ...
}
```

### 2.6 File & Folder Naming

- Group related files (e.g., `components/messages/` contains inbox, item, detail).
- Component filenames match component names (`ConversationItem.tsx`).
- Services end with `.service.ts` or are grouped in `src/services/`.

### 2.7 External/Foreign Data Fields

- **Do not rename server/Firestore fields inside the network layer.** Keep `whispering_snake_case` as delivered when reading/writing.
- Convert to internal casing (camelCase) **at the boundary** using adapters/normalizers.

```ts
// Adapter example
function fromFs(doc: any) {
  return {
    messageId: doc.message_id,
    sentTimestamp: doc.sent_timestamp,
    mostRecentMessage: doc.most_recent_message,
  };
}
```

---

## 3. Comment Rules

Comments describe **intent** (why), not the obvious (what). Use consistent headers.

### 3.1 File Header

Each file begins with a brief header:

```ts
/**
 * File: ConversationItem.tsx
 * Purpose: Inbox row for a conversation (name, snippet, timestamp, status).
 * Notes: Pure view component; data formatting done in helpers.
 */
```

### 3.2 In‑line Comments

Use sparingly for complex expressions or invariants.

```ts
const isAdmin = user.roles.includes("Admin"); // guard elevated actions
```

### 3.3 Block Comments

Group multi‑step logic.

```ts
/*
 * Fetch conversations and subscribe to updates.
 * 1) Build query by participant id
 * 2) Map to view model
 * 3) Unsubscribe on unmount
 */
```

### 3.4 Section Comments

Summarize a section’s purpose.

```ts
// --------------------------
// Read receipts / badges
// --------------------------
```

### 3.5 Function & Component Headers

Exported APIs/components always have a docblock.

```ts
/**
 * getFsConversation
 * Fetches conversation document and all messages.
 * @param chatId Firestore conversation document id.
 * @returns Normalized conversation object.
 */
export async function getFsConversation(chatId: string) {
  /* ... */
}
```

---

## 4. Component & File Layout

### 4.1 Directory Structure

```
src/
  components/
    messages/
      Conversation.tsx
      ConversationItem.tsx
      Messages.tsx
  hooks/
  services/
  types/
  utils/
  styles/
```

### 4.2 React/React Native Components

- **Presentational vs. Container**: Presentational components receive data via props; containers fetch/transform data.
- **Props** are typed with `type Props = { ... }`.
- Prefer **early returns** to deep nesting.
- **Keys** for list items; avoid index as key if data has stable ids.
- Use `FlatList`/`SectionList` for large lists; memoize `renderItem` when needed.

**Bad:** logic + fetching + view all in one file.

**Good:** fetching in a hook/service, pass results to a small view component.

### 4.3 Styling (CSS/SCSS/StyleSheet)

- Prefer extracted style files (CSS Modules/SCSS) or `StyleSheet.create` for RN.
- Keep inline JSX styles minimal (only when dynamic).

```tsx
<Text style={styles.error}>Error</Text>

// conversation-item.module.scss
.error {
  color: #c00;
  font-weight: 600;
}
```

### 4.4 Services & Helpers

- **Getters**: Data pulled from APIs/Firestore must be typed and implemented in `services/` (e.g., `userService.ts`, `fsMessages.ts`).
- **Setters**: Data to be written elsewhere uses explicit types (e.g., `User.ts`, `FsMessage.ts`, `Report.ts`).
- Keep mapping/normalization in **adapters/helpers** to isolate external schemas from UI.

### 4.5 State & Hooks

- Custom hooks live in `src/hooks/` and start with `use*`.
- Hook order: `useState` → `useMemo`/`useCallback` → `useEffect`/subscriptions.
- Cleanup subscriptions in the return function of `useEffect`.

---

## 5. Linting, Formatting & Tooling

- **ESLint** for code quality, **Prettier** for formatting.
- No disabling rules without justification.
- TypeScript `strict` mode preferred; avoid `any`.
- Use path aliases (e.g., `@/components`) for internal imports where configured.

---

## 6. Examples Appendix (Good vs. Bad)

### Example A — Timestamp Normalization

**Bad:**

```ts
<Text>{formatTimestamp(item.sentTimestamp)}</Text> // sentTimestamp: string | FirebaseTimestamp
```

**Good:**

```ts
import { formatTimestamp } from "@/utils/date";
<Text>{formatTimestamp(item.sentTimestamp)}</Text>; // accepts string | Date | FirebaseTimestamp
```

### Example B — Read Receipts Field

**Bad:**

```ts
readBy: { [user.userId]: true }, // number key may coerce in unexpected ways
```

**Good:**

```ts
readBy: { [String(user.userId)]: true }, // Firestore map keys are strings
```

### Example C — Service Boundary

**Bad:** UI calls Firestore directly everywhere.

**Good:** Firestore logic lives in `fsMessages.ts` (subscribe, send, markRead); components receive ready‑to‑render data.

---

## Final Notes

- Prefer clarity over cleverness; descriptive names beat terse ones.
- Keep modules small and cohesive. If a file grows beyond \~300 lines, split it.
- Consistency across the codebase is more valuable than individual preferences.

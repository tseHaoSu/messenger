# CLAUDE.md

## Project Overview

Real-time messenger application with Clerk authentication and Convex backend.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server (runs Next.js + Convex)
pnpm build            # Build for production
pnpm lint             # Run linter
npx convex dev        # Start Convex development server
npx convex deploy     # Deploy Convex to production
```

## Repository Structure

```
messenger/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (thin - import from modules)
│   ├── (dashboard)/        # Dashboard routes (thin - import from modules)
│   ├── modules/            # Feature modules (ALL logic)
│   │   ├── auth/           # Auth views, layouts, components
│   │   ├── conversations/  # Conversation views, components
│   │   ├── dashboard/      # Dashboard layouts, views
│   │   └── messages/       # Message components
│   └── layout.tsx          # Root layout with providers
├── components/
│   ├── providers/          # Context providers (Convex, Clerk)
│   └── ui/                 # Reusable UI components (shadcn)
├── convex/
│   ├── schema.ts           # Database schema
│   ├── auth.config.ts      # Clerk auth configuration
│   └── lib/utils.ts        # Backend utilities
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── public/                 # Static assets
```

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Convex (real-time database + serverless functions)
- **Auth:** Clerk
- **State Management:** Zustand
- **Validation:** Zod
- **UI Components:** shadcn/ui, Radix UI

## Coding Rules

### TypeScript
- **NEVER use `any`** - Use proper interfaces or `unknown` with type guards
- **Always use `interface` over `type`** for object shapes
- Use `import type` for type-only imports
- Infer types from Zod schemas when possible
- Define explicit return types for functions

### State Management (Zustand)
```typescript
import { create } from "zustand";

interface StoreState {
  count: number;
  increment: () => void;
}

export const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Validation (Zod)
```typescript
import { z } from "zod";

export const messageSchema = z.object({
  body: z.string().min(1).max(2000),
  type: z.enum(["text", "image", "system"]),
});

export type Message = z.infer<typeof messageSchema>;
```

### React Components
```typescript
"use client"; // Only for client components

import { useState } from "react";

interface Props {
  initialValue: string;
}

export const MyComponent = ({ initialValue }: Props) => {
  const [value, setValue] = useState(initialValue);
  return <button onClick={() => setValue("new")}>{value}</button>;
};
```

### Convex Functions
```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: { body: v.string(), conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    return await ctx.db.insert("messages", {
      senderId: user._id,
      conversationId: args.conversationId,
      body: args.body,
      type: "text",
    });
  },
});
```

### Styling
- Check existing global styles before adding new CSS
- Use Tailwind utility classes
- Use `gap-*` instead of `space-*` for flex/grid spacing
- Use `cn()` helper for conditional class merging

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Hooks: `use-feature-name.ts`
- Stores: `use-feature-store.ts`
- Types: `camelCase.types.ts`
- **No barrel exports** - use explicit imports, no `index.ts` files in modules

## Import Order

```typescript
// 1. React/Framework imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { useQuery, useMutation } from "convex/react";
import { create } from "zustand";
import { z } from "zod";

// 3. Internal/workspace packages
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";

// 4. Relative imports
import { MyComponent } from "./MyComponent";
import type { MyType } from "../types";
```

## Database Schema

Tables: `users`, `conversations`, `conversationMembers`, `messages`, `messageReactions`

Key patterns:
- Use `v.id("tableName")` for foreign keys
- Add indexes for common query patterns
- Use `_creationTime` for timestamps (built-in)

## Environment Variables

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## Common Pitfalls

1. Never use `any` type - use `unknown` with type guards instead
2. Always validate user input with Zod before mutations
3. Never commit secrets or API keys
4. Always handle loading and error states in UI
5. Use `getCurrentUser(ctx)` in Convex mutations for auth
6. Filter soft-deleted messages with `deletedAt == null`

## Git Conventions

```bash
# Commit message format
<type>: <description>

# Types: feat, fix, docs, style, refactor, test, chore

# Examples
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
```

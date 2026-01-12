# Design Document

## Overview

Real-time messenger application built with Next.js, Convex, and Clerk. Supports instant messaging, typing indicators, message reactions, and image attachments.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │    Clerk    │  │      Zustand        │  │
│  │  App Router │  │    Auth     │  │   (Client State)    │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          │                │                    │
┌─────────┼────────────────┼────────────────────┼─────────────┐
│         ▼                ▼                    │   Backend   │
│  ┌─────────────────────────────┐              │             │
│  │          Convex             │◄─────────────┘             │
│  │  ┌─────────┐  ┌──────────┐  │                            │
│  │  │ Queries │  │Mutations │  │                            │
│  │  └────┬────┘  └────┬─────┘  │                            │
│  │       │            │        │                            │
│  │       ▼            ▼        │                            │
│  │  ┌─────────────────────┐    │                            │
│  │  │   Real-time DB      │    │                            │
│  │  └─────────────────────┘    │                            │
│  └─────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Tables

```
users
├── _id: Id<"users">
├── name: string
├── email: string
├── image?: string
└── tokenIdentifier: string (Clerk token)

conversations
├── _id: Id<"conversations">
├── isGroup: boolean
├── lastMessageId?: Id<"messages">
└── lastMessageAt?: number

conversationMembers
├── _id: Id<"conversationMembers">
├── conversationId: Id<"conversations">
└── userId: Id<"users">

messages
├── _id: Id<"messages">
├── conversationId: Id<"conversations">
├── senderId: Id<"users">
├── type: "text" | "image" | "system"
├── body?: string
├── image?: string
├── createdAt: number
├── deletedAt?: number
└── reactionCounts?: { like, love, laugh }

messageReactions
├── _id: Id<"messageReactions">
├── messageId: Id<"messages">
├── userId: Id<"users">
└── type: "like" | "love" | "laugh"

typingIndicators
├── _id: Id<"typingIndicators">
├── conversationId: Id<"conversations">
├── userId: Id<"users">
└── expiresAt: number
```

### Indexes

- `users.by_token` - Lookup user by Clerk token
- `conversationMembers.by_conversation` - Get members of conversation
- `conversationMembers.by_user` - Get user's conversations
- `messages.by_conversation` - Get messages in conversation
- `messageReactions.by_message_user` - Check user's reaction on message
- `typingIndicators.by_conversation` - Get who's typing

## Module Structure

```
app/modules/
├── auth/
│   ├── layouts/AuthLayout.tsx
│   └── views/
│       ├── SignInView.tsx
│       └── SignUpView.tsx
├── conversations/
│   ├── components/
│   │   ├── Avatar.tsx
│   │   ├── conversation-list/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ConversationItem.tsx
│   │   │   ├── EmptyConversation.tsx
│   │   │   └── new-conversation-dialog/
│   │   │       ├── NewConversationDialog.tsx
│   │   │       ├── UserSelectItem.tsx
│   │   │       └── EmptyState.tsx
│   │   └── message-panel/
│   │       ├── MessageList.tsx
│   │       ├── TimestampDivider.tsx
│   │       ├── TypingIndicator.tsx
│   │       ├── message-item/
│   │       │   ├── MessageItem.tsx
│   │       │   ├── MessageBubble.tsx
│   │       │   ├── ReactionDisplay.tsx
│   │       │   └── ReactionContextMenu.tsx
│   │       └── message-input/
│   │           ├── MessageInput.tsx
│   │           └── AttachmentDialog.tsx
│   ├── hooks/
│   │   ├── use-message-draft.ts
│   │   ├── use-optimistic-messages.ts
│   │   ├── use-typing-indicator.ts
│   │   └── use-conversation-prefetch.ts
│   ├── views/
│   │   ├── ConversationsView.tsx
│   │   └── ConversationView.tsx
│   └── types.ts
└── dashboard/
    ├── layouts/DashboardLayout.tsx
    └── components/Header.tsx
```

## State Management

### Server State (Convex)

All persistent data lives in Convex with real-time subscriptions:

```typescript
// Queries - real-time subscriptions
const messages = useQuery(api.private.messages.list, { conversationId });
const conversations = useQuery(api.private.conversations.list);

// Mutations - write operations
const sendMessage = useMutation(api.private.messages.send);
```

### Client State (Zustand)

Ephemeral UI state stored in Zustand:

```typescript
// Message drafts per conversation
interface MessageDraftState {
  drafts: Record<string, string>;
  setDraft: (conversationId: string, text: string) => void;
  clearDraft: (conversationId: string) => void;
}
```

**Why Zustand for drafts?**
- Persists across component unmounts
- No need to save to database
- Instant access, no async

## Authentication Flow

```
1. User clicks "Sign In"
           │
           ▼
2. Clerk handles OAuth/email auth
           │
           ▼
3. On success, Clerk provides JWT
           │
           ▼
4. UserSync component calls users.store mutation
           │
           ▼
5. Convex creates/updates user record
           │
           ▼
6. User redirected to /conversations
```

### Token Matching

```typescript
// Clerk provides tokenIdentifier in JWT
// Convex matches it to find current user
const user = await ctx.db
  .query("users")
  .withIndex("by_token", (q) =>
    q.eq("tokenIdentifier", identity.tokenIdentifier)
  )
  .unique();
```

## Real-time Features

### Message Sync

```
User A sends message
        │
        ▼
Convex mutation inserts to DB
        │
        ▼
All subscribed clients receive update
        │
        ▼
UI updates automatically
```

### Typing Indicators

```typescript
// 1. User types → debounced setTyping call
// 2. Creates record with 5s expiry
// 3. Query filters expired records
// 4. Auto-clears when user stops typing
```

### Optimistic Updates

```typescript
// Show message immediately before server confirms
const optimisticMessages = useOptimisticMessages();

// On send:
1. Add to optimistic list (status: "pending")
2. Send to Convex
3. On success: Remove from optimistic, appears in real list
4. On failure: Mark as "failed", show retry option
```

## Message Reactions

### Toggle Logic

```typescript
// convex/private/messages.ts - toggleReaction
1. Check if user already reacted
2. If same reaction type → remove it
3. If different type → switch to new type
4. If no reaction → add new one
5. Update reactionCounts aggregate
```

### Display

```
┌─────────────────────────┐
│  Hey, how are you?      │
│                    ❤️👍 2│  ← Overlapping emoji pill
└─────────────────────────┘
```

## Image Attachments

### Upload Flow

```
1. User drops image in AttachmentDialog
           │
           ▼
2. Generate upload URL (Convex mutation)
           │
           ▼
3. POST image to Convex storage
           │
           ▼
4. Get storage ID
           │
           ▼
5. Convert to public URL
           │
           ▼
6. Send message with image URL
```

## Responsive Design

### Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Sheet drawer navigation |
| Desktop | >= 768px | Side-by-side panels |

### Mobile Adaptations

- Collapsible conversation list (Sheet)
- Wider message bubbles (85% vs 70%)
- Larger tap targets (py-3)
- Safe area insets for notch
- Smaller header (h-14 vs h-20)

## Security

### Authentication

- All mutations require authenticated user
- `getAuthenticatedUser()` throws if not logged in
- Token validated by Convex via Clerk JWT

### Authorization

- Users can only access their conversations
- Message sender verified server-side
- Soft delete preserves data integrity

### Input Validation

- Zod schemas for all inputs
- Max message length enforced
- File size limits on uploads

## Performance Optimizations

### Conversation Prefetching

```typescript
// Prefetch messages on conversation hover
onHover={(id) => prefetch(api.private.messages.list, { conversationId: id })}
```

### Efficient Queries

- Indexed lookups for all queries
- Pagination for message history
- Aggregated reaction counts (avoid N+1)

### Client-side

- Optimistic updates for instant feedback
- Debounced typing indicator
- Lazy loading for images

## Error Handling

### Convex Errors

```typescript
throw new ConvexError({
  code: "UNAUTHORIZED",
  message: "User must be authenticated.",
});
```

### Client Handling

- Toast notifications for user errors
- Retry mechanisms for transient failures
- Graceful degradation when offline

## Testing Strategy

### E2E Tests (Playwright)

```
e2e/
├── auth.spec.ts         # Sign in/out flows
├── conversations.spec.ts # Create/delete conversations
├── messages.spec.ts      # Send/receive messages
└── fixtures/
    └── test-fixtures.ts  # Shared test utilities
```

### Test User

```bash
E2E_CLERK_USER_USERNAME=test@example.com
E2E_CLERK_USER_PASSWORD=testpassword
```

## Deployment

### Environment Variables

| Variable | Environment | Purpose |
|----------|-------------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Both | Convex project URL |
| `CONVEX_DEPLOY_KEY` | Production | CI/CD deployment |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Both | Clerk frontend auth |
| `CLERK_SECRET_KEY` | Server | Clerk backend auth |
| `CLERK_JWT_ISSUER_DOMAIN` | Convex | JWT validation |

### Deploy Commands

```bash
# Development
pnpm dev

# Production
npx convex deploy --cmd 'pnpm build'
```

## Future Considerations

- [ ] Read receipts
- [ ] Message editing
- [ ] Message search
- [ ] Push notifications
- [ ] Voice messages
- [ ] Video calls
- [ ] End-to-end encryption

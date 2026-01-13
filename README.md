# Messenger

Real-time messaging application with authentication and instant message delivery.

## Demo

https://www.messenger-clone.space

## Features

- Real-time messaging with instant updates
- User authentication (sign up, sign in, sign out)
- Create and delete conversations
- Support for 1:1 and group conversations
- Typing indicators with real-time sync
- Message reactions (like, love, laugh)
- Image attachments with drag-and-drop upload
- FB-style timestamp dividers (15-min threshold)
- Optimistic message sending
- Message drafts persistence
- Dark/light theme toggle
- Responsive design

## Tech Stack

- **Framework**: Next.js 16, React 19, TypeScript
- **Backend**: Convex (real-time database + serverless functions)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Validation**: Zod
- **Testing**: Playwright (E2E)

## Project Structure

```
messenger/
├── app/
│   ├── (auth)/                    # Auth routes (sign-in, sign-up)
│   ├── (dashboard)/               # Dashboard routes (conversations)
│   └── modules/                   # Feature modules
│       ├── auth/                  # Auth views and layouts
│       ├── conversations/
│       │   ├── components/
│       │   │   ├── conversation-list/
│       │   │   │   ├── new-conversation-dialog/
│       │   │   │   ├── ConversationList.tsx
│       │   │   │   └── ConversationItem.tsx
│       │   │   └── message-panel/
│       │   │       ├── message-item/
│       │   │       ├── message-input/
│       │   │       ├── MessageList.tsx
│       │   │       └── TypingIndicator.tsx
│       │   ├── hooks/
│       │   ├── views/
│       │   └── types.ts
│       └── dashboard/             # Dashboard layout and header
├── components/
│   ├── providers/                 # Context providers (Convex, Clerk, Theme)
│   ├── shimmer/                   # Loading skeleton components
│   └── ui/                        # Reusable UI components (shadcn)
├── convex/
│   ├── private/                   # Protected mutations and queries
│   ├── schema.ts                  # Database schema
│   └── lib/utils.ts               # Backend utilities
├── e2e/                           # Playwright E2E tests
├── hooks/                         # Custom React hooks
└── lib/                           # Utility functions and constants
```

## Getting Started

### Prerequisites

- Node.js 18+ (or Docker)
- pnpm
- Convex account
- Clerk account

### Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_APP_URL=
```

### Docker (Recommended)

Run the app with Docker Compose:

```bash
# Build and start
docker compose up --build

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

Access at http://localhost:3000

**Docker features:**
- Multi-stage build for minimal image size (~150MB)
- Non-root user for security
- Health checks for container monitoring
- Automatic restarts (`unless-stopped`)

**Build args** (NEXT_PUBLIC_* vars are embedded at build time):
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_APP_URL`

### Local Development (Without Docker)

```bash
pnpm install
pnpm dev
```

Runs Next.js and Convex development servers concurrently.

### Testing

```bash
pnpm test:e2e
```

### Build

```bash
pnpm build
```

## License

MIT

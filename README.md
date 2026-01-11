# Messenger

Real-time messaging application with authentication and instant message delivery.

## Demo

Coming soon

## Screenshots

Coming soon

## Features

- Real-time messaging with instant updates
- User authentication (sign up, sign in, sign out)
- Create and delete conversations
- Support for 1:1 and group conversations
- Message drafts persistence
- Dark/light theme toggle
- Responsive design (desktop and mobile)

## Tech Stack

- **Framework**: Next.js 16, React 19, TypeScript
- **Backend**: Convex (real-time database + serverless functions)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand

## Project Structure

```
messenger/
├── app/
│   ├── (auth)/              # Auth routes (sign-in, sign-up)
│   ├── (dashboard)/         # Dashboard routes (conversations)
│   └── modules/             # Feature modules
│       ├── auth/            # Auth views and layouts
│       ├── conversations/   # Conversation components, hooks, views
│       └── dashboard/       # Dashboard layout and header
├── components/
│   ├── providers/           # Context providers (Convex, Clerk, Theme)
│   ├── shimmer/             # Loading skeleton components
│   └── ui/                  # Reusable UI components (shadcn)
├── convex/
│   ├── private/             # Protected mutations and queries
│   ├── schema.ts            # Database schema
│   └── lib/utils.ts         # Backend utilities
├── hooks/                   # Custom React hooks
└── lib/                     # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Convex account
- Clerk account

### Environment Variables

```bash
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This runs Next.js and Convex development servers concurrently.

### Build

```bash
pnpm build
```

## License

MIT

# Nexus AI

A production-grade monorepo for AI-powered content summarization and task extraction. Nexus AI enables users to submit documents, generate intelligent summaries, and extract actionable tasks using configurable AI providers.

## Overview

Nexus AI solves the problem of information overload by automatically analyzing documents and extracting key insights and actionable items. The platform supports both guest access for trial usage and authenticated user accounts for persistent task management.

### Key Features

- **Guest Mode**: Try the platform with one free AI-powered summary without creating an account
- **AI-Powered Analysis**: Generate comprehensive summaries and extract actionable tasks from any document
- **Task Management Dashboard**: Authenticated users can view, organize, and track extracted tasks
- **Model-Agnostic Architecture**: Abstracted AI provider interface supporting multiple backends (Gemini, Ollama)
- **Clean MVCS Backend**: Modular architecture following Model-View-Controller-Service patterns
- **Caching & Rate Limiting**: Optimized performance with intelligent caching and request throttling
- **Type-Safe Validation**: End-to-end type safety with Zod schemas and TypeScript

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives, Lucide icons

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Validation**: Zod
- **Security**: Helmet, CORS, cookie-parser
- **Logging**: Winston + Morgan
- **Rate Limiting**: express-rate-limit

### Database & Caching
- **Primary Database**: PostgreSQL
- **ORM**: Prisma with migration support
- **Session Management**: Cookie-based guest tracking

### AI Providers
- Google Gemini
- Ollama (local models)

## Architecture Overview

Nexus AI is structured as a Yarn workspaces monorepo with clear separation of concerns:

```
nexus-ai-monorepo/
├── apps/
│   ├── api/          # Express backend (MVCS architecture)
│   └── web/          # Next.js frontend (App Router)
├── packages/
│   └── shared/       # Shared types and utilities
└── prisma/           # Database schema and migrations
```

### Frontend Architecture
The Next.js application uses the App Router pattern with a feature-based organization. Components are organized into reusable UI primitives and feature-specific modules.

### Backend Architecture
The Express API follows a modular MVCS (Model-View-Controller-Service) pattern:
- **Models**: Prisma schema definitions for database entities
- **Controllers**: HTTP request handlers and response formatting
- **Services**: Business logic and AI provider orchestration
- **Modules**: Feature-based organization (auth, documents, tasks, ai, guests, health)

### Guest Access Flow
1. First-time visitors receive a unique `guestId` cookie
2. Guest sessions are tracked in the `GuestSession` table
3. One free AI run is permitted per guest session
4. Guest results are returned but tasks are not persisted
5. Users must authenticate to save and manage tasks

### AI Request Flow
1. Document submitted via frontend
2. Backend validates request and checks guest/user limits
3. Content hash computed to check for cached results
4. AI provider abstraction layer routes request to configured provider
5. Summary and tasks extracted from AI response
6. Results cached and returned to client
7. For authenticated users, tasks are persisted to database

## Repository Structure

```
apps/
├── api/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Migration history
│   └── src/
│       ├── config/             # Environment and logger config
│       ├── middlewares/        # Express middlewares
│       ├── modules/            # Feature modules (auth, ai, tasks, etc.)
│       ├── app.ts              # Express app configuration
│       └── server.ts           # Server entry point
└── web/
    └── src/
        ├── app/                # Next.js App Router pages
        ├── components/         # Reusable UI components
        ├── features/           # Feature-specific modules
        └── lib/                # Utilities and configurations

packages/
└── shared/                     # Shared types and utilities
```

## Running the Project Locally

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Yarn package manager

### Installation

1. Clone the repository and install dependencies:
```bash
yarn install
```

2. Configure environment variables:

**Backend** (`apps/api/.env`):
```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your database credentials and settings
```

Required variables:
- `PORT`: API server port (default: 4000)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGIN`: Frontend URL for CORS

**Frontend** (`apps/web/.env`):
```bash
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env with your API URL
```

Required variables:
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL (default: http://localhost:4000)
- `NEXT_PUBLIC_APP_NAME`: Application name

3. Set up the database:
```bash
cd apps/api
yarn prisma:migrate
```

4. Start both applications:
```bash
# From repository root
yarn dev
```

This runs both the frontend and backend concurrently.

Alternatively, start them separately:
```bash
# Terminal 1 - Backend
cd apps/api
yarn dev

# Terminal 2 - Frontend
cd apps/web
yarn dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/health

## Health Check

Verify the backend is running correctly:

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-09T06:32:53.000Z",
  "env": "development"
}
```

Verify the frontend is accessible by navigating to http://localhost:3000 in your browser.

## Environment Variables

### Backend (`apps/api/.env.example`)
Reference the example file for all required backend configuration:
- Database connection
- Server port and environment
- CORS settings

### Frontend (`apps/web/.env.example`)
Reference the example file for all required frontend configuration:
- API base URL
- Application metadata

**Important**: Never commit actual `.env` files. Use `.env.example` as a template.

## Development Notes

### Guest Limit Enforcement
- Guest sessions are tracked server-side using secure cookies
- The `freeRunUsedAt` timestamp in `GuestSession` enforces the one-free-run limit
- Subsequent guest requests are rejected until the user authenticates

### Task Persistence
- Tasks extracted from AI runs are only persisted for authenticated users
- Guest users receive task data in the API response but it is not saved to the database
- The `Task` model requires a `userId`, preventing guest task persistence at the schema level

### AI Provider Abstraction
- AI providers are abstracted behind a common interface
- Provider selection is configurable per request
- Easy to add new providers by implementing the interface
- Supports caching based on content hash to reduce redundant API calls

### Database Schema
- Prisma schema supports both user-owned and guest-owned documents
- Content hashing enables deduplication and caching
- Comprehensive indexing for performance optimization
- Soft deletion patterns with `onDelete: SetNull` for data preservation

## Future Improvements

- **Background Job Processing**: Queue AI runs for better scalability and user experience
- **Team Collaboration**: Shared workspaces and task assignment
- **Export & Integrations**: Export tasks to external tools (Jira, Asana, Notion)
- **Advanced AI Features**: Multi-document analysis, custom extraction templates
- **Real-time Updates**: WebSocket support for live task updates
- **Analytics Dashboard**: Usage metrics and AI performance tracking

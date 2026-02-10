# Nexus AI

Production-ready MVP for meeting transcript summarization and action-item extraction.

Nexus AI turns unstructured meeting text into:
- concise and detailed summaries
- extracted, actionable tasks
- persisted documents/tasks for authenticated users

Built to demonstrate full-stack engineering depth: modular backend architecture, secure cookie-based auth, provider-agnostic AI integration, caching, and a scalable monorepo structure.

## Why This Project

Teams lose execution context in long meetings and scattered notes. Nexus AI reduces that operational drag by converting transcripts into clear summaries and task lists that can be tracked in-app.

## MVP Status

`MVP complete` with end-to-end flow:
- guest users can run exactly one free AI extraction
- users can sign up/sign in via email/password or Google OAuth
- authenticated users can generate, save, browse, and manage extracted work
- auth state persists correctly across refresh/navigation with httpOnly cookie sessions and `/auth/me` bootstrap
- auth page guards prevent signed-in users from revisiting `/signin` or `/signup`

## Core Features

- **AI summarization + extraction**
  - Short summary, detailed summary, highlights, and tasks.
- **Guest mode with hard usage gating**
  - Exactly one free run enforced server-side.
- **Secure auth**
  - JWT in httpOnly cookies, Google OAuth, email/password registration.
- **Task management dashboard**
  - View and manage extracted tasks/documents.
- **Model-agnostic AI providers**
  - Swappable provider interface (`Gemini`, `Ollama`, `Mock`).
- **Caching + performance controls**
  - Redis-backed caching, rate limiting, validation, centralized error handling.

## Tech Stack

### Frontend (`apps/web`)
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 + Radix/shadcn-style UI primitives
- Zustand (client auth state)
- TanStack Query (server state)
- React Hook Form + Zod (form + runtime validation)
- Sonner (notifications)

### Backend (`apps/api`)
- Express + TypeScript
- Prisma + PostgreSQL
- Redis
- Passport (Google OAuth)
- Argon2 + JWT
- Helmet, CORS, cookie-parser, express-rate-limit
- Winston + Morgan logging

### Workspace
- Yarn workspaces monorepo (`apps/*`, `packages/*`)

## Architecture

### Backend pattern
Feature-module MVCS style:
- Routes -> Controllers -> Services -> Repositories
- Shared middlewares (auth, validation, guest-session, error)
- Config layer for env, logging, Redis, Prisma, Passport

Main modules:
- `auth`
- `ai`
- `documents`
- `tasks`
- `guests`

### Frontend pattern
Feature-first organization with clear boundaries:
- `features/auth` (auth provider, store, api, auth components, types)
- `features/ai` (AI run flow + transcript input)
- `features/documents`
- `features/tasks`
- `features/layout` (navigation/layout components)
- `components/ui` (reusable UI primitives)

This keeps domain logic close to each feature while preserving reusable primitives.

## Security + Auth Design

- Authentication token is stored in **httpOnly cookie** (not localStorage token auth).
- Frontend uses `credentials: include` for secure cookie-based session calls.
- Auth bootstrap flow calls `/auth/me` during app initialization.
- Route guards enforce:
  - protected dashboard routes require authentication
  - authenticated users are redirected away from `/signin` and `/signup`

## AI Request Flow

1. User/guest submits transcript text.
2. API validates payload and checks auth/guest usage limits.
3. Content hash + cache key are derived.
4. Redis cache is checked.
5. On miss, provider executes (`Gemini`/`Ollama`/`Mock`).
6. Response is normalized into summaries/tasks.
7. Authenticated runs persist document/task data.
8. Guest receives result but is constrained by one-run policy.

## Repository Structure

```text
.
├── apps
│   ├── api
│   │   ├── prisma
│   │   └── src
│   │       ├── config
│   │       ├── middlewares
│   │       ├── modules
│   │       └── routes
│   └── web
│       └── src
│           ├── app
│           ├── components/ui
│           ├── features
│           │   ├── ai
│           │   ├── auth
│           │   ├── documents
│           │   ├── layout
│           │   └── tasks
│           └── lib
├── packages
│   └── shared
└── README.md
```

## Local Setup

### Prerequisites
- Node.js 20+
- Yarn 1.x
- PostgreSQL
- Redis

### 1) Install dependencies

```bash
yarn install
```

### 2) Configure environment variables

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Set required values in `apps/api/.env`:
- `DATABASE_URL`
- `JWT_SECRET`
- `GEMINI_API_KEY` (if `AI_PROVIDER=GEMINI`)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (for OAuth)

### 3) Run database migration

```bash
cd apps/api
yarn prisma:migrate
cd ../..
```

### 4) Start both apps

```bash
yarn dev
```

App endpoints:
- Frontend: `http://localhost:3000`
- API: `http://localhost:4000`
- Health: `http://localhost:4000/health`

## Scripts

From repo root:
- `yarn dev` - run web + api concurrently
- `yarn build` - build all workspaces
- `yarn lint` - lint all workspaces
- `yarn typecheck` - type-check all workspaces

API workspace (`apps/api`):
- `yarn dev`
- `yarn prisma:migrate`
- `yarn prisma:studio`

Web workspace (`apps/web`):
- `yarn dev`
- `yarn build`
- `yarn start`

## Engineering Highlights (Recruiter Quick Scan)

- Designed and implemented a full-stack SaaS MVP with modular architecture.
- Applied secure cookie-based authentication and route-level access control.
- Implemented provider-agnostic AI integration for future model flexibility.
- Built guest-usage gating with backend enforcement logic.
- Structured frontend into feature-driven domains with reusable UI primitives.
- Added resilient validation and error boundaries across client/server.

## Future Evolution

- Async job queue for long-running AI processing
- Background retries and dead-letter handling
- Team workspaces and RBAC
- Third-party task sync (Jira/Notion/Linear)
- Observability stack (metrics/tracing/alerts)

---

Nexus AI is engineered as a practical product to make day-to-day meeting follow-up easier through reliable summarization, actionable extraction, and secure task workflows.

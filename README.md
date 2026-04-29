# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits, built with Next.js and React. Create, edit, and manage habits while tracking completion streaks — all with offline support and local persistence.

## Features

- **Authentication** — Sign up and log in with email/password (stored locally)
- **Habit Management** — Create, edit, and delete daily habits
- **Completion Tracking** — Mark habits complete/incomplete for today
- **Streak Counter** — Visible current streak calculated from consecutive completions
- **Offline Support** — Service worker caches the app shell; no crash without network
- **Installable** — Meets PWA criteria for Add to Home Screen

## Tech Stack

- **Framework:** Next.js (App Router) with React and TypeScript
- **Styling:** Tailwind CSS
- **Persistence:** localStorage (no remote database)
- **Testing:** Vitest + React Testing Library (unit/integration), Playwright (E2E)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Running Tests

```bash
# Unit tests with coverage
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (requires a running build)
npm run build && npx playwright install && npm run test:e2e

# Run all tests
npm test
```

## Persistence

All data is stored in `localStorage` using three keys:

| Key | Contents |
|---|---|
| `habit-tracker-users` | Array of user objects (id, email, password, createdAt) |
| `habit-tracker-session` | Current session (userId, email) or absent if logged out |
| `habit-tracker-habits` | Array of habit objects scoped to users via `userId` |

- Each user's habits are isolated by `userId`.
- Completions are stored as an array of `YYYY-MM-DD` date strings.
- Data survives page reloads but is cleared if the user clears browser storage.

## PWA

The app is installable and works offline:

- **`public/manifest.json`** — App metadata, icons, and display mode (`standalone`)
- **`public/sw.js`** — Service worker that caches the app shell on install and serves cached assets when offline (network fallback strategy)
- **`public/icons/`** — 192×192 and 512×512 PNG icons for home screen and splash

The service worker is registered on app load via a client component (`ServiceWorkerRegistrar`).

## Architecture & Trade-offs

| Decision | Rationale |
|---|---|
| **localStorage over a database** | PRD requires front-end-only, deterministic persistence. localStorage is synchronous and needs no setup, making tests fully reproducible. |
| **Password stored in plain text** | Required by PRD (no external auth service). In a real product this would use hashing + a server. |
| **Single `'daily'` frequency** | PRD scopes frequency to daily only; the select element is present but disabled for future extensibility. |
| **Client-side routing guards** | Dashboard checks session on mount and redirects. No middleware — keeps the app fully static/client-rendered. |
| **Immutable habit updates** | `toggleHabitCompletion` returns a new object rather than mutating, preventing stale-state bugs in React. |

## Test Mapping

| Test Layer | Scope | Location |
|---|---|---|
| **Unit** | `getHabitSlug`, `validateHabitName`, `calculateCurrentStreak`, `toggleHabitCompletion`, auth utilities | `lib/*.test.ts` |
| **Integration** | LoginForm, SignupForm, HabitForm, HabitCard, SplashScreen rendering | `components/**/*.test.tsx` |
| **E2E** | Full auth flow, habit CRUD, persistence across reload, routing guards, PWA/offline | `e2e/*.spec.ts` |

Coverage target: **≥ 80%** for `lib/` (enforced via `vitest run --coverage`).

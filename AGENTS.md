<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

@AGENTS.md

This file provides guidance to Ai Agent when working with code in this repository.

## Project

Legacy Trivia frontend — the Phase 1 MVP web client for a trivia game. Pairs with the Express + MongoDB backend in a sibling folder (`legacy-trivia-backend` / `LegacyTriviaBackEnd`). The auth flow (signup → email OTP verify → game) is implemented here; the actual game is loaded inside `/game` as a Unity WebGL iframe.

## Commands

```bash
npm run dev        # Turbopack dev server on :3000
npm run build      # Production build (validates types as part of the build)
npm run start      # Run the built app
npm run lint       # ESLint via eslint-config-next
npx tsc --noEmit   # Standalone type check
```

There are no tests in this project.

## Critical Next.js 16 conventions

This is **Next.js 16**, not the version most training data assumes. Before non-trivial Next-specific work, read the relevant doc in `node_modules/next/dist/docs/` and respect deprecation notices.

- **Routing convention is `proxy.ts`, not `middleware.ts`.** The export is `export function proxy(req)`. The previous `middleware` name will log a deprecation warning.
- **`turbopack.root` is pinned** in `next.config.ts` to this project directory. Required because the parent folder (`/Asif/`) contains sibling projects without their own `node_modules`; without this pin, Turbopack walks up and fails to resolve `tailwindcss` from `app/globals.css`.
- **Tailwind v4 CSS-first config.** No `tailwind.config.js`. Theme tokens are declared in `app/globals.css` under `@theme inline { ... }` and `@import "tailwindcss";` activates the engine.
- **App Router with route group `(auth)`** for all auth pages. Pages using `useSearchParams` (login, verify-email, forgot-password/verify) must be wrapped in `<Suspense>` inside their `page.tsx` — required for static rendering, not optional.

## Architecture

### Auth state, storage, and refresh

Three coordinated pieces of state, all in `lib/`:

1. **Zustand store** (`lib/auth/store.ts`) — `user`, `accessToken`, `refreshToken`, `hydrated`. Persisted to `localStorage` under key `lt-auth`. The store **also writes a non-sensitive cookie** `lt_auth=1` (samesite=lax, secure on https) on `setSession`/`setTokens`, and clears it on `clear`. That cookie is the only thing the server-side `proxy.ts` reads — it is a presence hint, not a credential.
2. **Axios client** (`lib/api.ts`) — attaches `Bearer ${accessToken}` from the store. On `401`, a single-flight `performRefresh()` calls `/auth/refresh`, updates the store, and retries the original request. Refresh failures call `clear()` and surface the error.
3. **TanStack Query hooks** (`lib/auth/queries.ts`) — wraps every auth endpoint. Mutations that produce tokens (`useVerifyEmail`, `useLogin`, `useGoogleAuth`) call `setSession` inside the hook's `onSuccess` so token wiring happens before the component's per-call callback runs.

### Route protection — two layers

Server-side **`proxy.ts`** redirects based on the `lt_auth` cookie:

- Unauthed visit to `/game/*` → `/login?redirect=...`
- Authed visit to `/login`, `/signup`, `/verify-email`, `/forgot-password/*`, `/reset-password` → `/game`

Client-side **`components/auth/AuthGate.tsx`** (mounted via `app/game/layout.tsx`) does the real verification: waits for Zustand hydration, runs `useMe()`, and redirects to `/login` if no tokens remain after a refresh attempt. The cookie hint can be stale or forged — `AuthGate` is the source of truth.

### Post-auth navigation — hard navigation on purpose

Use `navigateAfterAuth(url)` from `lib/auth/navigate.ts` (which calls `window.location.assign`) for **any redirect that follows a sign-in/verify event** (`useGoogleSignIn`, `LoginForm` success, `VerifyEmailForm` welcome dialog).

Do **not** swap this for `router.push`. Next.js prefetches `/game` while the user is on `/login` (unauthed), and the proxy rewrites that prefetch to `/login`. Soft-navigating with `router.push("/game")` after login follows the stale cached redirect and traps the user on `/login`. The hard navigation forces a fresh request with the just-set cookie. `router.push` is fine for intermediate flows that don't change auth state (signup → verify-email, forgot → verify, verify → reset-password).

### Google Sign-In — overlay pattern

`components/auth/AuthForms.tsx > GoogleButton` renders Google's GSI button at a fixed `400×~44` inside an absolutely-positioned overlay, then applies a CSS `transform: scale(sx, sy)` so the (invisible) button's hit-box matches the custom-styled visible button exactly. A `ResizeObserver` re-fits on layout changes. GSI is initialized **once globally** via `lib/auth/google.ts` (`initGoogleSignIn` / `setGoogleCallback` / `renderGoogleButton`); each `GoogleButton` instance only registers its current callback via a stable ref to avoid the `initialize() called multiple times` warning.

For Google Sign-In to work in production, the deployed origin must be added under **Authorized JavaScript origins** for the OAuth client in Google Cloud Console. Failing this, the GSI button silently no-ops.

### Providers

`app/providers.tsx` wraps the app in `QueryClientProvider` and `<Toaster />` (react-hot-toast). The `QueryClient` is instantiated inside `useState(() => ...)` so it survives StrictMode double-mount but stays per-tab. `GoogleOAuthProvider` from `@react-oauth/google` is **not** used — Google Sign-In is wired manually through `lib/auth/google.ts` for the overlay pattern above.

## Backend contract

API base is `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5001/api`). Responses follow `{ success, message, data }`. Auth responses put tokens in `data.accessToken` / `data.refreshToken`; the refresh endpoint rotates the refresh token on each call.

The unverified-login case returns with `data: { email, requiresVerification: true }` — `LoginForm` checks for `requiresVerification` and routes to `/verify-email` instead of `/game`.

## Environment

`.env.local`:

- `NEXT_PUBLIC_API_URL` — backend base URL including `/api`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — must match the backend's `GOOGLE_CLIENT_ID` (same OAuth client)

Reading happens in `lib/env.ts`. Both vars are public; no secrets live in this app.

## Special routes & headers

`/unity/Build/*` paths get `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` via `next.config.ts > headers()`, plus `Content-Type: application/wasm` on `.wasm`. These exist for the Unity WebGL build hosted under `/public/unity/Build/`; don't widen the scope of these headers to other routes — they break embedded third-party content (including Google Sign-In).

<!-- END:nextjs-agent-rules -->

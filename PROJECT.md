# Dreamcode - Project Context

Read this first to get up to speed. It is the current-state map of the codebase.
Forward-looking work lives in `PLAN.md`. Framework warning: this is **Next.js 16**
with real breaking changes - read `node_modules/next/dist/docs/` before writing
framework code (per `AGENTS.md`). Keep this file updated at the end of each chat.

## What it is

Dreamcode is a web app for learning to program (Python and JavaScript), beginner
to advanced. The thesis: beat "tutorial hell" by having the learner write and run
real code at every step, with spaced review and an optional Socratic AI guide that
asks questions instead of giving answers. Visual identity: a dreamy neon-dusk /
night-sky theme (pastel gradients, floating cloud cutouts, glowing wordmark).

Monetization: **freemium**. The AI guide (DreamGuide) is the intended **paid**
feature; `profiles.tier` (`free`/`pro`) exists to gate it. Audience: individual
self-learners, students, beginners. Community-imported content is a later idea.

## Current status

- **Frontend: complete** as a product surface. Every screen exists, is on-theme,
  responsive, and navigable.
- **Real code execution:** Python (lessons, challenges, projects) runs real CPython
  via **Pyodide** in a Web Worker; JavaScript runs in-browser via `new Function`.
  Challenges/projects grade against real test cases.
- **Content-driven:** lessons/practice/challenges/projects are dynamic routes
  reading typed data. Today: 6 Python + 5 JS lessons, 10 practice sets, 8
  challenges, 5 gradeable projects. Two tracks, switchable via `useActiveTrack`.
- **Backend: live** (Supabase, once `.env.local` + the SQL are in place; see Setup).
  Auth (email/password + Google/GitHub OAuth), Postgres with Row-Level Security,
  and `/api/*` endpoints. When signed in, the client gamification layer
  (`profile.ts`/`srs.ts`/`track.ts`) syncs to Supabase; `localStorage` is the
  optimistic cache. Signed-out users keep working fully on localStorage.
- **Spaced repetition:** real **FSRS** scheduling (stability/difficulty/
  retrievability) in `srs.ts`, synced to the `srs_cards` table.
- **Gamification:** XP, levels (800 XP/level), daily streak, badges, journey
  gating by `completedStops`, placement quiz, sound chimes.
- **Spotify:** real Web Playback SDK + PKCE OAuth player in the nav.
- **AI guide (DreamGuide):** real Socratic hint chat, not a scripted demo. The
  model call is server-side and **provider-agnostic** (`src/lib/ai/guide.ts` +
  `/api/guide`): set `AI_PROVIDER` (gemini|openai|anthropic) + `AI_API_KEY` +
  `AI_MODEL` to switch it on; until then it shows a "not on yet" state. Signed-in
  only; 5 XP per hint. The Pro paywall is built but parked behind
  `GUIDE_REQUIRE_PRO` (off until billing ships at the end).
- **Not done:** billing/Stripe to sell Pro (and flip `GUIDE_REQUIRE_PRO`);
  TypeScript track; deeper curriculum; telemetry; accessibility/i18n.

## Run it

The Next.js app is at the **repo root** (`package.json` name is still `web`).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npx tsc --noEmit   # type check
npx eslint src     # lint (expect 0 errors; some warnings)
```

`.env.local` (copy from `.env.local.example`) holds the Supabase keys. Without it
the app runs in localStorage-only mode (auth/API no-op cleanly).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19, TypeScript |
| Styling | Tailwind v4 (`@theme inline` in `globals.css`) + inline styles |
| Fonts | Baloo 2 (display), Nunito (body), JetBrains Mono (code) via `next/font` |
| Editor | CodeMirror 6 (`@uiw/react-codemirror`) with a custom dusk theme |
| Python | Pyodide (CPython -> WASM) in a Web Worker |
| Backend | Supabase (Postgres + Auth + RLS), `@supabase/ssr`, Zod validation |
| Music | Spotify Web Playback SDK + PKCE OAuth |

## Repo map

Routes (`src/app/*/page.tsx` unless noted):
- `/` home, `/start` onboarding, `/login` `/signup` (real Supabase auth)
- `/dashboard` hub, `/lessons` catalog (track filter + completion checks)
- `/lesson/[slug]` (SSG), `/practice/[slug]`, `/challenge/[slug]`, `/project/[slug]` (dynamic, real grading)
- `/peaks` challenge library (gated), `/projects` catalog, `/journey` map, `/badges`, `/review` (FSRS), `/profile` (settings, track pills, AI toggle), `/placement` quiz
- API: `/api/{profile,progress,submissions,srs,badges}` (RLS-backed, Zod, 401 when signed out); `/api/guide` (AI hint, signed-in gated, provider-agnostic)
- Auth: `/auth/callback` (OAuth code exchange), `/auth/signout`

Components (`src/components/`): `SiteChrome` (persistent global nav in root layout,
so the Spotify player never remounts), `NavBar`, `SpotifyPlayer`, `LessonView`
(runs Python/JS by `lesson.language`, awards XP + completes the stop),
`CodeEditor`, `EditorFrame`, `DreamGuide` (real Socratic AI hint chat -> `/api/guide`,
signed-in gated, takes problem `context` + `getCode`), `FlowSteps`,
`Cloud`/`Parallax`, `SceneTopBar`, `AuthScene` (Supabase auth, falls back to demo
routing pre-config), `Wordmark`, `StreakFlame`.

Lib (`src/lib/`): `curriculum.ts` (typed `Lesson[]` + `getAdjacent` track-aware),
`data.ts` (peaks, projects, `practiceDatasets`, `challenges`), `profile.ts`
(`useUserProfile`, XP/streak/badges, localStorage + `/api/*` sync), `srs.ts` (FSRS),
`track.ts` (active track), `usePyodide.ts` (Pyodide worker hook), `sound.ts`
(Web Audio chimes), `theme.ts` (per-page gradient/cloud opacity knobs),
`supabase/{config,client,server,data}.ts` (clients + RLS data access),
`ai/guide.ts` (server-only, provider-agnostic AI hint adapters + system prompt).

Other: `src/proxy.ts` (Next 16 Proxy = renamed Middleware; refreshes the session),
`public/pyodide-worker.js`, `supabase/migrations/0001_init.sql`,
`Extra/Code-handoff/` (design source of truth), `Extra/*.pdf` (pedagogy research).

## Conventions (follow these)

- **Next 16 specifics:** Middleware is now **Proxy** (`src/proxy.ts`, exports
  `proxy`); `cookies()` is async (`await cookies()`); dynamic `params` is a Promise
  (`await params`). Confirm patterns in the bundled docs before writing.
- **Security:** runtime DB access goes through the RLS-scoped Supabase client so a
  user can only touch their own rows. Do not add an ORM on a direct connection (it
  bypasses RLS). The service-role key is server-only, never `NEXT_PUBLIC_`.
- **Voice (strict): no AI tells.** No em dashes, en dashes, single-char ellipsis,
  Unicode minus, or decorative emoji. Plain hyphens/periods/commas. Functional
  glyphs (check/cross/middot, arrows on buttons) are fine.
- **Theme knobs:** per-page gradient/cloud opacity live in `src/lib/theme.ts`,
  not the pages. Match the design handoff in `Extra/Code-handoff/` for look-and-feel.

## Supabase setup (to enable the backend in a fresh environment)

1. Create a project at supabase.com; from Project Settings -> API copy the Project
   URL, anon public key, and service_role key.
2. Copy `.env.local.example` to `.env.local` and paste those three values.
3. Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor (tables +
   RLS + auto-profile-on-signup trigger).
4. Auth -> Providers: enable Google and GitHub (add each one's client id/secret).
5. Auth -> URL Configuration: Site URL = app origin; add `${origin}/auth/callback`
   as a redirect URL (and in the Google/GitHub OAuth apps).
6. Optional: Auth -> Email, turn off "Confirm email" for instant dev signups.

## Gotchas

- Build/lint are green (`tsc` clean, `npm run build` ok, `eslint` 0 errors, a few
  warnings). Keep it that way.
- Spotify needs Premium for SDK streaming; Free accounts get the iframe embed. The
  OAuth redirect URI must match the origin exactly.
- The app must keep working signed-out: anything touching Supabase is guarded by
  `isSupabaseConfigured()` and a signed-in check.
- Product name: the app uses "dreamcode" everywhere. (If a rename to "Dreamcore"
  is ever wanted, it is a deliberate pass, not yet done.)

# Dreamcode - Project Context

Read this first to get up to speed. It is the current-state map of the codebase.
Forward-looking work lives in `PLAN.md`. Framework warning: this is **Next.js 16**
with real breaking changes - read `node_modules/next/dist/docs/` before writing
framework code (per `AGENTS.md`). Keep this file updated at the end of each chat.

## What it is

Dreamcode is a web app for learning to program, beginner to expert, across four
tracks: **Python, JavaScript, C#, and TypeScript**. The thesis: beat "tutorial hell"
by having the learner write and run real code at every step, with spaced review and
an optional Socratic AI guide that asks questions instead of giving answers. Visual
identity: a dreamy neon-dusk / night-sky theme (pastel gradients, floating cloud
cutouts, glowing wordmark, cloud-and-spark favicon at `src/app/icon.svg`).

Monetization: **freemium**. The AI guide (DreamGuide) is the intended **paid**
feature; `profiles.tier` (`free`/`pro`) exists to gate it. Audience: individual
self-learners, students, beginners. Community-imported content is a later idea.

## Current status

- **Frontend: complete** as a product surface. Every screen exists, is on-theme,
  responsive, and navigable.
- **Real code execution:** Python (lessons, challenges, projects) runs real CPython
  via **Pyodide** in a Web Worker; JavaScript runs in-browser via `new Function`.
  The lesson runner wraps Run code in an async IIFE, awaits it, and flushes
  microtasks + 0ms timers before reading console output, so async/await and
  event-loop lessons (js-async-await, js-concurrency) show the correct order.
  **TypeScript** is type-stripped server-side (`/api/transpile`, the bundled
  `typescript` package; a pure string->string transform, nothing executed on the
  server) and the emitted JS runs through that same in-browser engine - no new
  runtime service, no CDN. The route ALSO runs a real semantic type-check
  (`src/lib/tsCheck.ts`, same bundled `typescript`), so genuine type errors (wrong
  assignment, wrong argument type) now block running with a line-numbered message,
  the same as syntax errors - the TS track finally enforces types, not just strips
  them. Lenient config (no `strict`/`noImplicitAny`) so beginners are not nagged.
  Challenges/projects grade against real test cases.
- **Content-driven:** lessons/practice/challenges/projects are dynamic routes
  reading typed data. Today: 44 Python + 25 JS + 21 C# + 14 TS lessons (104 total),
  72 practice sets, 25 challenges, 5 gradeable projects, spanning beginner ->
  expert. **Four tracks** (python | javascript | csharp | typescript), switchable via
  `useActiveTrack`. `curriculum.ts` lessons carry optional `module`/`tier` fields
  with a `getModules(track)` helper (modular + tiered model). Python has 11
  modules; JavaScript has 7; C# has 6; TypeScript has 4 (TS Basics -> Unions & Enums
  -> Advanced -> Expert), every TS module ending in a graded section challenge.
  `/lessons` groups lessons into per-module sections with tier badges and `/journey`
  shows a module-header divider at each module boundary (via `getModules()`).
  **Practice datasets (complete + verified):** all 58 runnable lessons have a
  matching `PracticeDataset` (Parsons + faded + predict) in `data.ts`; every
  predict answer was executed and confirmed correct (Python via CPython, JS via
  node), and one option is marked correct per set.
- **Read + quiz lesson mode:** lessons with `runnable: false` (C#, which has no
  client-side runtime) render a read-only example plus a multiple-choice `quiz` in
  `LessonView` instead of the code editor; passing the quiz awards XP and completes
  the stop. Python/JS lessons keep the real-code editor. C# execution stays
  deferred to the server-side sandbox (PLAN.md Final).
- **Backend: live** (Supabase, once `.env.local` + the SQL are in place; see Setup).
  Auth (email/password + Google/GitHub OAuth), Postgres with Row-Level Security,
  and `/api/*` endpoints. When signed in, the client gamification layer
  (`profile.ts`/`srs.ts`/`track.ts`) syncs to Supabase; `localStorage` is the
  optimistic cache. Signed-out users keep working fully on localStorage. The full
  sync path was code-audited end to end (auth verifies the JWT via `getUser()`,
  level is derived server-side from XP, FSRS upserts have the right RLS update
  policy); `completeStop`/`unlockBadge` use idempotent (DO NOTHING) upserts. The
  live cross-device persistence test needs the owner's provisioned Supabase
  (PLAN.md item 4). `DEFAULT_PROFILE` is now a true zero-state (level 1, 0 XP, 0
  streak, no badges/stops), matching the server's fresh-signup row, so a new
  learner starts empty and a pre-sync action can never seed inflated XP. A fresh
  learner's first XP earn starts the streak at 1; the dashboard week chart is
  guarded against an all-zero week.
- **Spaced repetition:** real **FSRS** scheduling (stability/difficulty/
  retrievability) in `srs.ts`, synced to the `srs_cards` table.
- **Gamification:** XP, levels (800 XP/level), daily streak, badges, journey
  gating by `completedStops`, placement quiz, sound chimes. Each badge now has its
  own glyph + accent colour via `BadgeMedallion` (a glossy neon orb, found vs
  locked states) instead of the old 5-reused cloud images, so the `/badges` wall
  and the dashboard "YOUR SKY" preview read as ten distinct emblems. The
  per-badge `icon`/`accent` live on the `Badge` type in `data.ts`.
- **Section challenges:** each runnable module ends with a difficulty-matched,
  real-graded capstone. `moduleChallenges` (module name -> challenge slug) +
  `getModuleChallenge()` in `data.ts` drive a gold "Section challenge" node on
  `/journey` (locked until every lesson in the module is complete, then a
  clickable gold star, "cleared" once passed) and a CTA on the module's last
  lesson in `LessonView`. The challenge level matches the module tier. Every
  runnable Python, JavaScript, and TypeScript module is mapped to its own graded
  challenge in `moduleChallenges`. C# and the Python read+quiz modules keep their
  quizzes (no code challenge).
- **Telemetry (complete & verified):** an append-only `events` table
  (`supabase/migrations/0002_telemetry.sql`, RLS select/insert own) + `/api/events`
  (POST batch / GET recent, auth-gated, Zod) + `src/lib/telemetry.ts` `track(name,
  props)` (batched, sendBeacon on page hide, no-op signed-out/unconfigured).
  Called `track()` across all designated UI action points (auth, lessons, practice,
  challenges, projects, AI hints, placement, track switches, reviews) and implemented
  a gorgeous, on-theme per-user activity timeline and aggregate counts view on the
  `/profile` page. Owner must run `0002_telemetry.sql` in production.
- **Spotify:** real Web Playback SDK + PKCE OAuth player in the nav. The client ID
  comes ONLY from the server (`/api/spotify/config`, env `SPOTIFY_CLIENT_ID`); there
  is no in-app settings cog or client-ID paste form (removed) and no manual
  embed/SDK toggle. Non-Premium accounts / SDK failures fall back to the iframe embed
  automatically. The Connect button no-ops if the server has no client ID configured.
- **Onboarding + auth-aware UX:** a brand-new learner is guided from lesson 1, never
  mid-curriculum. `getNextLesson(track, completedStops)` (curriculum.ts) drives the
  guided routing; `src/components/JourneyCtas.tsx` makes the home hero/final CTAs
  auth-aware (Start free/Start here -> Continue learning once signed in) and the
  `/start` button + home "continue" card point to the real next lesson. The NavBar
  swaps "Start free" for a profile-avatar chip (-> `/profile`) once signed in. The
  `/profile` page is now auth-aware: when signed in it shows a real Sign out (a form
  POST to `/auth/signout` that clears the session); when signed out it shows a Sign
  in pill plus a guest banner (progress is local-only) instead of the old hardcoded
  "Sign out" link that wrongly appeared and only routed to `/login`.
  `src/components/GuidePath.tsx` (global via `SiteChrome`) is a dismissible coach that
  strings Learn -> Practice -> Challenge -> Build for new learners (under 6 completed
  stops) with route-aware tips + one next-step CTA, and hides on dismiss. Home
  landing stats are honest (100+ lessons / 70+ practice sets / 10 badges).
- **AI guide (DreamGuide):** real Socratic hint chat, not a scripted demo. The
  model call is server-side and **provider-agnostic** (`src/lib/ai/guide.ts` +
  `/api/guide`): set `AI_PROVIDER` (gemini|openai|anthropic) + `AI_API_KEY` +
  `AI_MODEL` to switch it on; until then it shows a "not on yet" state. Signed-in
  only; 5 XP per hint. The Pro paywall is built but parked behind
  `GUIDE_REQUIRE_PRO` (off until billing ships at the end).
- **Accessibility/SEO (complete & WCAG AA verified):** skip-to-content links and
  main landmarks exist; keyboard Escape handlers and focus trapping implemented on
  Explore dropdown, Dream Guide chat, and victory modals; aria-labels added to all
  icon-only buttons (Spotify, Dream Guide); semantic heading hierarchy (H1->H2->H3)
  restructured across 12 pages; form inputs in `/login` and `/signup` have labels
  and high-contrast neon focus rings; all meaningful images have descriptive alt texts;
  color contrasts of locked elements, copyright, theme text properties conforming to
  WCAG AA standards. Also honors reduced-motion (CSS query and Parallax `matchMedia`) and
  keyboard `:focus-visible` rings, and sets canonical tags / metadata.
- **Mobile:** audited at a 375px viewport - the key surfaces (home, dashboard,
  badges, lessons, challenge, practice, projects) have no horizontal overflow. The
  lesson top bar previously rendered one progress dot per lesson (a ~700px row that
  blew out the page on phones); it is now a compact responsive progress bar that
  scales to any lesson count and reads cleaner on desktop too. The NavBar Explore
  dropdown was right-anchored to its button, so on phones (where the button sits
  mid-nav) the panel ran off the left edge; it is now viewport-anchored
  (`position: fixed`, `right: clamp(...)`, width capped to `100vw - 24px`) so it
  always fits, on both phone and desktop. Further mobile fixes: the `/lessons`
  language selector now wraps (was `width:max-content`, which overflowed and hid
  C# / TypeScript off-screen); the NavBar fits the signed-in profile chip on phones
  (responsive wordmark via `clamp()`, the Spotify button collapses to an icon-only
  control on phones with a screen-reader label, tighter gaps); and the `/journey`
  map (a fixed 720-unit coordinate space) now scales uniformly via a measured
  `transform: scale` wrapper so the nodes no longer land off the right edge on
  phones.
- **Industry section:** `/industry` covers Python, JavaScript, and C#/.NET
  (domains, tools, roles), data in `src/lib/industry.ts`.
- **Not done (all remaining work; full detail in PLAN.md):**
  - *Owner actions (no code):* setup is DONE (domain live, `.env.local` + migrations
    in place, redirect URLs set, OAuth sign-in works end to end). Only an optional
    cross-device persistence spot-check remains (see PLAN.md item 1).
  - *Security hardening (pre-launch):* DONE this pass - report-only CSP +
    `poweredByHeader: false` (`next.config.ts`), baseline in-memory rate limiting
    (`src/lib/rateLimit.ts`) on `/api/transpile` (per-IP) + `/api/guide` (per-user),
    `/api/events` per-event props size cap. Remaining are owner follow-ups: walk the
    app with the console open then flip the CSP from report-only to enforcing; back
    the rate limiter with a durable store (Upstash/KV) for cross-instance limits; the
    postcss audit advisory waits on a patched Next (`16.2.9` is already latest).
  - *Final / deferred externals:* the AI provider key; Stripe billing (flip
    `GUIDE_REQUIRE_PRO`); a server-side code-execution sandbox so C# AND Rust can run
    (Py/JS/TS run client-side, C#/Rust cannot). The sandbox is prolonged into its own
    track with provider research (Judge0/Piston, free vs paid) in PLAN.md section 5.
  - *Backlog:* expert tracks (Gemini content), community content (needs a UGC
    code-exec sandbox), i18n (needs a locale layer), institutional/admin direction.
    (Semantic TS type-checking is now DONE - see the TypeScript note above.)

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
- `/peaks` challenge library (gated), `/projects` catalog, `/journey` (map generated dynamically from `curriculum.ts`, per active track), `/industry` (where Python/JS/C#-.NET are used in the tech industry; data in `src/lib/industry.ts`), `/badges`, `/review` (FSRS), `/profile` (settings, track pills, AI toggle), `/placement` quiz
- API: `/api/{profile,progress,submissions,srs,badges,events}` (RLS-backed, Zod, 401 when signed out); `/api/guide` (AI hint, signed-in gated, provider-agnostic); `/api/transpile` (TypeScript -> JS type-strip, public, no execution)
- Auth: `/auth/callback` (OAuth code exchange), `/auth/signout`

Components (`src/components/`): `SiteChrome` (persistent global nav in root layout,
so the Spotify player never remounts), `NavBar`, `SpotifyPlayer`, `LessonView`
(runs Python/JS by `lesson.language`, awards XP + completes the stop),
`CodeEditor`, `EditorFrame`, `BadgeMedallion` (per-badge glyph+accent orb, used by
`/badges` + dashboard), `DreamGuide` (real Socratic AI hint chat -> `/api/guide`,
signed-in gated, takes problem `context` + `getCode`), `FlowSteps`,
`Cloud`/`Parallax`, `SceneTopBar`, `AuthScene` (Supabase auth, falls back to demo
routing pre-config), `Wordmark`, `StreakFlame`, `JourneyCtas` (auth/progress-aware
home + /start CTAs), `GuidePath` (dismissible first-run Learn->Practice->Challenge->
Build coach, mounted globally in `SiteChrome`).

Lib (`src/lib/`): `curriculum.ts` (typed `Lesson[]`; `getAdjacent` + `getModules` +
`getFirstLesson`/`getNextLesson` track-aware, `getModuleChallenge`),
`data.ts` (peaks, projects, `practiceDatasets`, `challenges`), `profile.ts`
(`useUserProfile`, XP/streak/badges, localStorage + `/api/*` sync), `srs.ts` (FSRS),
`track.ts` (active track), `telemetry.ts` (batched `track()` -> `/api/events`),
`rateLimit.ts` (best-effort in-memory rate limiter for `/api/transpile` + `/api/guide`),
`tsCheck.ts` (server-side semantic TS type-checker powering `/api/transpile`),
`usePyodide.ts` (Pyodide worker hook), `sound.ts`
(Web Audio chimes), `theme.ts` (per-page gradient/cloud opacity knobs),
`supabase/{config,client,server,data}.ts` (clients + RLS data access),
`ai/guide.ts` (server-only, provider-agnostic AI hint adapters + system prompt).

Other: `src/proxy.ts` (Next 16 Proxy = renamed Middleware; refreshes the session),
`src/app/icon.svg` (brand favicon), `next.config.ts` (security headers,
report-only CSP, `poweredByHeader: false`, allowedDevOrigins),
`public/pyodide-worker.js`,
`supabase/migrations/{0001_init,0002_telemetry}.sql`,
`Extra/Code-handoff/` (design source of truth), `Extra/*.pdf` (pedagogy research),
`Extra/Gemini-tasks/` (work orders Claude wrote for Gemini: expert tracks, Rust track).

## Conventions (follow these)

- **Next 16 specifics:** Middleware is now **Proxy** (`src/proxy.ts`, exports
  `proxy`); `cookies()` is async (`await cookies()`); dynamic `params` is a Promise
  (`await params`). Confirm patterns in the bundled docs before writing.
- **Security:** runtime DB access goes through the RLS-scoped Supabase client so a
  user can only touch their own rows. Do not add an ORM on a direct connection (it
  bypasses RLS). The app uses ONLY the anon key + the user's session (no service-role
  key anywhere); never expose a service key or set it `NEXT_PUBLIC_`. All `/api/*`
  routes are auth-gated + Zod-validated (except `/api/transpile`, a no-execution
  TS->JS transform + semantic type-check, and `/api/spotify/config`, which returns
  only the PKCE-public client id). `/api/transpile` (per-IP) and `/api/guide` (per-user) are rate limited
  via `src/lib/rateLimit.ts` (best-effort in-memory; a durable Upstash/KV store is
  the cross-instance follow-up). `/api/events` caps batch size, name length, and
  per-event props size. The OAuth callback validates its `next` param to same-origin
  relative paths (no open redirect). `next.config.ts` sets baseline security headers
  (`X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`),
  drops `X-Powered-By` (`poweredByHeader: false`), and ships a **report-only** CSP
  (`Content-Security-Policy-Report-Only`). The CSP must allow `'unsafe-eval'` /
  `'unsafe-inline'` because the in-browser JS runner and Pyodide require them.
  Flipping it to enforcing is a launch follow-up (PLAN.md "Security hardening"). The code
  runners (`new Function`, Pyodide) only ever run the learner's OWN code in their OWN
  browser - first-party content only until UGC is sandboxed.
- **Voice (strict): no AI tells.** No em dashes, en dashes, single-char ellipsis,
  Unicode minus, or decorative emoji. Plain hyphens/periods/commas. Functional
  glyphs (check/cross/middot, arrows on buttons) are fine.
- **Theme knobs:** per-page gradient/cloud opacity live in `src/lib/theme.ts`,
  not the pages. Match the design handoff in `Extra/Code-handoff/` for look-and-feel.

## Supabase setup (to enable the backend in a fresh environment)

1. Create a project at supabase.com; from Project Settings -> API copy the Project
   URL, anon public key, and service_role key.
2. Copy `.env.local.example` to `.env.local` and paste those three values. Set
   `NEXT_PUBLIC_SITE_URL` (prod `https://dreamcoder.dev`, dev `http://localhost:3000`).
3. Run `supabase/migrations/0001_init.sql` then `0002_telemetry.sql` in the
   Supabase SQL editor (tables + RLS + auto-profile-on-signup trigger; events).
4. Auth -> Providers: enable Google and GitHub (add each one's client id/secret).
5. Auth -> URL Configuration: Site URL = `https://dreamcoder.dev`. Add BOTH
   `https://dreamcoder.dev/auth/callback` and `http://localhost:3000/auth/callback`
   as redirect URLs (and add the same callback URLs in the Google and GitHub OAuth
   apps). Redirects use the live browser origin, so they follow whatever domain
   the app is served from.
6. Optional: Auth -> Email, turn off "Confirm email" for instant dev signups.

### Custom domain (dreamcoder.dev)
The product name stays **dreamcode**; `dreamcoder.dev` is just the web address.
In code, the site URL is env-driven (`NEXT_PUBLIC_SITE_URL` -> `metadataBase` /
Open Graph in `src/app/layout.tsx`), and all auth + Spotify redirects use the live
origin, so they work on the domain with no code change. Owner action in external
dashboards (add the domain ALONGSIDE localhost, do not remove localhost):
Supabase Auth (step 5 above), the Google + GitHub OAuth apps, and the Spotify app
(add `https://dreamcoder.dev` as a Redirect URI - exact origin, no trailing slash).

## Gotchas

- Build/lint are green (`tsc` clean, `npm run build` ok, `eslint` 0 errors, a few
  warnings). Keep it that way.
- `npm audit` reports 2 MODERATE issues from `postcss` bundled inside Next (CSS
  stringify XSS); the audit "fix" downgrades Next, so do NOT run `--force` - clear it
  by bumping Next when a patched release ships. Low real-world risk (no untrusted CSS).
- Spotify needs Premium for SDK streaming; Free accounts get the iframe embed. The
  OAuth redirect URI must match the origin exactly.
- The app must keep working signed-out: anything touching Supabase is guarded by
  `isSupabaseConfigured()` and a signed-in check.
- Product name: the app uses "dreamcode" everywhere. (If a rename to "Dreamcore"
  is ever wanted, it is a deliberate pass, not yet done.)

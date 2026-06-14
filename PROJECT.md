# Dreamcode - Project Context

This file is the single place a new contributor or coding agent should read first
to get up to speed on Dreamcode. It covers what the project is, how it is built,
where everything lives, the conventions to follow, what is done versus not done,
and the recommended next steps.

For the deeper product strategy and pedagogy research, see `PLAN.md`.
For the framework warning, see `AGENTS.md` (this is Next.js 16 with real breaking
changes; read `node_modules/next/dist/docs/` before writing framework code).

---

## 1. What Dreamcode is

Dreamcode is a web platform for learning to program, aimed at the full range from
absolute beginner to expert. It starts with Python and will add JavaScript and
TypeScript. The product thesis is that most learners fail not from bad content but
from "tutorial hell" (passively copying an instructor and never building
independent skill). Dreamcode is designed against that: the learner writes code at
every step, concepts come back as spaced reviews, and an optional AI mentor only
ever asks guiding questions instead of handing over answers.

The visual identity is a dreamy, night-sky / neon-dusk theme: pastel gradients,
floating cloud cutouts, and a glowing "dreamcode" wordmark.

---

## 2. Current status (read this)

- **Phase:** Frontend only. There is no backend, no database, and no real auth.
- **What exists:** The complete page-and-flow skeleton and design system for the
  whole app, one fully worked vertical slice of the learning loop (the "Loops"
  lesson), and a real, working Spotify player integrated into the nav bar.
- **What is mocked:** All learner data (progress, XP, streaks, badges, the
  curriculum) lives in `src/lib/data.ts`. Python "execution" in the lesson is a
  small pattern matcher, not a real interpreter. Login and signup are UI only and
  just route into the app.
- **What is real:** The JavaScript challenge runner actually executes the
  learner's code in the browser and grades it against tests. The Spotify
  integration is a real Spotify Web Playback SDK player with PKCE OAuth.

So: the frontend design and structure are essentially complete as a prototype, but
it is a one-lesson prototype. Turning it into a usable product needs real code
execution, a content-driven curriculum, and a backend (see Section 10 and 11).

---

## 3. How to run it

The Next.js app lives at the **repository root** (it was originally scaffolded in a
`web/` subfolder and later moved up; `package.json` is still named `web`).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npx tsc --noEmit   # type check
npx eslint src     # lint
```

There is no `.env` file and none is required to run the app. The Spotify Client ID
is entered by the user at runtime through the player's Settings form (Section 8),
not through environment variables.

---

## 4. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19, TypeScript |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) plus inline styles |
| Fonts | Baloo 2 (display), Nunito (body), JetBrains Mono (code), via `next/font` |
| Code editor | CodeMirror 6 (`@uiw/react-codemirror`, `@codemirror/lang-python`, `@codemirror/lang-javascript`) with a custom dusk theme |
| Music | Spotify Web Playback SDK + PKCE OAuth (client side, no secret) |
| Data | Mock objects in `src/lib/data.ts` (no DB yet) |

Note on Tailwind v4: theme tokens are declared in `@theme inline { ... }` inside
`src/app/globals.css`, not in a `tailwind.config.js`. Much of the UI uses inline
`style={{ ... }}` objects for precise control of the gradients, glows, and glass
effects, with Tailwind utilities used for layout and responsive breakpoints.

---

## 5. Repo structure and where things live

```
dreamcode/
  PROJECT.md            <- this file
  PLAN.md               <- product strategy + pedagogy research
  AGENTS.md             <- Next.js 16 breaking-changes warning (auto-loaded)
  CLAUDE.md             <- imports AGENTS.md
  README.md             <- short frontend readme (slightly dated re: Spotify)
  next.config.ts        <- allowedDevOrigins for LAN testing
  Extra/
    Code-handoff/       <- the original Claude Design HTML handoff (source of truth for visuals)
    Coding Platform Research Strategy.pdf   <- the user's pedagogy/eng research
  public/assets/        <- backgrounds + cloud cutouts (recompressed, ~2.6 MB total)
  src/
    app/                <- routes (App Router)
    components/         <- shared UI
    lib/                <- data + theme + spotify auth
```

### Routes (`src/app/*/page.tsx`)

| Route | Purpose |
|---|---|
| `/` | Home: neon-dusk hero plus a scrollable marketing story and footer |
| `/start` | First-run onboarding: the 4-step path with one clear primary action |
| `/login`, `/signup` | Auth UI (mock; routes into the app). Signup goes to `/start` |
| `/dashboard` | Logged-in hub: "Your path" tracker, continue card, reviews due, XP, badges |
| `/lessons` | Lesson catalog ("stops") |
| `/lesson/loops` | The one fully built lesson: teaching card + live CodeMirror editor |
| `/practice/loops` | PRIMM practice flow: Predict (MCQ) -> Parsons puzzle -> faded example |
| `/challenge/cloud-hopper` | Challenge with a real in-browser JS test runner + badge reward |
| `/peaks` | Problem library (standalone challenges) |
| `/projects` | Projects in Guided / Independent / Capstone tiers |
| `/journey` | The node map (chapter path) with a gameplay HUD |
| `/badges` | Badge collection (found + locked) |
| `/review` | Spaced-recall review session |
| `/profile` | Profile + settings, including the AI mentor opt-in toggle |

Routes are currently hardcoded to single slugs (`loops`, `cloud-hopper`). A real
curriculum needs dynamic routes (`/lesson/[slug]`, etc.) driven by a content
schema. This does not exist yet.

### Components (`src/components/`)

| File | Role |
|---|---|
| `SiteChrome.tsx` | Client wrapper in the root layout. Renders the global nav on every page except `/login`, `/signup`, `/start`, and adds the top spacer so content clears the fixed nav. |
| `NavBar.tsx` | The persistent global nav: flush-left wordmark, primary links, an "Explore" hover/tap dropdown (the full destination list), the Spotify player, and "Start free". Transparent over the home hero, solid elsewhere. Responsive. |
| `SpotifyPlayer.tsx` | The Spotify integration (Section 8). Large file. |
| `Wordmark.tsx` | The glowing "dreamcode" logo (links home). |
| `FlowSteps.tsx` | The reusable Learn -> Practice -> Challenge -> Build tracker used on `/start` and the dashboard. |
| `DreamGuide.tsx` | The opt-in Socratic AI mentor widget (scripted demo of a 5-phase hint flow; asks questions, never gives code). |
| `Cloud.tsx` | A drifting cloud cutout: parallax + float animation + per-page opacity scale + optional magenta/cyan neon glow. |
| `Parallax.tsx` | One shared scroll listener that drives every cloud (perf). |
| `CodeEditor.tsx` | CodeMirror 6 with the custom dusk theme. |
| `EditorFrame.tsx` | The dusk "editor window" chrome (traffic lights, filename, language pill) and the console panel. |
| `SceneTopBar.tsx` | The sub-page back/action bar (no longer carries the brand; the global nav does). |
| `StreakFlame.tsx` | The small flame icon used in streak chips. |
| `AuthScene.tsx` | Shared login/signup scene. |

### Lib (`src/lib/`)

| File | Role |
|---|---|
| `data.ts` | All mock content and user state (lessons, peaks, projects, badges, review cards, the Parsons/faded/predict exercises, the demo user). This is the stand-in for the future backend + curriculum. |
| `theme.ts` | The theme control panel: per-page gradient opacity, a global cloud-opacity boost, and per-page cloud opacity. Tweak these to retune any page. |
| `spotifyAuth.ts` | Spotify PKCE OAuth: code verifier/challenge, redirect, token exchange/refresh, safe localStorage wrappers, and a pure-JS SHA-256 fallback for insecure (HTTP/IP) contexts. |

---

## 6. The learning loop (PRIMM) and how routes map to it

The pedagogy centers on PRIMM (Predict, Run, Investigate, Modify, Make) plus spaced
review. The product expresses this as a simple, repeatable chain that new users see
on `/start` and the dashboard:

```
Learn  ->  Practice  ->  Challenge  ->  Build
/lesson    /practice     /challenge     /projects
```

- **Learn** (`/lesson/loops`): a short teaching card next to a runnable editor.
- **Practice** (`/practice/loops`): predict the output (MCQ), assemble a Parsons
  puzzle, then fill a faded example. Reading before writing; scaffolding fades.
- **Challenge** (`/challenge/cloud-hopper`): a real problem graded by hidden tests.
- **Build** (`/projects`): apply it in a small project.
- **Review** (`/review`): concepts resurface later as spaced-recall cards.

`FlowSteps.tsx` renders this chain with a "you are here" marker so a first-time user
is never lost.

---

## 7. Design system and conventions

### Theme knobs (`src/lib/theme.ts`)
- `gradientOpacity.<page>`: how strongly the pastel gradient covers each page's
  background photo (0 = photo visible, 1 = solid gradient).
- `cloudOpacityBoost`: global multiplier for every floating cloud.
- `cloudOpacity.<page>`: per-page cloud visibility on top of the boost. On `/`
  this only affects the scrollable story clouds, not the hero clouds.

### Shared CSS utilities (`src/app/globals.css`)
- Keyframes: `floaty`, `floatySm`, `pulseRing`, `blinkCursor`, `neonFlicker`,
  `popIn`, `eqbar`.
- Glow/text: `neon-title`, `neon-wordmark`, `neon-outline`, `glow-heading`,
  `sky-text`, `glow-hover`.
- Clouds: `cloud-glow` (soft), `cloud-neon-magenta`, `cloud-neon-cyan` (bright
  neon outlines; applied to some clouds, not all).
- Glass: `glass`, `glass-strong`.
- Layout var: `--nav-h` (nav height; 66px desktop, 60px mobile).

### Navigation architecture (important)
The global nav lives in the **root layout** via `SiteChrome`, so it never remounts
on client navigation. That is deliberate: it keeps the nav persistent and, crucially,
keeps the Spotify player mounted so music keeps playing as the user moves between
pages. Because the nav is `position: fixed`, non-home pages get a `--nav-h` top
spacer, and page sub-bars that used to be `top: 0` now stick at `top: var(--nav-h)`
so they sit just under the global nav.

### Responsiveness
Nav and footer use `clamp(...)` gutters and Tailwind breakpoints. The nav collapses
its inline links into the Explore dropdown on small screens and stays a single row.
The footer stacks to a centered column on mobile and a row on desktop. Test at
375px and at wide widths (1680px+); the wordmark should hug the left gutter and the
actions the right gutter at any width.

### Writing/voice convention (please keep)
The user explicitly does not want "AI tells" in any copy. Do not use em dashes,
en dashes, the single-character ellipsis, the Unicode minus, or decorative emoji
(no sparkles, snakes, clouds, locks, etc.). Use plain hyphens, periods, and
commas. Functional UI glyphs are fine: check and cross marks for pass/fail, the
middot separator, and arrows on buttons. Keep marketing copy plain and human.

---

## 8. The Spotify integration

A real, working integration, not a mockup. It lives in `src/components/SpotifyPlayer.tsx`
(large) and `src/lib/spotifyAuth.ts`.

- **Auth:** PKCE OAuth, fully client side (no client secret). On connect it
  redirects to Spotify, then exchanges the returned code for tokens and stores
  them in localStorage. Tokens auto-refresh.
- **Playback:** For Spotify Premium accounts it loads the Web Playback SDK
  (`https://sdk.scdn.co/spotify-player.js`), registers a "Dreamcode Player"
  device, transfers playback to it, and controls play/pause, seek, shuffle,
  repeat, and device selection through the Spotify Web API. Free accounts fall
  back to the standard Spotify iframe embed.
- **Setup (per user/dev):** There is no env var. Each user opens the player's
  Settings form and pastes their own Spotify app **Client ID**. To create one:
  make an app at developer.spotify.com, and add a redirect URI equal to the app
  origin (for local dev, `http://127.0.0.1:3000` or `http://localhost:3000`).
  `next.config.ts` lists `allowedDevOrigins` so a phone on the LAN can test too.
- **Customization:** the connect button has several visual styles (Dreamcode
  Wood, Glassy Lavender, Neon Cyan, Floating Cloud), the active playlist is
  configurable, and an embed-fallback toggle exists. All persisted in localStorage
  under `dc_spotify_*` keys.

A fully managed "log in with Spotify" experience for every visitor would need a
backend to hold a shared app registration; today each user supplies their own
Client ID, which is the correct client-only approach.

---

## 9. Code execution and the AI mentor

- **JavaScript challenge** (`/challenge/cloud-hopper`): the learner's code really
  runs via `new Function(...)` in the browser and is graded against test cases.
  This is fine for a prototype; the plan calls for a sandboxed worker later.
- **Python lesson** (`/lesson/loops`): "Run" uses `pretendRun`, a small pattern
  matcher that understands the lesson's print-over-a-list shape. It is not a real
  interpreter. The plan calls for Pyodide / MicroPython-WASM here.
- **DreamGuide** (the AI mentor): currently a scripted, on-rails demonstration of
  the 5-phase Socratic flow. It is intentionally not wired to a real model yet;
  the plan is to back it with the Claude API as an opt-in, hint-only tutor.

---

## 10. What is done versus not done (frontend)

Done:
- Every screen in the plan exists, is on theme, responsive, and navigable.
- The full Learn -> Practice -> Challenge -> Build -> Review loop is demonstrated
  on one Python topic (loops), including Parsons and faded exercises.
- Persistent global nav, onboarding flow, dashboard, gamification surfaces.
- Real Spotify player. Real JS challenge grading. Image assets optimized.

Not done (frontend):
- Real Python execution (Pyodide / MicroPython).
- A content schema and dynamic routing so the curriculum is data-driven rather
  than one hardcoded slug per page.
- Actual curriculum content beyond the single loops example.
- The JavaScript/TypeScript track (only surfaced as "coming soon").
- A placement assessment page (linked from profile, not built).
- Accessibility and internationalization passes.

Not started (needs backend):
- Real accounts/auth, saved progress, streaks, XP, badges.
- FSRS spaced-repetition scheduling on real data.
- Telemetry (time-to-first-success, drop-off, etc.).
- AI tutor wired to the Claude API.
- Server-side code sandbox for advanced/multi-file work.

---

## 11. Recommended next steps

Suggested order, smallest-risk-first, to turn the prototype into a real MVP:

1. **Make the loop real and content-driven (frontend).**
   - Integrate Pyodide (full Python) and/or MicroPython-WASM (fast drills) in a
     Web Worker, replacing `pretendRun`.
   - Define a curriculum content schema (lesson + typed exercises + hidden tests +
     graded hints) and convert the pages to dynamic routes that read it.
   - Author the first real Python course's worth of content.

2. **Stand up the backend.**
   - Postgres (Supabase or Neon), real auth (Auth.js or Clerk), and persistence
     for progress, streaks, XP, and submissions.
   - Implement FSRS scheduling against real review data.

3. **Fill out the experience.**
   - The JavaScript/TypeScript track and projects grading.
   - The placement assessment.
   - Wire DreamGuide to the Claude API (opt-in, hint-only, XP-costed).
   - Telemetry and the analytics-driven mitigation loop.

See `PLAN.md` for the full phased roadmap and the research behind each decision.

---

## 12. Known issues and gotchas

- **`.claude/launch.json` is stale.** Its `cwd` still points to `web`, which no
  longer exists after the move to the repo root. Update it to the root (or remove
  the `cwd`) before relying on the preview/dev-server tooling.
- **`package.json` name is still `web`** and `README.md` still says "frontend
  only"; both predate the Spotify work and the folder move. Cosmetic.
- **Next.js 16 is not the Next.js in your training data.** Read
  `node_modules/next/dist/docs/` before writing framework code (per `AGENTS.md`).
- **Spotify needs Premium** for in-browser SDK streaming; Free accounts get the
  iframe embed. The redirect URI in the Spotify dashboard must exactly match the
  origin you load the app from.
- **Visuals come from the design handoff** in `Extra/Code-handoff/`. When changing
  look-and-feel, match that source rather than inventing new styling.
- The pastel gradient overlay sits at non-trivial opacity per page; if a
  background photo looks hidden or too bare, the dial is `gradientOpacity` in
  `src/lib/theme.ts`, not the page.

# Dreamcode - Project Context

Read this first. It is the current-state map of the codebase; forward work lives in
`PLAN.md`. Framework warning: this is **Next.js 16** with real breaking changes.
Read the guide in `node_modules/next/dist/docs/` before writing framework code (per
`AGENTS.md`). Keep this file current when the architecture changes.

## What it is

Dreamcode teaches programming, beginner to expert, across **Python, JavaScript,
TypeScript and C#**. The thesis: beat tutorial hell by making the learner write and
run real code at every step, then bring ideas back with spaced review. An optional
Socratic AI guide asks questions instead of handing out answers. Visual identity: a
dreamy sky with floating cloud cutouts, in two appearances (Sunset Arcade light,
Midnight Focus dark).

Monetization is freemium: the AI guide is the intended paid feature
(`profiles.tier` = `free` | `pro`, gate parked behind `GUIDE_REQUIRE_PRO`).

## Learning model

Each track is a road of chapters (modules). A chapter is a run of lessons, capped by
a graded **section challenge**. Each runnable lesson follows the same loop:

1. **Read** the idea, a worked example and "how it reads" notes.
2. **Run** the example in the editor, change it, run again.
3. **Your turn**: a small task checked against the learner's code (required
   patterns) and output (expected lines). After two attempts a solution can be shown.
4. **Practice** (when the lesson has one): predict the output, arrange lines
   (Parsons), then fill the gaps. Passing it completes the lesson.
5. Common mistakes and "go deeper" sections for learners who want more.

C# lessons, the Python web overviews, and the plotting and machine-learning
introductions are **read + quiz**:
passing the quiz completes the stop. Quiz, predict and placement options are shown
in a stable shuffled order (`src/lib/optionOrder.ts`) so the answer is never always
in the same place.

Beyond lessons: **Problem Peaks** (standalone challenges, unlocked by a named lesson),
**Projects** (Guided, Independent and Capstone builds with steps, hints and a test
suite), **Night review** (FSRS cards from completed lessons, plus a chapter-review
mode at chapter ends), and a **placement check** per track that recommends a starting
lesson without marking anything complete.

### Badges, ranks and the leaderboard

XP is the single score. Lessons pay 15, practice 20, review 20, placement 50, and
challenges and projects pay what they are worth. 800 XP is a level, and levels carry
a **rank** (`src/lib/ranks.ts`): Stargazer, Cloudwalker, Skyfarer, Stormrider,
Constellation, Aurora, Celestial. A rank is the title a learner wears.

**36 badges** (8 common, 12 rare, 9 epic, 7 legendary; 4 of them secret) are earned
**by rule from the learner's whole history**, never handed out per activity. A badge
pays bonus XP by rarity (25 / 75 / 200 / 600), so the rare ones move the leaderboard.
Rarity is a promise and has to stay honest: common is the first hour, rare is a week
of work or a habit, epic is a chapter or a month of days, legendary is a whole track.

A rule is data (`src/content/badges.ts`), and every condition it states must hold:

| Condition | Asks |
|---|---|
| `keys` | a set of activities, `any` (topic badges) or `all` (track mastery) |
| `count` | how many lessons, drills, peaks, projects or reviews are done, optionally in one track or tier |
| `streak` | consecutive active days |
| `hour` | a lesson finished inside a local hour window |
| `dayCount` | activities finished in one local day |
| `perfectWeek` | XP on all seven days of a week |
| `tracksWithProject` | projects finished in that many languages |
| `comebackDays` | returned and finished something after that many days away |
| `submission` | a graded run that failed, failed then passed, or passed first time |

The same rule shape is evaluated in two places, and they must agree:
`src/lib/badges.ts` for the browser (guests, and optimistic feedback), and
`badge_rule_met` in Postgres for the truth. The SQL never reads content: the
generator expands each key rule into `badge_requirements` rows and writes the rest
of the rule as jsonb into `badge_catalog`, alongside `activity_meta` (what every
activity key is). `npm run seed:rewards` regenerates all of it.

**Identity.** A learner may claim a **handle** (lowercase, 3 to 20 characters,
unique, with impersonating names reserved) and wear any badge they have earned as an
**emblem**. Both go through `SECURITY DEFINER` functions: the learner has no write
privilege on those columns, and the server checks that an emblem is a badge they
actually own.

**Leaderboard** (`/leaderboard`, `leaderboard()` and `leaderboard_standing()`):
a weekly board that resets every Monday and an all-time board, toggled in the UI.
Only handle, emblem, level, XP, streak and badge count ever leave a profile row, and
only for learners who claimed a handle and have not hidden themselves. Names and
emails never appear. A learner outside the visible rows still sees their own standing.

**Habit mechanics.** A daily XP goal ring on the dashboard, a streak-at-risk nudge
after 18:00 local when nothing has been earned that day, badge progress bars
("7 of 10 lessons"), the three closest badges with a concrete next step, a global
unlock toast (`BadgeToast`, rarest first) with its rarity and bonus, and the
Return Flight badge for coming back after a week away.

### Content inventory

| Track | Lessons | Chapters | Tasks | Challenges | Projects | Placement Qs |
|---|---|---|---|---|---|---|
| Python | 77 | 13 | 70 | 14 | 7 | 16 |
| JavaScript | 48 | 9 | 47 | 12 | 5 | 16 |
| TypeScript | 26 | 4 | 26 | 7 | 3 | 11 |
| C# | 21 | 6 | read + quiz | - | - | 9 |

Every one of the 143 runnable lessons has a practice set. 22 chapters end in a
section challenge (`moduleChallenges` in `src/content/challenges.ts`). JavaScript's
Web APIs chapter has three DOM lessons that run against a live page, and the Python
data science chapter runs real NumPy and pandas.

## Architecture

### Content (`src/content/`)

Typed data, no UI. `types.ts` defines `Lesson`, `LessonTask`, `PracticeDataset`,
`Challenge`, `Project`, `Badge` and friends.

- `lessons/<track>[-more|-advanced].ts` hold lessons; `order` sets position within a
  track and `module` names the chapter.
- `practice/<track>*.ts` hold practice sets, keyed by the lesson's `practiceSlug`.
- `challenges.ts` (challenges + `moduleChallenges`), `projects.ts`, `badges.ts`,
  `placement.ts` (question banks per track, in curriculum order).
- `code.ts` exports the `code` template tag: use it for any code that contains
  backslashes or `${`, so what the learner sees is exactly what runs.

### Curriculum and catalog

- `src/lib/curriculum.ts` stitches the lesson files together (server only: it carries
  every lesson body). Ordering helpers: `getAdjacent`, `getModules`, `getNextLesson`.
- `src/lib/data.ts` re-exports practice, challenges, projects and badges.
- `src/lib/catalog.server.ts` builds a lightweight **catalog** (titles, order,
  modules, requirements, no lesson bodies). The root layout passes it to
  `CatalogProvider`, and client components read it with `useCatalog()`. Helpers in
  `src/lib/catalog.ts` (`lessonState`, `moduleComplete`, `challengeUnlocked`,
  `projectUnlocked`, `nextLessonFor`) are client safe. This keeps lesson bodies out
  of every page's JavaScript.
- `src/lib/rewards.ts` maps an activity key to XP. `src/lib/badges.ts` evaluates
  badge rules, `src/lib/activityMeta.ts` says what each key is, and
  `src/lib/ranks.ts` turns XP into levels, ranks and per-track skill. The same
  modules generate `supabase/seed/activity_rewards.sql` and
  `supabase/seed/badge_catalog.sql`.

Activity keys: a lesson slug, `practice:<slug>`, a challenge slug, a project id,
`placement:<track>`, `review:<yyyy-mm-dd>:<track>`.

### Runners and grading

- **Python**: `public/pyodide-worker.js` + `src/lib/usePyodide.ts`. Pyodide 0.29
  (Python 3.13) from jsDelivr, loaded only on Python pages. `input()` reads lines from
  the input box and echoes prompt and value. Tracebacks are trimmed to the learner's
  own lines (`src/lib/pythonErrors.ts`). Content can declare `packages` (numpy,
  pandas): the worker fetches them before the run, once per session, and the console
  says so while it waits.
- **JavaScript**: `public/javascript-worker.js` + `src/lib/javascriptRunner.ts`. A
  fresh worker per run, 5 second limit, Node-style `console` formatting, waits for
  pending timers, reports the learner's line for errors.
- **TypeScript**: `/api/transpile` type-checks with the bundled compiler
  (`src/lib/tsCheck.ts`, lenient options, ES2022 lib) and returns JavaScript, which
  then runs in the JavaScript worker. Type errors block the run with line numbers.
- **DOM lessons**: `src/components/DomPreview.tsx` + `src/lib/domPreview.ts`. The
  lesson page runs in a `sandbox="allow-scripts"` iframe (opaque origin). The server
  injects a loop guard (`src/lib/loopGuard.ts`) and console output comes back over
  `postMessage` with a per-run token.
- `src/lib/useCodeRunner.ts` gives lessons and practice one `run()` for every
  language. `src/lib/lessonTask.ts` checks "Your turn" tasks.
- `src/lib/grader.ts` grades challenges and projects for all three languages:
  key-order-free deep equality with float tolerance, per-test expected and actual
  values, and errors with line numbers.

### Progress, rewards and data

- `src/lib/profile.ts` is the client progress layer. Guests keep everything in
  `localStorage`. `completeActivity(key)` is idempotent and returns what was earned.
  Signed-in learners sync through `/api/complete-activity`; the server is the source
  of truth. When a guest signs in with local progress, `GuestMergePrompt` offers to
  bring it into the account. Signing out resets the cache to a guest profile.
- Supabase (`src/lib/supabase/*`): runtime access uses the anon key plus the
  learner's session. Migration `0003_progress_integrity.sql` revokes direct writes
  to XP, tier, completions and badges, and `0004_badges_leaderboard.sql` does the
  same for handle, emblem, leaderboard visibility and the week totals. All awards go
  through `SECURITY DEFINER` functions: `award_activities` (validates keys against
  `activity_rewards`, inserts completions, adds XP, updates streak, day and week
  totals, evaluates every badge rule and pays their rarity bonus, in one
  transaction), `record_submission` (same, for graded runs), `spend_xp` (can only
  subtract), `set_handle` / `set_emblem` / `set_leaderboard_hidden`, and the two
  leaderboard readers.
- API routes (`src/app/api/`): `complete-activity`, `profile` (name, whitelisted
  settings, handle, emblem and leaderboard visibility), `leaderboard` (public, reads
  the board and the caller's standing), `spend-xp`, `submissions`, `srs`, `events`,
  `guide`, `transpile`, `spotify/config`. All are Zod-validated. `complete-activity`, `submissions`,
  `guide` and `transpile` are rate limited (`src/lib/rateLimit.ts`, in-memory).
- Spaced review: `src/lib/srs.ts` (FSRS), cards from `src/lib/review.ts` (one per
  lesson, from its predict question, first quiz question or key idea).
- Telemetry: `src/lib/telemetry.ts` batches `track()` events to `/api/events`.

### UI and design system

The design system lives in `src/app/globals.css`: colour tokens for both
appearances (`--dc-*`) and component classes. Use these instead of one-off styles.

Text sits on one of three grounds, and each has a rule. **Paper** (`--dc-paper-bg`)
carries ink. **Glass** is a dusk tint in both appearances, dark enough that white
text on it keeps its contrast over the bright bottom of the sunset. The **sky**
itself is a fixed gradient plus a fixed scrim (`--dc-sky-scrim`, painted by
`.dc-scene::before`), which holds contrast up without flattening the gradient.
Never fade a whole card to show a disabled state; use `dc-locked`.

- Surfaces: `dc-scene` (page sky), `dc-bar` (sticky flow bar), `dc-glass` (on the
  sky), `dc-paper` (reading surface), `dc-inset`, `dc-code`, `dc-callout--info |
  success | warn | danger`.
- Controls: `dc-btn` with `--primary | secondary | light | run | gold | quiet` and
  `--sm | --lg | --block`; `dc-pill`; `dc-segmented`; `dc-option[data-state]` for
  answers; `dc-input`, `dc-search`.
- Labels: `dc-chip` (`--mint | butter | pink | lavender | glass | solid | lg`),
  `dc-tier[data-tier]`, `dc-progress`, `dc-locked` (a card for something not yet
  unlocked: dashed and flat, never faded, since fading drags labels under the
  contrast floor).
- Type: `dc-kicker`, `dc-title`, `dc-lede`, `dc-section-title`, `dc-prose`,
  `dc-inline-code`. Code never uses font ligatures.

Shared components in `src/components/ui/`: `Scene` (sky + cloud preset), `FlowBar`,
`PageHeader`, `TopLine`, `TrackPicker`, `RichText` (`**bold**` and `` `code` ``),
`Prose` (paragraphs, lists, fenced code). Page-level views live in
`src/components/{catalog,dashboard,journey,practice,code-task,review,profile,placement}`.
`SiteChrome` mounts the nav, footer, guide path, guest merge prompt and appearance
controller once in the root layout. Theme knobs per page are in `src/lib/theme.ts`.

Note: the `dc-*` classes are unlayered CSS, so they beat Tailwind utilities. Do not
put a responsive display utility (`hidden sm:flex`) on an element that also has a
`dc-*` class that sets `display`; wrap it instead.

## Routes

- `/` home, `/start`, `/login`, `/signup`, `/auth/callback`, `/auth/signout`
- `/dashboard`, `/lessons`, `/journey`, `/peaks`, `/projects`, `/badges`,
  `/leaderboard`, `/profile`, `/placement`, `/industry` (Python, JavaScript,
  TypeScript, C#/.NET), `/review` (`?lesson=<slug>` for chapter review)
- `/lesson/[slug]`, `/practice/[slug]`, `/challenge/[slug]`, `/project/[slug]` are
  statically generated (`dynamicParams = false`)
- `sitemap.xml`, `robots.txt`, `opengraph-image`, branded `error` and `not-found`

`src/proxy.ts` (Next 16's renamed Middleware) refreshes the Supabase session. Its
matcher skips static assets, the worker scripts and `/api/transpile`.

## Tests and CI

- `npm test` runs `scripts/verify-content.mjs` (see README). Reference solutions are
  in `scripts/fixtures/solutions/<id>.<py|js|ts>`; every challenge and project needs
  one, and the unchanged starter must not pass.
- `npm run test:db` runs `scripts/test-db.mjs`: every migration plus both seeds on
  PGlite, then 36 checks as real `authenticated` and `anon` roles. It covers what a
  learner may not write (tier, XP, handle, emblem, completions, badges, the
  catalogues), idempotent awards, every kind of badge rule and its bonus XP, handle
  validation and reservation, emblem ownership, and that the leaderboard shows only
  opted-in handles and never a name.
- `npm run test:e2e` runs Playwright (`e2e/`, `playwright.config.ts`) against a
  production build: every hub page on desktop and a Pixel 7 profile (status, no
  console errors, no horizontal overflow), nav menus, each runtime end to end,
  an axe-core audit (`a11y.spec.ts`), and a contrast audit (`contrast.spec.ts`).
  The contrast spec reads the sky and scrim tokens from the live page and
  rebuilds the colour painted behind every piece of text, because axe cannot
  resolve a gradient background. Both appearances are checked.
- CI (`.github/workflows/ci.yml`): typecheck, lint, content, database, build, e2e.

## Conventions

- **Next 16:** Proxy not Middleware; `cookies()`, `params` and `searchParams` are
  Promises; `error.tsx` receives `unstable_retry`. Check the bundled docs first.
- **Security:** never add a service-role key or an ORM on a direct connection; keep
  secrets out of `NEXT_PUBLIC_*`. The CSP ships report-only (`ENFORCE_CSP` in
  `next.config.ts`) and must keep `'unsafe-eval'` and `'unsafe-inline'` for the
  runners. Learner code only ever runs in the learner's own browser.
- **Voice (strict):** no em dashes, en dashes, single-character ellipsis, Unicode
  minus or decorative emoji in user-facing copy. The content test enforces this.
- **Content changes:** add a reference solution for new challenges and projects, run
  `npm test`, then `npm run seed:rewards` and commit both regenerated seeds.
- **Badges:** ids are what a learner owns, so never rename or reuse one. A new rule
  condition has to land in three places at once: the `BadgeRule` type, the evaluator
  in `src/lib/badges.ts`, and `badge_rule_met` in a migration, with a check in
  `scripts/test-db.mjs` proving the two agree.

## Supabase setup

1. Create a project; copy the Project URL and anon key into `.env.local`.
2. Run every file in `supabase/migrations/` in order, then both seeds:
   `supabase/seed/activity_rewards.sql` and `supabase/seed/badge_catalog.sql`.
   Re-run both seeds whenever the course content or the badge list changes
   (`npm run seed:rewards` regenerates them).
3. Auth providers: email, Google, GitHub. Site URL `https://dreamcoder.dev`;
   redirect URLs `https://dreamcoder.dev/auth/callback` and
   `http://localhost:3000/auth/callback` (and the same in the OAuth apps).
4. Optional: turn off email confirmation for development.

The product name is **dreamcode**; `dreamcoder.dev` is only the address. The site URL
is env-driven (`NEXT_PUBLIC_SITE_URL`) and redirects follow the live origin.

## Gotchas

- `npm audit` reports a moderate PostCSS advisory bundled inside Next. Do not run
  `npm audit fix --force` (it downgrades Next); clear it with a Next patch release.
- Spotify streaming needs Premium; free accounts fall back to the embed player.
- Everything must work signed out: Supabase calls are guarded by
  `isSupabaseConfigured()` and a signed-in check.
- `.next/types` can go stale after deleting a route; a build regenerates it.

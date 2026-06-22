# Dreamcode - Plan (what is left to build)

Current state lives in `PROJECT.md`. This file is the forward plan AND the work
hand-off. **Update it after each implementation chunk**; remove items as they ship.
The deeper pedagogy research is in `Extra/Coding Platform Research Strategy.pdf`.

## Working model (who does what)

- **Claude writes the plans and verifies the result.** Each task below is specced
  by Claude with acceptance criteria, and Claude audits the implementation against
  them (`tsc` / `eslint` / `build` + actual behavior) and tags verified items.
- **Gemini (Antigravity) executes the plans.** Implement the tasks marked
  "Owner: Gemini" to the spec; keep the guardrails and the "no AI tells" voice.
- **Claude implements directly only when a task is beyond Gemini** - security-
  sensitive, architecturally subtle, or where Gemini has stalled. Called out per task.

**Guardrails (do not regress):** the learner writes and runs real code at every
step (Python via Pyodide, JavaScript in-browser; C# is read + quiz until a sandbox
lands); spaced review via FSRS; the AI guide asks questions, never gives answers;
"no AI tells" voice (no em/en dashes, no single-char ellipsis, no decorative
emoji); runtime DB access stays RLS-scoped (no ORM on a direct connection). Product
name stays **dreamcode** (the domain is dreamcoder.dev; no rename).

---

## Now

### 1. Custom domain (dreamcoder.dev) - code done; owner action remains
Site URL is env-driven (`NEXT_PUBLIC_SITE_URL` -> `metadataBase` / Open Graph);
auth + Spotify redirects follow the live origin. **Remaining (owner, external
dashboards):** add `https://dreamcoder.dev` alongside localhost in Supabase Auth
(Site URL + redirect), the Google and GitHub OAuth apps, and the Spotify app
redirect URI. See PROJECT.md "Custom domain".

### 2. Backend live end-to-end test + run the migrations (Owner)
The sync path is fully code-audited and fixed by Claude (idempotent upserts, zeroed
demo seed, server-derived level, RLS verified); only the LIVE cross-device test
remains, which needs the owner's provisioned Supabase. Owner: apply
`supabase/migrations/0001_init.sql` AND `0002_telemetry.sql`, set `.env.local`, then
sign up (email + Google + GitHub); earn XP / complete a stop / pass a section
challenge / rate a review; reload and on a SECOND device confirm XP, streak, badges,
completed stops, and FSRS due dates persist; confirm rows in `profiles /
completed_stops / unlocked_badges / srs_cards / submissions / events` and that RLS
blocks other users' rows. Report mismatches; Claude fixes the specific sync path.
(Non-blocking edges: no offline-retry queue and no anonymous -> account merge - both
fine for an online-first MVP.)

---

## Recently shipped (full current-state detail in PROJECT.md)

- **Content depth:** three tracks beginner -> expert (Python 44 / JS 25 / C# 21
  lessons), modular + tiered model (`getModules`), `/industry`, C# read+quiz mode.
- **TypeScript = 4th track (SHIPPED + VERIFIED):** server-side type-strip
  (`/api/transpile`) then run in the JS engine - no external service. 14 lessons
  across 4 tiers (beginner -> expert), 14 practice sets, 4 section challenges
  (reference seed by Claude, full curriculum by Gemini). All verified: lessons run,
  predicts correct, challenges grade, journey/CTA wired. The one follow-on is
  semantic type-checking (needs lib `.d.ts` in-browser; backlog).
- **Practice (2k-A):** all 58 runnable Python/JS lessons have a verified `PracticeDataset`.
- **Section challenges (2k-B):** every runnable Python/JS/TS module ends with a
  graded capstone (`moduleChallenges` + `/journey` node + last-lesson CTA); 25 challenges.
- **JS runner (2k-C):** async / event-loop lessons capture deferred output.
- **Accessibility:** skip link + `<main>` landmark, keyboard-operable Explore
  dropdown, focus-trapped modals, aria-labels on icon buttons, one `<h1>` per page,
  a WCAG-AA contrast pass.
- **Telemetry:** `events` table + `/api/events` + batched `track()` + a `/profile`
  activity view; all 13 canonical events instrumented.
- **Security review:** fixed an open redirect in the OAuth callback (the `next`
  param is now validated to same-origin relative paths) and added baseline response
  headers (`X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`).
- **UX / onboarding polish:** unique brand favicon (`src/app/icon.svg`); guided
  onboarding now routes a new learner to their real first lesson (was hardcoded to
  the mid-curriculum `loops`) via `getNextLesson`; home CTAs are auth-aware
  (`JourneyCtas.tsx`) so "Start free / Start here" become "Continue learning" once
  signed in, and the floating "continue" card shows the real next lesson instead of
  a fake stop; corrected the stale "JavaScript track soon" badge (it ships now).
  Also fixed the Google OAuth redirect (bare `…/auth/callback`, no query string) so
  it matches the Supabase allowlist.

---

## Security hardening (audit follow-ups, not yet done)

Full review done (auth, RLS, the `/api/*` surface, secrets, injection/XSS, deps).
Posture is solid: all DB access is RLS-scoped via the anon key + the user's session
(no service-role key anywhere in the app), routes are auth-gated + Zod-validated, and
the client-side runners only ever execute the learner's OWN code in their OWN browser.
Fixed this pass: the OAuth-callback open redirect + missing security headers. The rest
is non-blocking, to do before/at public launch:

- **Content-Security-Policy** is not set yet. A strict CSP needs per-source
  allowances for the app's inline styles plus the Spotify SDK and Supabase; build it
  report-only first, then enforce.
- **Rate limiting.** `/api/transpile` (public, CPU) and `/api/guide` (auth-gated but
  spends model budget) have no limiter. Add one at launch (e.g. Vercel/Upstash, keyed
  by IP / user) - needs an external store, so flag it.
- **Dependency advisory.** `npm audit` shows 2 MODERATE issues from `postcss` bundled
  inside Next (CSS-stringify XSS). Low real-world risk here (we never process
  untrusted CSS) and the audit "fix" downgrades Next, which we will NOT do; resolve by
  bumping Next when a patched release ships.
- **Community / imported content (when it lands).** The lesson runners execute code
  client-side - safe for first-party content, but user-submitted lessons would be an
  XSS / data-exfiltration vector. Sandbox that execution (sandboxed iframe, no
  same-origin / cookies) before shipping community content.
- **`/api/events` props cap.** The route caps batch size (50) + name length but not
  the per-event `props` size; add a small cap to bound storage abuse.

---

## Decisions needed (blocking part of the content effort)

- **C# / .NET code execution.** Unlike Python (Pyodide) and JavaScript (in-browser),
  C# cannot run client-side. To keep the "write and run real code" guardrail for C#,
  it needs a **server-side code sandbox** - a third-party API (e.g. Judge0 cloud) or
  a self-hosted runner (Docker / self-hosted Judge0). Both are external services /
  infrastructure (flagged per the owner's standing request to surface any
  third-party dependency). Decided for now: **defer execution** - C# ships as read +
  quiz lessons, and the sandbox is wired at the end with the other externals.

---

## Final (do these last, at the owner's direction)

- **Plug in the AI provider.** The Dream Guide is fully built and provider-agnostic
  (`src/lib/ai/guide.ts` + `/api/guide`). Switch it on by setting `AI_PROVIDER` /
  `AI_API_KEY` / `AI_MODEL` in `.env.local` (gemini | openai | anthropic).
- **Billing** (e.g. Stripe) to actually sell the `pro` tier, then set
  `GUIDE_REQUIRE_PRO=true` to gate the AI guide behind it.
- **C# sandbox** (see Decisions needed) so C# lessons can run real code.

---

## Later / backlog

- **Expert tracks** (metaprogramming, concurrency, internals) for both languages.
- **Semantic TS type-checking** in the editor (needs lib `.d.ts` in-browser; see the
  type-check note under the TypeScript track).
- **Community / imported content** support.
- **Institutional/admin** direction (class dashboards, standards alignment) if the
  audience ever expands past individual learners.

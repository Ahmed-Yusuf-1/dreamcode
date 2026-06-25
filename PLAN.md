# Dreamcode - Plan (what is left to build)

`PROJECT.md` holds the full current state (read it first). This file is only the
**forward work** - what is NOT yet done. Shipped/production items are removed from
here as they land; their detail lives in PROJECT.md. Deeper pedagogy research is in
`Extra/Coding Platform Research Strategy.pdf`.

## Working model (who does what)

- **Claude writes the plans and verifies the result** - specs each task with
  acceptance criteria, audits the implementation (`tsc` / `eslint` / `build` +
  actual behavior), and fixes subtle/security-sensitive bits directly.
- **Gemini (Antigravity) executes content-heavy tasks** to the spec, keeping the
  guardrails and the "no AI tells" voice. **Two specs are ready for Gemini** (Claude
  wrote them, Claude verifies the output): `Extra/Gemini-tasks/expert-tracks.md`
  (expert/advanced modules for the existing four languages) and
  `Extra/Gemini-tasks/rust-track.md` (a full new Rust track, beginner to advanced,
  read + quiz like C#).

**Guardrails (do not regress):** the learner writes and runs real code at every step
(Python via Pyodide, JavaScript in-browser, TypeScript via server type-strip then
in-browser; C# is read + quiz until a sandbox lands); spaced review via FSRS; the AI
guide asks questions, never gives answers; "no AI tells" voice (no em/en dashes, no
single-char ellipsis, no decorative emoji); runtime DB access stays RLS-scoped (no
ORM on a direct connection, no service-role key in the app). Product name stays
**dreamcode** (domain is dreamcoder.dev; no rename).

> The product is feature-complete for an MVP and has had a production-readiness /
> UX audit AND a hands-on client walkthrough (auth flow, dashboard "continue" per
> track, honest home copy for all four tracks, lesson editor language labels, the
> Python runner / practice / challenge flows verified by driving the app, mobile). By
> owner direction, exactly **two features are intentionally parked until after
> launch**: (1) the C#/Rust code-execution **sandbox** (section 5), and (2) the
> **AI mentor** + its **Stripe billing** gate (section 3) - billing is coupled to
> the AI since it sells that feature. Everything else below is either an OWNER
> action (external dashboards / secrets / the CSP enforce flip), optional content
> for Gemini (expert tracks, Rust - specs ready), or deferred backlog. Nothing here
> blocks day-to-day use.

---

## 1. Owner actions (no code; only the owner can do these)

Setup is DONE (confirmed by the owner, 2026-06-22): the custom domain is live,
`.env.local` + the Supabase migrations are in place, the dashboard redirect URLs
are configured, and OAuth sign-in works end to end (email + Google + GitHub). The
domain / migration / redirect items are closed. One optional verification remains:

- **Confirm cross-device persistence (quick manual check).** This proves signed-in
  progress lives in Supabase, not just the browser cache. On device A, sign in and
  earn state (complete a lesson for XP, pass a section challenge, unlock a badge,
  rate a review card). On device B - a DIFFERENT browser or phone, so it does NOT
  share localStorage - sign in with the SAME account and confirm XP, level, streak,
  badges, completed stops, and FSRS review due dates all match. Optional: in the
  Supabase Table editor, confirm rows exist in `profiles / completed_stops /
  unlocked_badges / srs_cards / submissions / events` for your user id, and that a
  second account cannot see the first account's rows (RLS). If anything does not
  carry over, report it and Claude fixes the sync (already code-audited: idempotent
  upserts, server-derived level, RLS verified).

## 2. Security hardening (before public launch)

The repo was reviewed (auth, RLS, the `/api/*` surface, secrets, injection/XSS,
deps). Posture is solid. **Done this pass** (2026-06-22): a report-only
Content-Security-Policy + `poweredByHeader: false` in `next.config.ts`; a baseline
in-memory rate limiter (`src/lib/rateLimit.ts`) on `/api/transpile` (per-IP) and
`/api/guide` (per-user, with a friendly 429 in `DreamGuide`); a per-event `props`
size cap on `/api/events`. (Earlier fixes still standing: OAuth-callback open
redirect, baseline security headers.) Remaining, non-blocking:

- **Flip the CSP to enforcing (OWNER).** It ships REPORT-ONLY today
  (`Content-Security-Policy-Report-Only` in `next.config.ts`). Do a full walkthrough
  with the browser console open (JS + Python lessons, TS transpile, Spotify connect,
  auth) and confirm zero legitimate violations, then rename the header key to
  `Content-Security-Policy` to enforce. Note the policy must keep `'unsafe-eval'` /
  `'unsafe-inline'` because the in-browser JS runner (`new Function`) and Pyodide
  require them - this is inherent to a client-side code runner. Optional: add a
  `report-uri`/`report-to` collector endpoint.
- **Durable, cross-instance rate limiting (OWNER - external service).** The current
  limiter is per-process memory, so on multi-instance / serverless hosting each
  instance counts independently. For a hard global cap, back it with an external
  store (Upstash Redis / Vercel KV) keyed by IP / user, then swap the store behind
  `rateLimit()`. Flagged because it adds an external dependency.
- **`npm audit`:** 2 MODERATE issues from `postcss` bundled inside Next (CSS-stringify
  XSS; low real-world risk - we never process untrusted CSS). Confirmed `next@16.2.9`
  is already the latest stable, so this cannot be cleared by bumping yet. The audit
  "fix" downgrades Next - do NOT run `--force`; clear it when a patched Next ships.
- **Sandbox UGC code execution** - only relevant IF community/imported lessons ship
  (see backlog). First-party content is safe; user-submitted code would need a
  sandboxed iframe (no same-origin / cookies).

## 3. Final - deferred externals (do last, at the owner's direction)

- **AI provider key.** The Dream Guide is fully built + provider-agnostic
  (`src/lib/ai/guide.ts` + `/api/guide`). Switch on with `AI_PROVIDER` / `AI_API_KEY`
  / `AI_MODEL` in `.env.local` (gemini | openai | anthropic).
- **Billing (Stripe)** to sell the `pro` tier, then set `GUIDE_REQUIRE_PRO=true` to
  gate the Dream Guide behind it.
- **Code execution sandbox (C# + Rust).** Both languages need a server-side runner
  to execute real code. Deliberately prolonged into its own track - see section 5
  for how it works, the provider options, and the free vs paid trade-offs. Until it
  lands, C# and Rust stay read + quiz.

## 4. Later / backlog

- ~~Semantic TS type-checking~~ **DONE (2026-06-23).** `/api/transpile` now runs a
  real semantic type-check (`src/lib/tsCheck.ts`) using the already-bundled
  `typescript` (no client CDN). Lenient options (no `strict`/`noImplicitAny`, ES2020
  lib, injected `console`, DOM lib dropped so `location`/`status`/`name` are usable
  variable names) catch genuine type errors and block running, the same as syntax
  errors. Validated against all TS lesson/challenge starters + examples (0 false
  positives). Production bundling of the lib `.d.ts` files is handled by
  `outputFileTracingIncludes` in `next.config.ts`.

The rest are large efforts, not quick changes - each needs either content work
(Gemini) or an architecture/product decision before building:

- **Expert tracks** (deeper metaprogramming / concurrency / internals) per language.
  Curriculum CONTENT at volume - the job for Gemini. **Spec ready:**
  `Extra/Gemini-tasks/expert-tracks.md` (data shapes, scope, acceptance criteria).
  **Timing: do these independently of the sandbox.** Python / JavaScript / TypeScript
  already run client-side, so their expert content needs no new infra and can ship
  now. C# expert content is read + quiz either way. The sandbox (section 5) only
  changes whether C#/Rust code can RUN; it does not gate expert content. Recommend
  shipping expert tracks for Py/JS/TS first, then revisiting C#/Rust once the
  sandbox exists.
- **Rust track** (new language, beginner to advanced). Rust has no client-side
  runtime, so it follows the C# read + quiz model (quizzes stand in for code
  challenges until a server sandbox lands). **Spec ready:**
  `Extra/Gemini-tasks/rust-track.md` (the small track-registration edits + the
  content shape + acceptance criteria).
- **Community / imported content.** Blocked on the UGC code-execution sandbox
  (sandboxed iframe, no same-origin/cookies) from the security work - a real
  security-sensitive build, not simple.
- **i18n** - needs a locale/dictionary layer, every user-facing string extracted
  across ~12 pages, a locale switcher, plus the translations themselves (content).
- **Institutional / admin** direction (class dashboards, standards alignment) - a
  whole new product surface (roles, data model, RLS) if the audience expands past
  individual learners.

## 5. Code execution sandbox (C# + Rust) - deferred to its own track

**Why this exists.** Python (Pyodide), JavaScript (`new Function`), and TypeScript
(server type-strip then the JS engine) all run in the LEARNER's own browser, for
free, with no server risk. C# and Rust have no in-browser runtime, so to let
learners actually RUN code (and to grade real code challenges) we need to execute
their code on a server. Running untrusted code on a server is the "sandbox"
problem: it must be isolated (no network, no filesystem escape, CPU/memory/time
limits) so a learner's code cannot harm the host or other users. Both C# and Rust
are unlocked by the SAME sandbox, so this is one integration, not two.

**How it works (the shape of the integration).** A new auth-gated, rate-limited
server route (e.g. `/api/run`, modeled on `/api/guide`) takes `{ language, code,
stdin }`, forwards it to a code-execution service, and returns `{ stdout, stderr,
compileOutput, status, time, memory }`. For challenges, wrap the learner's function
with the test harness (or run each test case) and compare output, exactly like the
JS/TS challenge runner does today, just server-side. Keep it provider-agnostic via
env vars (`RUN_PROVIDER` / `RUN_BASE_URL` / `RUN_API_KEY`) like the AI guide, and
behind a flag until ready. Then flip C#/Rust lessons to `runnable: true`, give them
real `starter` code, and add graded `challenges` with `testCases`.

**Provider options (verify current pricing before committing - these move):**

- **Judge0** - the most common open-source online judge. One API runs 60+ languages
  including C# and Rust in isolated sandboxes (cgroups/isolate). Two ways to use it:
  - *Self-host Judge0 CE (Community Edition)* via Docker on a small VPS. The software
    is FREE/open-source; you pay only for the VPS (roughly $5-20/month) and you own
    the ops. Best long-term cost control and privacy.
  - *Managed via RapidAPI* - no servers to run. Has a FREE tier (a small number of
    requests/day, fine for prototyping) and paid tiers (roughly $10+/month) that
    scale request volume. Fastest to start; you can migrate to self-host later.
- **Piston** (Engineer Man) - open-source, free, self-hostable execution engine,
  many languages incl. C# and Rust. A public instance exists (rate-limited, not for
  production) and you can self-host via Docker. Similar free/self-host trade-off to
  Judge0 CE; lighter weight, fewer features.
- **Sphere Engine** - the commercial product from the Judge0 author. Robust, managed,
  PAID (enterprise pricing). Overkill unless volume/SLA demands it.
- **Roll your own** (ephemeral Docker containers, or Firecracker/gVisor microVMs) -
  maximum control, but you own all the security hardening. Most effort and risk; not
  recommended over Judge0/Piston unless there is a strong reason.
- **In-browser (no server):** Rust->WASM needs the Rust compiler in the browser
  (impractical); C# can run via Blazor/.NET WASM but it is a heavy multi-MB runtime
  and awkward to grade arbitrary code. Not recommended for a sandbox-with-grading.

**Recommendation.** Prototype on **Judge0 via RapidAPI's free tier** to prove the
`/api/run` flow and the challenge grading end to end, then for production either
upgrade the RapidAPI plan or **self-host Judge0 CE** on a small VPS for predictable
cost. This is an OWNER decision because it adds an external service + a recurring
cost + a security surface (untrusted code execution). Flag before adopting.

**Free vs paid, in one line:** there IS a free path (self-host Judge0 CE / Piston,
you pay only cheap hosting; or RapidAPI's limited free tier for low volume); the
paid managed tiers (RapidAPI plans, Sphere Engine) buy you "no servers to run" and
higher request limits.

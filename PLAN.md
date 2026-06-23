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
  guardrails and the "no AI tells" voice. (No Gemini task is currently open - the
  curriculum across all four tracks is complete.)

**Guardrails (do not regress):** the learner writes and runs real code at every step
(Python via Pyodide, JavaScript in-browser, TypeScript via server type-strip then
in-browser; C# is read + quiz until a sandbox lands); spaced review via FSRS; the AI
guide asks questions, never gives answers; "no AI tells" voice (no em/en dashes, no
single-char ellipsis, no decorative emoji); runtime DB access stays RLS-scoped (no
ORM on a direct connection, no service-role key in the app). Product name stays
**dreamcode** (domain is dreamcoder.dev; no rename).

> The product is feature-complete for an MVP. Everything below is either an OWNER
> action (external dashboards / secrets), a pre-launch hardening pass, or a
> deliberately deferred / backlog item. Nothing here blocks day-to-day use.

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
- **C# / .NET execution sandbox.** C# can't run client-side. Needs an external
  service (Judge0 cloud) or a self-hosted runner (Docker) OR a heavy in-browser .NET
  WASM runtime - a flagged external/architecture decision. Until then C# stays
  read + quiz. (Owner chose to defer this with AI + billing.)

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
  This is curriculum CONTENT at volume - the right job for Gemini against a Claude
  spec, not a code change.
- **Community / imported content.** Blocked on the UGC code-execution sandbox
  (sandboxed iframe, no same-origin/cookies) from the security work - a real
  security-sensitive build, not simple.
- **i18n** - needs a locale/dictionary layer, every user-facing string extracted
  across ~12 pages, a locale switcher, plus the translations themselves (content).
- **Institutional / admin** direction (class dashboards, standards alignment) - a
  whole new product surface (roles, data model, RLS) if the audience expands past
  individual learners.

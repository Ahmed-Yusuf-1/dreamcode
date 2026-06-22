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

- **Custom domain (dreamcoder.dev).** Code is env-driven (`NEXT_PUBLIC_SITE_URL`).
  Add `https://dreamcoder.dev` ALONGSIDE localhost in: Supabase Auth (Site URL +
  Redirect URLs), the Google + GitHub OAuth apps, and the Spotify app redirect URI.
- **Run the Supabase migrations:** `supabase/migrations/0001_init.sql` then
  `0002_telemetry.sql`, and set `.env.local` (see PROJECT.md "Supabase setup").
- **Add the OAuth callback to Supabase Redirect URLs:**
  `http://localhost:3000/auth/callback` and `https://dreamcoder.dev/auth/callback`
  (the app now sends the bare callback URL, so these exact entries match). Without
  this, Google/GitHub sign-in returns `{"error":"requested path is invalid"}`.
- **Live backend end-to-end test** (needs the provisioned Supabase + secrets; can't
  be run from the repo). Sign up (email + Google + GitHub); earn XP / complete a stop
  / pass a section challenge / rate a review; reload and on a SECOND device confirm
  XP, streak, badges, completed stops and FSRS due dates persist; confirm rows in
  `profiles / completed_stops / unlocked_badges / srs_cards / submissions / events`
  and that RLS blocks other users' rows. Report any mismatch; Claude fixes the sync.
  (The sync path is already code-audited + fixed: idempotent upserts, server-derived
  level, zeroed demo seed, RLS verified.)

## 2. Security hardening (before public launch)

The repo was reviewed (auth, RLS, the `/api/*` surface, secrets, injection/XSS,
deps). Posture is solid and the found issues are fixed (OAuth-callback open redirect;
baseline security headers in `next.config.ts`). Remaining, non-blocking:

- **Content-Security-Policy** - not set yet; needs per-source allowances for the
  app's inline styles + Spotify SDK + Supabase. Ship report-only first, then enforce.
- **Rate limiting** on `/api/transpile` (public, CPU) and `/api/guide` (spends model
  budget). Needs an external store (e.g. Vercel/Upstash), keyed by IP / user - flag it.
- **`npm audit`:** 2 MODERATE issues from `postcss` bundled inside Next (CSS-stringify
  XSS; low real-world risk - we never process untrusted CSS). The audit "fix"
  downgrades Next - do NOT run `--force`; clear it by bumping Next when patched.
- **`/api/events` props cap** - the route caps batch size + name length but not the
  per-event `props` size; add a small cap to bound storage abuse.
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

- **Semantic TS type-checking** in the editor (the runner strips types but does not
  yet catch type errors; needs the TS lib `.d.ts` in-browser - a CDN/external dep).
- **Expert tracks** (deeper metaprogramming / concurrency / internals) per language.
- **Community / imported content** (triggers the UGC-sandbox hardening above).
- **i18n** (needs a Claude-built locale/dictionary layer first).
- **Institutional / admin** direction (class dashboards, standards alignment) if the
  audience expands past individual learners.

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

### 2. Content depth (the major effort) - in progress
Goal: every language is a vast beginner -> expert path where each concept gets
MULTIPLE lessons + practice + a challenge, so the learner becomes genuinely
proficient, not one shallow lesson per topic.

Shipped so far (current state in PROJECT.md): the `/industry` section, the modular
+ tiered model + `getModules()`, module grouping in the journey/catalog, the C#
read+quiz mode, and **beginner -> expert content for all three languages** - Python
44 lessons / 11 modules, JavaScript 25 / 7, C# 21 / 6 (read+quiz). The journey
module-ordering and C# kicker issues from the prior audit are fixed and verified.

Also shipped + verified since: **2k-A** - every runnable lesson's practice dataset
(58 `practiceDatasets` in `data.ts`, all predict answers executed and confirmed
correct, indentation normalized, scratch files removed); **2k-C** - the async JS
runner fix in `LessonView`; and the **2k-B INFRASTRUCTURE** - `moduleChallenges` +
`getModuleChallenge()` in `data.ts`, gold "Section challenge" nodes on `/journey`
(locked until the whole module is complete, then a clickable gold star, "cleared"
once passed), and a last-lesson "Section challenge" CTA in `LessonView`. Verified
in the browser across locked / unlocked / CTA / C#-has-no-node states.

**2k-B content** then shipped (Gemini, Claude-verified): every remaining runnable
module now has its own real, graded section challenge - 21 challenges total, so
each runnable Python and JavaScript module ends with a difficulty-matched capstone
(C# and the Python read+quiz modules keep their quizzes, no code challenge). All
challenge test cases were verified by running reference solutions; the in-app
grader was confirmed (js-expert-proxy passes 3/3 in the browser); a third test
case was added to the two challenges that had only two. tsc/eslint/build green.

Step 2 (content depth) is now essentially complete: three tracks beginner ->
expert, practice for every runnable lesson, and a difficulty-matched section
challenge at the end of every runnable module. Deeper expansion (more lessons per
concept, a 4th language) lives in "Later / backlog". The next active chunk is set
below once the owner picks a direction.

### 3. Accessibility + SEO - core shipped (Owner: Gemini for the remainder)
Reduced-motion (CSS + Parallax `matchMedia` guard), keyboard `:focus-visible`
rings, per-lesson `generateMetadata`, and domain-aware Open Graph / canonical are
in. Remaining: a broader keyboard-nav + alt-text audit and i18n groundwork.

### 4. Confirm the backend end to end (Owner: OWNER live test; Claude audited the code)

**Code audit (Claude) - DONE.** Full review of the sync path: `profile.ts`, `srs.ts`,
`track.ts`, the `/api/{profile,progress,badges,srs,submissions}` routes, the
RLS-scoped data layer (`src/lib/supabase/data.ts`), the auth plumbing
(`supabase/server.ts`, `proxy.ts`), and the schema (`0001_init.sql`). Findings:
- The architecture is correct. Auth uses `supabase.auth.getUser()` (verifies the
  JWT, not just the cookie); every data function is RLS-scoped; routes are
  auth-gated + Zod-validated; the server DERIVES `level` from `xp` so the client
  never desyncs level; `srs_cards` has the UPDATE policy FSRS needs every review;
  the signup trigger seeds a `profiles` row.
- **Fixed:** `completeStop` / `unlockBadge` used the default upsert (ON CONFLICT DO
  UPDATE), but `completed_stops` / `unlocked_badges` have no UPDATE RLS policy, so a
  redundant call (e.g. a stale second device re-posting) was RLS-denied. Switched
  both to `ignoreDuplicates: true` (ON CONFLICT DO NOTHING, insert-only) - now
  genuinely idempotent. tsc/eslint/build green.

**Known edges (owner to decide; not blocking the happy path):**
1. **Demo seed can corrupt the server (recommend fixing).** `DEFAULT_PROFILE` in
   `profile.ts` ships FAKE progress (level 4, 540 XP, 7-day streak, 5 badges, 3
   completed stops). On a fresh signed-in device, if an XP action fires in the
   sub-second window before the first `syncProfileFromApi()` returns, `addXP` reads
   that fake local profile and PATCHes an inflated `totalXp` to the server. Also,
   new anonymous visitors see fake progress they did not earn. Recommend zeroing
   `DEFAULT_PROFILE` to a true empty state (level 1, xp 0, streak 0, no badges, no
   completedStops, flat weekActivity). This is a product/demo call, so left to the
   owner.
2. **No offline retry / no anonymous-merge.** A failed PATCH/POST (network blip) is
   not retried, and a reload pulls server truth over local, so that one action is
   lost; and signing in overwrites local with server (pre-login anonymous progress
   is not merged up). Both are acceptable for an online-first MVP - flag only.
3. **Pre-trigger users:** `updateProfile` silently no-ops if no `profiles` row
   exists, so the `0001_init.sql` trigger MUST be installed before first signups.

**Live end-to-end test (OWNER - needs the provisioned Supabase + `.env.local`; cannot
be run from this repo without secrets):**
1. Apply `supabase/migrations/0001_init.sql` and set `.env.local` (see PROJECT.md).
2. Sign up (email/password, and once each via Google + GitHub OAuth).
3. While signed in: complete a lesson (XP + stop), pass a section challenge (XP +
   stop + maybe badge), and rate a `/review` card.
4. Reload: dashboard XP/level, streak, badges, completed journey stops, and the
   `/review` due count should match (pulled from the server, not the demo seed).
5. On a SECOND device/browser, sign in as the same user: the same progress, streak,
   badges, and FSRS due dates should appear.
6. In Supabase, confirm rows in `profiles`, `completed_stops`, `unlocked_badges`,
   `srs_cards`, `submissions`, and that RLS blocks reading another user's rows.
Report any mismatch back; Claude will fix the specific sync path.

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

- **Telemetry**: an events table + time-to-first-success / drop-off tracking, to
  drive curriculum improvements.
- **Expert tracks** (metaprogramming, concurrency, internals) for both languages.
- **TypeScript track** (behind Python / JavaScript / C#).
- **Community / imported content** support.
- **Institutional/admin** direction (class dashboards, standards alignment) if the
  audience ever expands past individual learners.

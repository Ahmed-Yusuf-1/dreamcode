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

## 0. Production audit follow-ups (implementation status)

Audit date: 2026-07-13. Owner approval was received and the production pass landed
the following changes:

- [x] Idempotent, server-catalogued activity rewards. Replays no longer grant XP;
  the profile API no longer accepts XP/streak values, and signed-in award requests
  are serialized while the unique completion key acts as the database gate.
- [x] Curriculum-linked, active-track review cards for all four languages. A new
  learner has no unrelated cards; completed lessons become FSRS review material.
- [x] Per-track placement question banks and destinations, with one placement
  reward per track and no unrelated `bug-catcher` award.
- [x] Truthful badge triggers/descriptions, Guide setting behavior, disabled
  reminder copy, and removal of the fake member-since date.
- [x] JavaScript and emitted TypeScript now execute in a fresh Web Worker with a
  five-second hard timeout; the same runner grades JS/TS challenges and projects.
- [x] The unused service-role placeholder was removed and `.env.local.example` is
  intentionally committed.
- [x] Content integrity tests, zero-warning lint, PR CI, branded error/404 UI,
  robots, sitemap, and generated Open Graph artwork.

Remaining follow-ups (the only still-open parts of the audit):

- [ ] Move signed-in XP/streak/badge updates into one Postgres transaction/RPC so
  two different devices completing different activities at the exact same moment
  cannot lose an increment. The current unique insert prevents duplicate rewards,
  but the profile increment itself is still a read/update sequence.
- [ ] Add an explicit guest-to-account merge choice and an auth hydration gate for
  the first signed-in mutation.
- [ ] Persist the placement recommendation separately and make Dashboard/Journey
  honor it without marking skipped lessons complete.
- [ ] Add browser smoke tests to CI for signed-in Supabase behavior. The current
  local in-app walkthrough covers theme switching, the JS worker, navigation, and
  infinite-loop termination; CI currently covers types, lint, content, and build.
- [ ] Author real TypeScript and C# project catalogs. The Projects page now filters
  honestly by track and shows a clear authored-content message instead of routing
  those learners into another language.

The detailed findings and acceptance criteria below are retained as the audit
record. Items above marked complete supersede their original “recommended change”
wording; only the remaining checklist is forward work.

### P0 - make rewards and progress atomic and idempotent

The current optimistic client functions save completion and XP separately. A
practice completion calls `addXP(20)` and `addXP(15)` back to back, producing two
fire-and-forget absolute-XP PATCH requests. Those requests can arrive out of order
and leave the server with the smaller total. Replaying a completed practice,
challenge, project, read-and-quiz lesson, or placement quiz also awards XP again
because `completeStop()` is idempotent but `addXP()` is called before the code knows
whether the completion was new. The API also accepts arbitrary client-supplied XP,
streak, badge, completion, and pass state, so production progression is not an
authoritative server record.

Recommended change:

- Add one authenticated server operation for an achievement, for example
  `POST /api/complete`, with a known activity kind and slug. In one Postgres
  transaction, validate the slug against a server-owned reward catalog, insert a
  unique completion row, increment XP only when the insert is new, derive level,
  evaluate badge rules, and return the canonical profile.
- Store the achievement kind separately or namespace every completion key so a
  lesson, practice, challenge, and project can never collide.
- Keep guest mode local, but make its award helper idempotent by checking the
  completion key before adding XP. On sign-in, explicitly offer to merge guest
  progress into the account instead of silently replacing the local cache with the
  server's fresh profile.
- Make streak dates and badge criteria server-derived for signed-in users. Do not
  accept arbitrary `passed`, badge IDs, XP totals, or streak values as truth from
  the browser.
- Remove the race between `getSession()` startup and an early user action by
  exposing a resolved auth/profile hydration state before signed-in mutations.

Acceptance criteria:

- Repeating any completed activity never awards XP or emits a second completion.
- Practice completion awards its intended combined reward exactly once on both
  local and Supabase state, even under deliberately reordered network responses.
- Two tabs completing the same activity concurrently produce one reward.
- A guest who signs up can keep progress through an explicit, tested merge path.
- The browser cannot award itself XP, badges, or a passing submission through a
  direct API request.

### P0 - connect review scheduling to the curriculum

The FSRS math and persistence work, but the review product is currently eight
static cards in `data.ts`. The initial scheduler explicitly seeds only `r1` through
`r4`; missing cards are treated as due immediately. Reviews are not created from a
completed lesson or practice, are not filtered to the active track, and JavaScript
has no cards. The UI claim that a finished practice was "review scheduled" is
therefore not generally true.

Recommended change:

- Give every reviewable lesson one or more stable concept-card IDs and author a
  small recall prompt for each supported track.
- Enroll those cards when the owning lesson/practice is first completed, using the
  same atomic completion operation above.
- Filter the review queue by enrolled cards and active track, with an optional
  mixed-track mode for learners who choose it.
- Use the chapter checkpoint as a separate immediate retrieval session. Do not
  rely on time-based `dueAt` values to make newly learned material appear there.
- Award the 7-day `streak-keeper` badge from actual streak state, not from finishing
  one review session.

Acceptance criteria:

- A new learner has no unrelated due cards.
- Completing a lesson enrolls only its authored review concepts.
- Python, JavaScript, TypeScript, and C# queues never leak into one another unless
  mixed review is enabled.
- Chapter review always has relevant just-learned material, while normal Night
  Review continues to follow FSRS due dates.

### P1 - make placement genuinely track-aware

`/placement` reads the selected track only for telemetry. Its three questions,
recommendation, and destination are always Python, so JavaScript, TypeScript, and
C# learners are sent to Python Loops. Retrying also grants another 50 XP. The
screen currently recommends a start point but does not persist a placement result
that the dashboard or journey can use.

Recommended change:

- Build a short question bank and recommendation thresholds for each track, or
  relabel the existing page as a Python readiness check until those banks exist.
- Persist a separate `recommendedStartSlug` or placement record. Do not mark
  skipped lessons complete and do not grant their XP.
- Make Journey, Dashboard, and Continue Learning honor the recommendation while
  still letting the learner choose "start from the beginning."
- Award the placement reward once, and do not use `bug-catcher` for placement. Its
  current description is "Fix a broken program."

### P1 - implement the badge rules the UI promises

Only a few badges have triggers, and several are wired to unrelated actions. Any
practice unlocks `first-loop`, placement unlocks `bug-catcher`, one review unlocks
`streak-keeper`, and most of the other badge descriptions have no implementation.
The dashboard presents the first locked badge as "Next up" even if no rule can
ever unlock it.

Recommended change:

- Define a typed rule for all ten badges and evaluate rules from canonical events
  or server state.
- Align descriptions, reveal behavior, and telemetry with the real criteria.
- Show a real progress measure for the next achievable badge, not array order.

### P1 - make profile controls truthful

`soundsEnabled` works. `guideEnabled` is saved but `DreamGuide` never reads it, so
turning the guide off does nothing. `remindersEnabled` is also saved but there is no
notification, email, service worker, or reminder scheduler. The signed-in profile
also says "night driver since June 2026" for every account.

Recommended change:

- Hide or disable the Dream Guide launcher when `guideEnabled` is false, while
  keeping a clear way to turn it back on from Profile.
- Either implement reminder delivery with explicit permission and timezone rules,
  or label the control "Coming later" and disable it until that system exists.
- Use the real account/profile creation date or remove the hardcoded member-since
  copy.

### P1 - isolate the JavaScript runner

Python already runs in a worker with a 12-second timeout. JavaScript and emitted
TypeScript run through `new Function` on the main UI thread. An accidental infinite
loop freezes the entire tab, and learner code can touch the app's same-origin DOM
and local storage.

Recommended change:

- Move JavaScript/TypeScript lesson execution and challenge grading to a dedicated
  Web Worker with a hard timeout and a fresh worker/realm per run.
- Use a small structured message protocol for console output and test results.
- Keep browser APIs in explicitly labeled Web API lessons only, using a separate
  constrained preview surface when DOM access is part of the objective.

### P1 - remove the unused service-role secret from setup

The runtime correctly uses only the Supabase anon key plus the user's session, but
`.env.local.example` and the setup section in `PROJECT.md` still ask the owner to
copy `SUPABASE_SERVICE_ROLE_KEY`. No application code reads that value. Keeping an
unneeded database-admin secret on developer and deployment machines expands the
impact of an environment leak. The example file is also swallowed by the broad
`.env*` gitignore rule, so a clean clone does not receive the documented template.

Recommended change:

- Remove `SUPABASE_SERVICE_ROLE_KEY` from the local template and setup instructions.
- Add `!.env.local.example` after the `.env*` rule and commit a placeholder-only
  example containing exactly the variables the app reads.
- Remove the unused service-role value from deployed and local environments after
  confirming no external job relies on it. Keep service-role SQL in the Supabase
  dashboard or a separately secured admin workflow, never in this web app.
- Add startup/deploy validation for required production variables without logging
  their values.

### P1 - add production regression coverage and failure UI

The repository has no automated test files or CI workflow. Production build,
TypeScript, and ESLint pass locally, but the highest-risk flows have no repeatable
regression checks. Next's production guidance also recommends application-owned
error and not-found experiences; the app currently falls back to the framework
default. Metadata has no Open Graph image, sitemap, or robots file.

Recommended change:

- Add unit tests for curriculum graph integrity, XP/level/streak math, FSRS, track
  adjacency, badge rules, TypeScript checking, and API schemas.
- Add Playwright smoke tests for guest and signed-in completion, repeat-award
  prevention, practice gating, placement routing, track switching, and one runner
  per supported runtime.
- Run typecheck, ESLint, tests, and `next build` in CI on every pull request.
- Add branded `error.tsx`, `global-error.tsx`, and `not-found.tsx`, then add
  `robots.ts`, `sitemap.ts`, and an Open Graph image.
- Clean the 13 existing ESLint warnings, especially the three Spotify hook
  dependency warnings, so warnings do not hide new regressions.

### P2 - align the project catalog and documentation

The project catalog imports `useActiveTrack` but does not use it. It currently has
Python and JavaScript projects only, while Journey labels a chapter project for
every track. TypeScript can run now and should have a real typed project; C# should
show an honest read-and-design alternative until its sandbox exists. `README.md`
still describes the app as frontend-only with mocked auth and runners, which is no
longer accurate. The file header in `data.ts` has the same stale claim.

Recommended change:

- Filter or group projects by active track and add at least one gradeable
  TypeScript project using the existing transpile/type-check path.
- Make C# project copy explicitly non-runnable until the parked sandbox ships.
- Rewrite `README.md` from the current `PROJECT.md` state and remove stale mock
  comments.
- Patch Next from 16.2.9 to the current stable 16.2.10 after reading its bundled
  migration/release guidance and re-running the full verification suite. This
  patch does not clear the nested PostCSS advisory by itself.

### Design-study validation still due

Desktop production-build walkthrough passed for Original plus the four new design
studies, including cycling, local persistence, alternative CTA palettes, tactile
button depth, and navigation between Home and Lessons. The browser blocked the
separate 375px reload, so a hands-on mobile check remains required before choosing
one of the studies for promotion. Original remains the default and has no study
style overrides.

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

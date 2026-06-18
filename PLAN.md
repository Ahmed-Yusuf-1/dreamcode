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

Shipped so far (current state in PROJECT.md, not repeated here): the `/industry`
section, the modular + tiered model + `getModules()`, module grouping in the
journey and catalog UI, and deep content for two languages - **Python: 21 lessons
across 5 modules** (Python Basics, Conditionals and logic, Loops and iteration,
Functions, Collections) and **JavaScript: 14 lessons across 4 modules** (JS Basics,
JS Conditionals & Logic, JS Collections & Loops, JS Collections Depth). **C#: still
0 lessons** - the remaining gap.

**Step 2g - bring up the C# track (read + quiz, since execution is deferred).**
C# is NOT just content: the app has no C# track and no non-runnable lesson mode,
so raw C# data alone would be unreachable and would render a broken Run editor.
Split into infra (Claude) then content (Gemini):

**2g-infra (Owner: CLAUDE - architecturally-subtle exception).** Add C# as a real
track plus a read+quiz lesson mode:
- `src/lib/track.ts`: extend `Track` to include `"csharp"`; handle it in the toggle
  and persistence.
- `src/app/lessons/page.tsx`: add a C# tab. `src/app/journey/page.tsx`: handle the
  csharp track (chapter title, project label).
- Non-runnable lesson mode: add `runnable?: boolean` (default true) and a `quiz`
  field to `Lesson`; in `LessonView`, when `runnable === false`, hide the
  editor/Run/console and show the read-only example plus a multiple-choice quiz
  that awards XP and completes the stop. Python and JS lessons are unaffected.
- Add 1-2 sample C# lessons to prove the mode end to end.
- Acceptance (Claude self-verifies): tsc/eslint/build green; C# tab appears; a C#
  lesson renders read + quiz (no Run button) and the quiz completes the stop;
  Python and JS lessons still run real code unchanged.

**2g-content (Owner: GEMINI; Claude verifies; BLOCKED until 2g-infra lands).**
Author the C# beginner modules as read + quiz lessons in `curriculum.ts`
(`language: "csharp"`, `runnable: false`, a `quiz` per lesson) following the depth
pattern: C# basics -> types and variables -> control flow -> methods -> intro OOP,
each module ~5 lessons. Claude specs the exact lesson list once the infra is in.

### 3. Accessibility + SEO - core shipped (Owner: Gemini for the remainder)
Reduced-motion (CSS + Parallax `matchMedia` guard), keyboard `:focus-visible`
rings, per-lesson `generateMetadata`, and domain-aware Open Graph / canonical are
in. Remaining: a broader keyboard-nav + alt-text audit and i18n groundwork.

### 4. Confirm the backend end to end (Owner: Gemini; Claude verifies)
After the Supabase setup in PROJECT.md: sign up, earn XP / complete a stop / pass a
challenge while logged in, then reload and on a second device - progress, streak,
badges, and FSRS due dates should persist server-side. Fix any sync gaps in
`profile.ts` / `srs.ts` / `track.ts`.

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

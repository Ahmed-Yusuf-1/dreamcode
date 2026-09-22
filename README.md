# dreamcode

A cloud-themed web app for learning to program by writing real code from the
first minute. Built with Next.js 16, React 19, Supabase, CodeMirror 6, Pyodide and
an FSRS spaced-review scheduler.

- **172 lessons** across Python (77), JavaScript (48), TypeScript (26) and C# (21),
  grouped into chapters from beginner to expert.
- **Every runnable lesson ends with a "Your turn" task** that is checked against the
  learner's own code and output.
- **143 practice sets** (predict the output, arrange the lines, fill the gaps),
  **33 graded challenges** and **15 multi-step projects**, all run in the browser.
- The data science lessons run **real NumPy and pandas**, fetched once on the first
  run.
- **36 badges earned by rule**, from common to legendary, each paying bonus XP, plus
  levels and ranks, a handle and an emblem, and a leaderboard with a weekly and an
  all-time board.
- Guest progress in the browser, Supabase accounts with server-authoritative XP,
  streaks and badges, a placement check per track, night review, an optional
  Socratic AI guide and a Spotify player.

## Local setup

```bash
npm install
cp .env.local.example .env.local   # Windows: copy .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`. Every value in `.env.local` is optional for a
guest-only walkthrough; the file explains each one.

## Quality gates

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint, zero warnings allowed
npm test            # runs all course content on the real runtimes
npm run test:db     # row-level security and reward functions on in-memory Postgres
npm run build
npm run test:e2e    # Playwright: pages, runners, accessibility and contrast
```

CI (`.github/workflows/ci.yml`) runs all six on every pull request and on pushes to
`main`. The browser suite also audits every hub page with axe-core and checks that
every text style meets WCAG AA against the painted sky, in both appearances.

`npm test` is the content harness (`scripts/verify-content.mjs`). It executes every
lesson example, starter, task solution, predict question, practice set, placement
question, challenge and project against Pyodide, the app's JavaScript worker, the
app's TypeScript checker and jsdom, using the reference solutions in
`scripts/fixtures/solutions/`. It also checks the voice rules, curriculum links and
that the reward seed is current. Use `--static` for the fast checks only, or
`--only=<slug prefix>` to focus on part of the course.

## Runtime notes

- Python runs real CPython (Pyodide) in a Web Worker, with `input()` fed from an
  input box and echoed like a terminal.
- JavaScript, and TypeScript after a server-side type check (`/api/transpile`), run
  in a fresh Web Worker per run with a five-second limit.
- DOM lessons run in a sandboxed, opaque-origin iframe with an injected loop guard.
- C# is a read-and-quiz track until a server-side execution sandbox exists.
- Signed-in data access uses the Supabase anon key plus the learner's session and
  Row-Level Security. XP, completions and badges change only through the
  `award_activities`, `spend_xp` and `record_submission` database functions.

## Database

Run the migrations in `supabase/migrations/` in order, then both seeds:
`supabase/seed/activity_rewards.sql` and `supabase/seed/badge_catalog.sql`. They are
generated from the course content and the badge list: after changing lessons,
practice, challenges, projects or badges, run `npm run seed:rewards` and apply the
new seeds. `npm test` fails if either is stale.

Read `PROJECT.md` for the implementation map and `PLAN.md` for the remaining work.

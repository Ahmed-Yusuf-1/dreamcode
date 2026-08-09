# dreamcode

A dreamy, cloud-themed programming-learning platform built with Next.js 16,
React 19, Supabase, CodeMirror, Pyodide, and an FSRS-style review scheduler.

The app includes 104 lessons across Python, JavaScript, TypeScript, and C#;
practice flows; tested challenges and projects; guest and Supabase-backed
progress; idempotent XP/badges; Spotify playback; and an optional server-backed
Socratic Dream Guide.

## Local setup

```bash
npm install
copy .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`. Supabase and AI provider values are optional for a
guest-only local walkthrough; see `.env.local.example` for every supported value.

## Quality gates

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs all four commands on pull requests and pushes to `main`. The content test
checks curriculum identity, required lesson copy, practice links, and challenge /
project test cases.

## Runtime notes

- Python runs in a disposable Pyodide worker with a timeout.
- JavaScript and transpiled TypeScript run in a fresh dedicated Web Worker with a
  five-second timeout; learner code cannot block the React UI thread.
- C# is currently a read-and-quiz track until its separate sandbox is built.
- Sunset Arcade is the light appearance and Midnight Focus is dark. Profile offers
  Automatic (light 07:00-19:00 local time), Light, and Dark.
- Signed-in database access uses the Supabase anon key plus the user session and
  Row-Level Security. The web app does not use a service-role key.

Read `PROJECT.md` for the complete implementation map and `PLAN.md` for the small
remaining production/deferred backlog.

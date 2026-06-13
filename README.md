# dreamcode — frontend

The dreamy cloud-themed programming-learning platform. **Frontend only for now** — all data is mocked in `src/lib/data.ts`; the backend (auth, Postgres, FSRS scheduling, real code sandboxes) comes later per the project plan.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Pages

| Route | What it is |
|---|---|
| `/` | Home — Neon Dusk hero (from the Claude Design handoff) |
| `/lessons` | Lessons overview — Sunset Stops |
| `/badges` | Badge collection (found + locked) |
| `/journey` | Journey map — node road with HUD (streak, XP, level) |
| `/peaks` | Problem Peaks — standalone challenge library |
| `/lesson/loops` | Lesson player — teaching card + live CodeMirror editor + mock run |
| `/practice/loops` | PRIMM practice flow — Predict MCQ → Parsons puzzle → faded example |
| `/challenge/cloud-hopper` | Challenge — real in-browser JS test runner + badge reward |
| `/review` | Night review — spaced-recall card session |
| `/dashboard` | Logged-in hub — continue, due reviews, XP/week chart, badges |
| `/projects` | Projects — Guided / Independent / Capstone tiers |
| `/login`, `/signup` | Auth UI (mock — routes to dashboard) |
| `/profile` | Profile & settings incl. the Dream Guide (AI mentor) opt-in toggle |

The **Dream Guide** (`src/components/DreamGuide.tsx`) is the opt-in Socratic AI mentor — scripted UI demo of the 5-phase hint flow (it asks questions, never writes code).

## Design source

The visual design comes from `../Code-handoff/code/project/Dreamcode.dc.html` (Claude Design export). Theme notes:

- Fonts: Baloo 2 (display), Nunito (body), JetBrains Mono (code) via `next/font`
- Cloud assets in `public/assets/` (copied from the handoff bundle)
- **`src/lib/theme.ts` is the theme control panel**: per-page gradient opacity (`gradientOpacity.home`, `.lessons`, `.badges`, `.challenge`, `.auth`) and a global `cloudOpacityBoost` multiplier for all floating clouds
- Shared keyframes/glow/glass utilities live in `src/app/globals.css` (`.neon-title`, `.neon-wordmark`, `.neon-outline`, `.glow-hover`, `.glass`, `.cloud-glow`)

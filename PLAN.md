# Plan: "Dreamcode" - A Programming Learning Platform

> **Status (June 2026): Frontend prototype built.** The complete page-and-flow
> skeleton and design system exist, with one fully worked Python lesson and a real
> Spotify player. There is no backend yet and the curriculum is mock data. For the
> current state of the codebase (what is done, where things live, how to run it,
> conventions, and next steps) read **`PROJECT.md`**. This file remains the
> strategic plan and the research rationale behind the product decisions.

---

## Context

The user wants to build an authentic, highly effective platform for learning to program - from absolute beginner to expert, covering every dimension (syntax → concepts → problem-solving → real projects). Start with **Python**, then add **JavaScript/TypeScript**. AI is a *supplement, not the headline feature*.

This plan is grounded in: my own web research (pedagogy, platform comparisons, execution tech, retention) **plus** the user's detailed engineering/pedagogy research document, which contributed cognitive-science framing, the PRIMM model, Parsons problems, a tiered code-execution architecture, expert curricular depth, a 5-phase Socratic AI workflow, SDT-based gamification, and a telemetry layer.

**Decisions locked with the user:**
- **First milestone:** Python + the core learning loop, done excellently - full-stack with accounts. The broad feature-rich vision is documented as explicit later phases.
- **Stack:** recommend a modern stack (below).
- **AI:** optional Socratic hint-based tutor, a later phase.

---

## Design philosophy (the pillars everything is judged against)

1. **Reject the "geek gene."** Programming is a *learned* skill; the bimodal "some people just can't" myth is empirically false. We design for everyone and pour resources into struggling learners rather than assuming innate limits.
2. **Design against "tutorial hell."** The #1 reason beginners fail is passively copying an instructor who already did the problem-solving. We protect *productive struggle* and fade scaffolding to independence. We also fight *blank-editor syndrome* (small, well-specified starts) and the beginner→intermediate *"valley of despair."*
3. **Manage cognitive load (Cognitive Load Theory).** Keep total load under working-memory capacity: chunk concepts (intrinsic), eliminate UI friction and split-attention (extraneous), and direct effort to schema-building (germane). **Concrete rule:** instructions, diagrams, and the code editor live in *one integrated workspace* - never split across disconnected panes (Mayer's multimedia principles: coherence, signaling, spatial contiguity).
4. **Reading before writing (PRIMM + semantic wave).** Comprehension precedes creation. Lessons move contextualized → abstract syntax → real-world application.
5. **Active retrieval + spaced repetition.** Retrieval beats re-reading (~80% vs ~34% week-later retention); spacing helps in ~96% of studies. Every concept is exercised and later resurfaced (FSRS scheduling).
6. **Validate semantics, not syntax.** Grade with *real hidden test suites*, never brittle regex matching (Codecademy's core flaw - it rejects valid alternative solutions). Accept any correct approach.
7. **Minimize friction between intent-to-code and execution.** Fewest possible steps; instant in-browser runs; fast load on weak devices/networks.
8. **Gamify mastery, not vanity.** Ground motivation in Self-Determination Theory (autonomy, competence, relatedness). Tie XP/achievements to *real concept mastery* and gate advanced material behind it - never confuse clicks/streaks/badges with learning.

**What we learned from competitors' pitfalls:** Codecademy - rigid regex validation + over-scaffolding stunts independence. LeetCode - no structured teaching, optimization over fundamentals. Hyperskill - drops complex projects (e.g., state machines) without scaffolding. Odin - firehose of external links, no real-time feedback. Boot.dev - strong RPG structure but local-setup onboarding friction. Scrimba - brilliant interactive screencasts but frontend-only depth.

---

## The core learning loop (heart of the MVP) - PRIMM + Review

Every concept cycles through this. Nailing it for Python *is* the first milestone.

```
 PREDICT ─► RUN ─► INVESTIGATE ─► MODIFY ─► MAKE ─► REVIEW
 read code  exec   analyze how    alter    build   spaced
 & predict  & see  it actually    given    from    retrieval
 output     result works          code     scratch resurfaces later
   └─ comprehension first ─┘   └─ scaffold fades to independence ─┘   └─ FSRS ─┘
```

Exercise types that implement the loop (a richer toolbox than "write code & run"):

| Type | Purpose | Where in loop |
|---|---|---|
| **Runnable worked example** | Read & predict, low intrinsic load | Predict / Run |
| **Code-tracing / output prediction** | Build program-comprehension before writing | Investigate |
| **2D Parsons / Faded Parsons Problems** | Order + indent given fragments - focus on logic, not syntax; structured bridge to writing | Investigate → Modify |
| **Faded worked examples** | Progressively blank out parts of a solution | Modify |
| **Test-driven challenge** | Write original code vs hidden tests; instant pass/fail + targeted error explanation + graduated hints | Make |
| **MCQ check-in** | Low-stakes confirmation a concept is understood before advancing | Review / gate |
| **Spaced recall card** | Resurface the concept days later | Review |

---

## Curriculum architecture (beginner → expert)

Content is **data, not code** - authored as Markdown + a YAML/JSON schema (exercise type, starter code, hidden tests, hints, fragments for Parsons, MCQ options). Lets the curriculum grow without app changes and supports future contributors.

```
Track (Python) → Course → Module → Lesson (concept + worked example)
                                 → Exercise[] (typed, with hidden tests + graded hints)
                          → Module Project → Capstone Project
```

**Four-phase trajectory (applies to both languages; MVP = Phase 1-2 of Python):**

| Phase | Python focus | JS/TS focus | Projects | Assessment emphasis |
|---|---|---|---|---|
| **1 Foundations** | types, collections, list comprehensions, scope, control flow | `var/let/const`, ES6, arrays, basic closures | CLI calculators, text filters | Parsons problems, syntax ordering |
| **2 Core paradigms** | OOP, inheritance, file I/O, modules | prototypal inheritance, ES6 classes, functional arrays | modular games, terminal CRUD apps | code tracing + output prediction, unit tests |
| **3 System optimization** | metaclasses, dynamic attributes, decorators, testing | Proxy/Reflect, custom decorators, bundling | custom test libs, ORM mapping | open-ended tasks under performance budgets |
| **4 Concurrency & internals** | `asyncio`, GIL, threading vs multiprocessing, CPython pipeline (tokenize→AST→bytecode→PVM, refcount/GC) | event loop (call stack, heap, web APIs, macro/microtask queues), Web Workers, V8 (Ignition→TurboFan JIT, deopt, generational GC) | concurrent scrapers, high-perf server loops | profiling, execution-path tracing, memory-leak analysis |

A **"Problem-solving & debugging" strand runs across all phases** (decomposition, reading errors, tracing, test-first thinking) - the part most curricula skip, where learners stall. Every level is tagged beginner/intermediate/advanced to support multiple entry points + placement later.

---

## Recommended tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | One codebase for UI + API routes; great DX; easy hosting. |
| UI | **Tailwind CSS + shadcn/ui** | Fast, accessible primitives; supports the single integrated workspace. |
| Editor | **CodeMirror 6** | Lighter & more mobile-friendly than Monaco; modular; used by Replit. (Monaco later if we need full IntelliSense.) |
| Auth | **Auth.js (NextAuth)** or **Clerk** | Email + OAuth. Default: Auth.js. |
| Database | **Postgres (Supabase or Neon)** | Relational fit for users/progress/SRS; Supabase bundles auth + storage. |
| ORM | **Drizzle** (or Prisma) | Type-safe schema/queries. |
| SRS | **FSRS** | Modern, outperforms SM-2. |
| Hosting | **Vercel** + managed Postgres | Zero-config Next.js deploys. |

### Tiered code-execution architecture (a key upgrade from the research)

Default to **client-side WASM** - secure isolation, no untrusted code on our servers, near-zero exec cost, instant feedback. Pick the lightest engine per task:

| Engine | Use for | Notes |
|---|---|---|
| **MicroPython-WASM** | intro syntax drills, quick exercises | very low startup latency; strict CPU/memory caps stop infinite loops |
| **Pyodide (CPython→WASM) in a Web Worker** | data/scientific lessons & projects (NumPy/Pandas/Matplotlib) | full Python, but ~5-15s startup + large download → lazy-load, cache, and **run in a Web Worker** so long tasks never freeze the UI |
| **WebContainers (StackBlitz)** | JS/TS full-stack & multi-file Node projects, `npm` | client-side Node runtime; caveat: native C/C++ deps (e.g. `sharp`/libvips) need WASM shims (e.g. Squoosh) |
| **Judge0 CE (remote sandbox)** | advanced/multi-file backend or other languages | Linux namespaces + cgroups limit CPU/memory/network; only when client-side can't do it - scales as infra cost, so it's the exception not the default |

**MVP uses MicroPython-WASM for drills + Pyodide-in-Worker for richer Python.** WebContainers/Judge0 arrive with the JS track and advanced projects.

---

## Architecture & data model sketch

```
Browser
 ├─ Next.js UI - single integrated workspace (instructions + diagram + editor together)
 ├─ CodeMirror 6 + (MicroPython-WASM | Pyodide Web Worker | WebContainer)  ← runs & tests code locally
 └─ calls ─► Next.js API ─► Postgres (users, progress, SRS, submissions, telemetry)
                       └─► (later) AI tutor ─► Claude API (Socratic hints only)
                       └─► (later) Judge0 remote sandbox
```

**Key tables (MVP):** `users` · `progress` (user × lesson/exercise, attempts, status) · `srs_cards` (FSRS state) · `submissions` (code + pass/fail) · `streaks`/`xp` · `events` (telemetry; see below). Curriculum content lives in versioned repo files, not the DB.

---

## AI Socratic mentorship (Phase 3 - opt-in, never the main feature)

A direct code-generator bypasses the struggle that builds memory. So the AI is a **Socratic mentor** constrained by a system prompt (concise responses, **no direct code generation**), running a 5-phase workflow:

| Phase | AI behavior | Workspace rule |
|---|---|---|
| 1 **Socratic debate** | one targeted diagnostic question; never names the bug's location | reads learner's code + execution logs |
| 2 **Plan crystallization** | learner outlines step-by-step logic before coding | editor stays locked until a plan exists |
| 3 **Test-first anchoring** | learner writes one *failing* assertion | runs the test suite; must fail before edits unlock |
| 4 **Guided implementation** | brief hints (≤ N words) on underlying concepts; no code | tracks repeated help requests → small **XP penalty** to discourage over-reliance |
| 5 **Validation check-in** | a 3-choice MCQ verifying *why* the fix worked | blocks progression until answered correctly |

Power-ups earned through clean problem-solving can reduce hint XP costs. The platform is fully usable with AI **off**.

---

## Retention, gamification & analytics

- **SDT-aligned, mastery-gated gamification.** XP, achievements across skill categories, daily streaks, RPG-style progression - but advanced material **unlocks only after mastering foundations**. Avoid vanity metrics; reward real outcomes. (Gamified courses reach far higher completion than ungamified.)
- **Interactive screencasts (Scrimba-style, later phase).** Record DOM events (clicks/keystrokes) not video pixels → tiny files, smooth on low bandwidth, and **learners can pause and edit the instructor's code directly** in the player.
- **Telemetry layer (drives continuous improvement).** Log an `events` stream and monitor, each with an automatic mitigation:

| Metric | Signals | Mitigation when it diverges |
|---|---|---|
| Completion rate by module | difficulty spikes | add faded worked examples / Parsons problems; re-scaffold |
| **Time-to-First-Success (TTFS)** | systemic friction, unclear instructions | simplify instructions, cut editor setup steps |
| Drop-off point mapping | confusing UI/tasks | simplify copy, add Socratic tooltips |
| Code-validity ratio | overly rigid validators | loosen to accept semantic alternatives |
| Cohort retention by role | long-term engagement | add collaborative/peer/class features |

---

## Phased roadmap

- **Phase 0 - Foundations:** repo + Next.js/TS + Tailwind; DB + auth; curriculum content schema; one lesson rendered in the integrated workspace.
- **Phase 1 - MVP (the first milestone):** accounts + cloud progress; CodeMirror + MicroPython-WASM (drills) + Pyodide-in-Worker (richer Python); typed exercises incl. **Parsons/faded examples**; hidden-test grading with graduated hints; FSRS review queue; dashboard (progress, due reviews, streak). *Goal: zero → writing & passing real Python with retention built in.*
- **Phase 2 - Breadth:** JavaScript **+ TypeScript** track (WebContainers); projects system (guided→independent→capstone); SDT-based gamification; placement assessment.
- **Phase 3 - Optional AI Socratic tutor:** the 5-phase workflow above; error explanations; targeted extra practice in weak areas.
- **Phase 4 - Scale & depth:** Judge0 server-side sandbox; expert tracks (metaprogramming, concurrency, internals); interactive screencasts; community/peer review; **institutional/admin direction** (class dashboards, CSTA-standard alignment, multilingual + cross-OS/low-bandwidth UX); analytics-driven curriculum tuning.

---

## Open questions to resolve before/while building
- **Name** - is "Dreamcode" the product name?
- **Auth** - Clerk (faster) vs Auth.js (own it)? Default Auth.js + Supabase.
- **Monetization** - free / freemium / paid? Affects gating, not the MVP build.
- **Audience priority** - individual self-learners first, or also schools/institutions (changes how soon admin dashboards/standards alignment matter)?
- **Content authoring** - write curriculum ourselves vs support community/imported content later.
- **Accessibility & i18n** targets for v1.

---

## Verification (how we'll prove the MVP works, once built)
1. **Run locally** - `npm run dev`, sign up, land on the dashboard.
2. **End-to-end PRIMM loop** - predict a worked example's output, run it (MicroPython/Pyodide), solve a Parsons problem, fail a test-driven challenge → see targeted feedback + graduated hints → pass; confirm progress persists across logout/login.
3. **Spaced review** - complete concepts; confirm `srs_cards` get FSRS due dates and resurface on later (simulated) dates.
4. **Sandbox safety** - learner code runs only in the browser sandbox; infinite loops are killed by CPU/time caps and never reach our server; Pyodide runs off the main thread (UI stays responsive).
5. **Grading correctness** - verify hidden-test grading accepts *alternative correct* solutions (no regex brittleness); unit tests for the grader + FSRS; a Playwright e2e test of the full loop.
6. **Telemetry** - confirm `events` capture TTFS and drop-off so the mitigation loop has data.
7. **Concept dogfood** - run the first Python course end-to-end; verify the learner writes/reads code at every step (no long passive stretches) and scaffolding visibly fades.

---

## Sources

**User-provided:** *Coding Platform Research Strategy.pdf* (in repo) - cognitive load, PRIMM, Parsons/faded examples, tiered WASM execution (MicroPython/Pyodide/WebContainers/Judge0), expert curricular depth, 5-phase Socratic AI, SDT gamification, telemetry. Its own works-cited list (68 refs) covers the primary literature.

**My web research:**
- Pedagogy: [Active Learning in CS Education - systematic review (MDPI)](https://www.mdpi.com/2414-4088/8/6/50)
- Retrieval/spacing: [Evidence for Active Recall & Spaced Repetition](https://recallify.ai/evidence-for-active-recall-and-spaced-repetition/)
- Platforms: [freeCodeCamp vs Codecademy (BitDegree)](https://www.bitdegree.org/tutorials/freecodecamp-vs-codecademy) · [Boot.dev/Exercism alternatives](https://blog.boot.dev/misc/code-academy-alternatives/)
- Tutorial hell: [7 reasons people quit coding (DEV)](https://dev.to/educative/7-reasons-people-quit-learning-to-code-how-to-avoid-them-26k5) · [Why you're stuck in tutorial hell (AlgoCademy)](https://algocademy.com/blog/why-youre-stuck-in-tutorial-hell-even-after-completing-10-courses/)
- Execution/editors: [Pyodide](https://pyodide.org/) · [Monaco vs CodeMirror 6 (PkgPulse)](https://www.pkgpulse.com/guides/monaco-editor-vs-codemirror-6-vs-sandpack-in-browser-2026)
- AI tutoring: [10 Best Practices for AI Tutoring (Estha)](https://estha.ai/blog/10-best-practices-for-ai-tutoring-in-education-a-complete-implementation-guide/)

# Gemini task: Expert / Advanced tracks

This is a standalone work order for Gemini (Antigravity) to author **expert-tier
curriculum content** for the languages that already exist in dreamcode (Python,
JavaScript, C#, TypeScript). Claude writes this spec and verifies the result; you
(Gemini) produce the content to the exact data shapes below. Do not invent new
systems or UI - you are adding rows to existing typed arrays.

Read `PROJECT.md` first for the full picture, and `AGENTS.md` for the framework
note. You are NOT writing framework code here, only typed data + (for C#) quizzes.

---

## 0. Hard guardrails (do not regress)

- **Voice - "no AI tells" (strict).** No em dashes, no en dashes, no single-char
  ellipsis character, no Unicode minus, no decorative emoji. Use plain hyphens,
  periods, and commas only. Functional glyphs already in the data (check marks,
  arrows on buttons) are fine. This applies to every string you write: titles,
  intros, blurbs, tips, quiz prompts, explanations.
- **Learner runs real code at every step** for runnable languages (Python, JS,
  TS). Every runnable lesson has editable `starter` code that actually runs.
- **C# stays read + quiz** (`runnable: false` + a `quiz`) because there is no
  client-side C# runtime. Do not write runnable C# lessons.
- **Practice "predict" answers must be executed and confirmed**, not guessed.
  Before you mark a `predictOptions` entry `correct: true`, actually run the
  `predictCode` (Python via real CPython, JS/TS via node) and use the true output.
- **Keep it green.** After your changes, `npx tsc --noEmit`, `npm run build`, and
  `npx eslint src` must all pass (eslint may keep its existing warnings; 0 errors).
- Do not touch auth, RLS, the `/api/*` routes, security headers, or the runners.

## 1. Where things live (current counts)

All content is typed data in two files:

- `src/lib/curriculum.ts` - the `lessons: Lesson[]` array (lessons, by track).
  Today: Python 44, JavaScript 25, C# 21, TypeScript 14 lessons. Modules per
  track: Python 11, JS 7, C# 6, TS 4. `getModules(track)` groups lessons into
  modules in `order`, so a new module appears automatically once its lessons exist.
- `src/lib/data.ts` - `challenges` (graded code capstones), `moduleChallenges`
  (module name -> challenge slug), and `practiceDatasets` (Parsons + faded +
  predict drills, keyed by a lesson's `practiceSlug`).

## 2. The exact data shapes (copy these, fill every field)

### Lesson (runnable: Python / JavaScript / TypeScript)

```ts
{
  slug: "py-expert-descriptors",          // unique, kebab-case, track-prefixed
  order: 45,                               // continue the track's existing numbering
  chapter: "Python Expert - Chapter 12",
  kicker: "PYTHON EXPERT",
  title: "Descriptors and the attribute protocol",
  catalogTitle: "Descriptors",            // short, for catalog + journey node
  blurb: "Control attribute access with __get__ and __set__.",
  catalogCode: "def __get__(self, obj, owner): ...",
  intro: "A **descriptor** is an object that defines how attribute access works ...", // supports **bold**
  example: `class Positive:\n    def __set__(self, obj, value): ...`,  // read-only worked example
  reads: [                                 // "how it reads" bullets, support **bold**
    { dot: "#ffb6d9", text: "**__set__** runs whenever the attribute is assigned" },
    { dot: "#a9ecc9", text: "Descriptors live on the **class**, not the instance" },
  ],
  tip: "Reach for descriptors when many attributes share the same validation.",
  starter: `# implement a Positive descriptor that rejects negatives\n...`,
  practiceSlug: "py-expert-descriptors",   // must match a practiceDatasets key (see below)
  language: "python",                       // python | javascript | typescript
  module: "Python Expert",                  // the module label (groups the section)
  tier: "expert",                           // beginner | intermediate | advanced | expert
}
```

Dot colors used elsewhere: pink `#ffb6d9`, mint `#a9ecc9`, lavender `#cdb9f7`.
Cycle them for visual variety. `runnable` defaults to true, so omit it for
Python/JS/TS.

### Lesson (C# - read + quiz, NOT runnable)

```ts
{
  slug: "cs-expert-spans",
  order: 22,
  chapter: "C# Expert - Chapter 7",
  kicker: "C# EXPERT",
  title: "Span<T> and stack-only memory",
  catalogTitle: "Spans",
  blurb: "Slice memory without allocating, using Span<T>.",
  catalogCode: "Span<int> nums = stackalloc int[4];",
  intro: "A **Span<T>** is a view over contiguous memory ...",
  example: `Span<int> nums = stackalloc int[4];\nnums[0] = 1;`,
  reads: [ { dot: "#ffb6d9", text: "**stackalloc** puts the buffer on the stack" } ],
  tip: "Span<T> cannot live on the heap, so it cannot be a field of a class.",
  starter: `// read-only example above; answer the quiz below`,  // shown but not run
  language: "csharp",
  module: "C# Expert",
  tier: "expert",
  runnable: false,
  quiz: [
    {
      prompt: "Where does stackalloc place its buffer?",
      options: ["On the stack", "On the heap", "In a static field", "In the GC nursery"],
      answer: 0,                              // index into options of the correct one
      explain: "stackalloc allocates on the current stack frame, so it is freed on return.",
    },
    // 2 to 4 questions per lesson
  ],
}
```

### Section challenge (runnable tracks only) - in `data.ts`

Every runnable expert module should end with one graded capstone. Add a `Challenge`
and map it.

```ts
// in `challenges` (an object keyed by slug):
"py-expert-descriptor-cap": {
  slug: "py-expert-descriptor-cap",
  name: "Bounded Field",
  level: "Advanced",                         // "Beginner" | "Intermediate" | "Advanced"
  language: "Python",                        // "Python" | "JavaScript" | "TypeScript" (capitalized)
  xp: 70,
  blurb: "Write a descriptor that clamps a value into a range.",
  instructions: "Implement a `Bounded` descriptor ...\n\nThen define `make(lo, hi, v)` that ...",
  starter: `class Bounded:\n    # your code\n\ndef make(lo, hi, v):\n    ...`,
  functionName: "make",                      // the function the tests call
  testCases: [                               // real, executed assertions
    { label: "clamps high", args: [0, 10, 15], expected: 10 },
    { label: "clamps low",  args: [0, 10, -3], expected: 0 },
    { label: "passes through", args: [0, 10, 5], expected: 5 },
  ],
},

// and register it so the journey map + lesson CTA show it:
// in `moduleChallenges`:
"Python Expert": "py-expert-descriptor-cap",
```

Notes on challenges:
- `args` are spread into the function; `expected` is compared with deep JSON
  equality. Keep returns JSON-serializable (numbers, strings, arrays, plain objects).
- TypeScript challenges are transpiled then run, and now also semantically
  type-checked, so the `starter` must be valid TypeScript that type-checks once
  completed correctly.
- C# modules get NO challenge (they keep quizzes). Do not add C# to `challenges`.

### Practice dataset (one per runnable lesson) - in `data.ts`

Keyed by the lesson's `practiceSlug`:

```ts
"py-expert-descriptors": {
  prompt: "Reassemble a Positive descriptor.",
  parsonsFragments: [                        // shuffled lines the learner orders
    { id: "a", code: "class Positive:" },
    { id: "b", code: "    def __set__(self, obj, value):" },
    // ...
  ],
  fadedPrompt: "Fill the blanks to validate the value.",
  fadedLines: [
    { text: "def __set__(self, obj, ___):", blanks: ["value"] },
  ],
  fadedExplain: "____ holds the value being assigned.",
  predictCode: "p = Positive()\n# ... code whose output you must PREDICT",
  predictQuestion: "What does this print?",
  predictOptions: [                          // exactly one correct, each with a why
    { id: "a", label: "10", correct: true,  why: "The setter stored 10 because it is positive." },
    { id: "b", label: "ValueError", correct: false, why: "10 is positive, so no error is raised." },
  ],
}
```

`ParsonsFragment` is `{ id: string; code: string }`. Exactly one `predictOptions`
entry is `correct: true`, and you must have executed `predictCode` to know it.

## 3. Scope to produce

For each language, add a coherent **Expert** module (and an **Advanced** module
first if the jump from the current top tier is too steep). Suggested shape:

- **Python Expert:** descriptors, metaclasses, `__slots__`, context managers from
  scratch, coroutines/async internals, the GIL and concurrency model, memory model.
- **JavaScript Expert:** the event loop in depth, generators + async iterators,
  Proxy/Reflect, prototype internals, modules + closures-as-state, performance.
- **TypeScript Expert:** conditional + mapped types, template literal types,
  variance, `infer`, branded types, declaration merging, type-level programming.
- **C# Expert (read + quiz):** `Span<T>`/`Memory<T>`, `ref struct`, async internals
  (`ValueTask`, state machines), expression trees, source generators, GC tuning.

Aim for 6 to 10 lessons per expert module. Each runnable lesson needs its practice
dataset; each runnable module needs its section challenge. Number `order` to
continue each track's existing sequence (do not renumber existing lessons).

## 4. Step by step

1. Pick one track. Read 3 to 4 of its existing top-tier lessons in
   `curriculum.ts` to match tone, structure, and difficulty curve.
2. Draft the module's lesson list (titles + one-line goals) before writing bodies.
3. Write each `Lesson` object, appended to the `lessons` array, with a unique
   `slug` and continuing `order`. Set `module` to the new module name and `tier`.
4. For runnable lessons, add the matching `practiceDatasets[practiceSlug]`. RUN
   each `predictCode` and use the real output for the correct option.
5. For runnable modules, add the section `Challenge` to `challenges` and the
   `moduleChallenges` mapping. RUN the `testCases` against a correct solution to
   confirm they pass and are non-trivial.
6. For C#, write `runnable: false` lessons with a 2 to 4 question `quiz` each.
7. Re-read everything for voice violations (dashes, ellipses, emoji).
8. Run `npx tsc --noEmit`, `npm run build`, `npx eslint src`. Fix any errors.

## 5. Acceptance criteria (Claude will verify)

- `tsc`, `build`, `eslint` all clean (0 errors).
- New modules appear on `/lessons` and `/journey` for the right track, grouped
  with correct tier badges, in the intended order.
- Every runnable expert lesson runs its `starter`; every runnable module's
  section challenge node appears on `/journey` and its tests pass on a correct
  solution and fail on a wrong one.
- Every runnable lesson has a working practice flow; every predict answer matches
  real execution.
- C# expert lessons render the read + quiz view and award XP on a correct quiz.
- Zero "AI tells" in any new string.

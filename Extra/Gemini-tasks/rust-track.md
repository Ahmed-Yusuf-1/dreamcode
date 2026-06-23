# Gemini task: Add a Rust track (full, beginner to advanced)

A standalone work order for Gemini (Antigravity) to add **Rust** as a fifth
language track in dreamcode, with a full curriculum from beginner to advanced,
including assessments. Claude writes this spec and verifies the result.

Read `PROJECT.md` first, and `AGENTS.md` (this is Next.js 16 with real breaking
changes - read the bundled docs before touching any component/page code).

---

## 0. The key constraint: Rust cannot run in the browser

There is no client-side Rust runtime (the way Pyodide runs Python and `new
Function` runs JS/TS). So Rust follows the **exact model C# already uses**:

- Lessons are **read + quiz** (`runnable: false` + a `quiz`), not editable runners.
- "Challenges / problems" for Rust are **quiz-based** capstones inside lessons.
  Do NOT add Rust to `data.ts` `challenges` / `moduleChallenges` (those execute
  code and would silently fail). Do NOT add runnable Rust projects or peaks.
- Runnable Rust code (real `cargo`-style execution, graded code challenges) is a
  FUTURE upgrade that needs a server-side sandbox - the same deferred item tracked
  for C# in `PLAN.md` section 3. Note it; do not build it here.

Study the existing C# lessons in `src/lib/curriculum.ts` (search `language:
"csharp"`, e.g. slugs starting `cs-`) - they are your template for shape, tone,
and quiz style.

## 1. Hard guardrails (do not regress)

- **Voice - "no AI tells" (strict).** No em dashes, en dashes, single-char
  ellipsis, Unicode minus, decorative emoji. Plain hyphens, periods, commas only.
- Keep it green: after changes, `npx tsc --noEmit`, `npm run build`, and
  `npx eslint src` must pass (0 errors; existing warnings may remain).
- Do not touch auth, RLS, `/api/*`, security headers, or the code runners.
- The product name stays **dreamcode**. Match the existing dusk/neon theme; do not
  add new colors or UI patterns - you are adding data + a couple of small edits.

## 2. Code edits to register the track (small, enumerated)

These are the ONLY framework/code edits. Make exactly these, nothing more.

1. **`src/lib/track.ts`** - add `"rust"` to the union and the list:
   ```ts
   export type Track = "python" | "javascript" | "csharp" | "typescript" | "rust";
   const TRACKS: Track[] = ["python", "javascript", "csharp", "typescript", "rust"];
   ```

2. **`src/lib/curriculum.ts`** - widen `Lesson.language`:
   ```ts
   language?: "python" | "javascript" | "csharp" | "typescript" | "rust";
   ```
   (Then add the Rust lessons to the `lessons` array - section 3.)

3. **`src/app/lessons/page.tsx`** - add a fifth tab button after the TypeScript
   button, matching the others exactly (the tab bar already wraps on mobile, so a
   fifth tab is fine):
   ```tsx
   <button
     onClick={() => setTrack("rust")}
     style={{
       background: track === "rust" ? "#ffffff" : "transparent",
       color: track === "rust" ? "#13335f" : "rgba(255,255,255,.85)",
       fontWeight: 900, fontSize: 14, padding: "10px 24px", borderRadius: 999,
       cursor: "pointer", transition: "all .25s ease", border: "none",
       boxShadow: track === "rust" ? "0 4px 15px rgba(255,255,255,.2)" : "none",
     }}
   >
     Rust (Systems)
   </button>
   ```

4. **`src/app/journey/page.tsx`** (optional polish) - the journey already builds
   generically from `getModules`/lessons filtered by track, and the boss "project"
   node falls back to a generic label, so Rust works with no change. If you want a
   themed label, extend the `chapterLabel` / `projectLabel` ternaries near the top
   of the component to include a `track === "rust"` case. Keep it read-only safe.

No other code changes. The dashboard, journey, placement, and "next lesson"
routing all read the active track generically and already handle a quiz-only track
(C# proves this).

## 3. The Rust curriculum (content - the bulk of the work)

Add Rust lessons to the `lessons` array in `curriculum.ts`, using the **read +
quiz** Lesson shape. Copy this shape and fill every field:

```ts
{
  slug: "rust-ownership",                  // unique, kebab-case, "rust-" prefixed
  order: 1,                                 // Rust's own sequence starts at 1
  chapter: "Rust Basics - Chapter 1",
  kicker: "RUST BASICS",
  title: "Ownership and moves",
  catalogTitle: "Ownership",
  blurb: "Every value has one owner; assigning it moves it.",
  catalogCode: "let s2 = s1; // s1 is moved",
  intro: "Rust has no garbage collector. Instead each value has a single **owner** ...", // **bold** ok
  example: `fn main() {\n    let s1 = String::from(\"sky\");\n    let s2 = s1; // s1 moved\n    println!(\"{}\", s2);\n}`,
  reads: [
    { dot: "#ffb6d9", text: "Assigning a String **moves** ownership, it does not copy" },
    { dot: "#a9ecc9", text: "After a move the original name is no longer usable" },
  ],
  tip: "Types that are cheap to copy (like integers) are Copy, so they do not move.",
  starter: `// read the example above, then answer the quiz`,  // shown, not run
  language: "rust",
  module: "Rust Basics",                    // groups the section on /lessons + /journey
  tier: "beginner",                          // beginner | intermediate | advanced | expert
  runnable: false,
  quiz: [
    {
      prompt: "After `let s2 = s1;` where s1 is a String, what happens to s1?",
      options: ["It is moved and can no longer be used", "It is copied", "It is borrowed", "It is dropped immediately"],
      answer: 0,                              // index of the correct option
      explain: "String does not implement Copy, so the assignment moves ownership to s2.",
    },
    // 2 to 4 questions per lesson; one quiz acts as that lesson's check.
  ],
}
```

Dot colors: pink `#ffb6d9`, mint `#a9ecc9`, lavender `#cdb9f7` (cycle them).

### Suggested module path (beginner -> advanced)

Aim for roughly 6 to 9 lessons per module, each with a 2 to 4 question quiz.

- **Rust Basics:** variables + `mut`, primitive types, functions, `println!`,
  control flow, ownership, references and borrowing, slices.
- **Rust Structs & Enums:** structs, methods/`impl`, enums, `Option`, `match`,
  pattern matching, `Result` and `?`.
- **Rust Collections & Generics:** `Vec`, `String` vs `&str`, `HashMap`,
  iterators + closures, generics, traits, trait bounds.
- **Rust Advanced:** lifetimes, error handling patterns, smart pointers
  (`Box`, `Rc`, `RefCell`), concurrency (`thread`, `Arc`, channels), `unsafe`
  basics, modules + crates.

End each module with one lesson whose quiz is a slightly harder **capstone check**
(3 to 4 questions that combine the module's ideas). That is the Rust equivalent of
a "section challenge" given there is no code execution.

## 4. Step by step

1. Make the four code edits in section 2 first; confirm `tsc` still passes.
2. Read 4 to 5 existing C# (`cs-`) lessons to match structure, difficulty ramp,
   and quiz phrasing.
3. Draft the full lesson list (titles + one-line goals) across the four modules
   before writing bodies, so the difficulty curve is smooth.
4. Write each `Lesson` object into the `lessons` array. Keep Rust's `order`
   sequential within Rust (start at 1; it is independent of other tracks).
5. Make every `example` a correct, idiomatic, compilable Rust snippet (even though
   it is not executed here, it must be accurate - learners will copy it).
6. Write 2 to 4 quiz questions per lesson; make exactly one `answer` correct and
   write a teaching `explain` for it.
7. Re-read for voice violations (dashes, ellipses, emoji) and for Rust accuracy.
8. Run `npx tsc --noEmit`, `npm run build`, `npx eslint src`. Fix any errors.

## 5. Acceptance criteria (Claude will verify)

- `tsc`, `build`, `eslint` clean (0 errors).
- A **Rust** tab appears on `/lessons`; selecting it shows the Rust modules with
  correct tier badges and order, and `/journey` renders the Rust road.
- Rust lessons render the **read + quiz** view (no code editor); passing a lesson
  quiz awards XP and completes the stop, exactly like C#.
- Every Rust `example` is valid, idiomatic Rust; every quiz has exactly one correct
  answer with a correct `explain`.
- No Rust entries were added to `challenges` / `moduleChallenges` / `peaks` /
  `projects` (those execute code).
- Zero "AI tells" in any new string.

## 6. Note for the owner / Claude (not Gemini)

Once a server-side sandbox exists (PLAN.md section 3), Rust can be upgraded from
read + quiz to a real runnable track: flip lessons to `runnable: true` with real
`starter` code, add graded `challenges` with `testCases`, and widen the
`Challenge` / `Project` / `Peak` language unions to include Rust.

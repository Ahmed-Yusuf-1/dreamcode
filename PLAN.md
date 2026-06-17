# Dreamcode - Plan (what is left to build)

Current state lives in `PROJECT.md`. This file is only the forward plan. As things
ship, move them out of here. The deeper pedagogy research is in
`Extra/Coding Platform Research Strategy.pdf`.

**Guardrails (do not regress these):** the learner writes and runs real code at
every step; concepts come back via spaced review (FSRS); the AI guide asks
questions, never hands over answers; keep the "no AI tells" writing voice; runtime
DB access stays RLS-scoped (no ORM on a direct connection).

---

## Next up (priority order)

1. **Confirm the backend end to end** (after the Supabase setup in PROJECT.md).
   Sign up, earn XP / complete a stop / pass a challenge while logged in, then
   reload and on a second device: progress, streak, badges, and FSRS due dates
   should persist server-side. Fix any sync gaps in `profile.ts` / `srs.ts` /
   `track.ts`.

2. **AI guide as the paid feature (the headline monetization).** Wire `DreamGuide`
   to the Claude API: opt-in, hint-only, graduated hints (question -> nudge ->
   worked analogy, never the full answer), XP-costed. Gate it behind
   `profiles.tier = 'pro'`. This replaces the current scripted demo.

3. **Content depth.** More Python and JavaScript lessons/practice/challenges to
   fill out the chapters, using the existing `curriculum.ts` / `data.ts` schemas.
   Add the **TypeScript** track.

4. **Make the journey map dynamic** from `curriculum.ts`. It is still a hand-built
   4-node map and does not show newer lessons (lists, dictionaries, the JS track).

5. **Accessibility + i18n pass** (focus states, alt text, keyboard nav,
   reduced-motion; groundwork for translations).

---

## Later / backlog

- **Billing** (e.g. Stripe) to actually sell the `pro` tier that gates the AI guide.
- **Telemetry**: an events table + time-to-first-success / drop-off tracking, to
  drive curriculum improvements.
- **Server-side sandbox** (Judge0-style) for multi-file or advanced challenges that
  cannot run client-side.
- **Expert tracks** (metaprogramming, concurrency, internals) for both languages.
- **Community / imported content** support.
- **Institutional/admin** direction (class dashboards, standards alignment) if the
  audience ever expands past individual learners.

---

## Suggested ownership

- **Claude (architectural / security-sensitive):** AI-hint integration + tier
  gating, billing, telemetry events schema, server-side sandbox.
- **Gemini / Antigravity (content + UI, parallel):** content depth, TypeScript
  track, dynamic journey map, accessibility, visual polish.

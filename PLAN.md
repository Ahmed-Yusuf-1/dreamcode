# Dreamcode - Plan (what is left to build)

Current state lives in `PROJECT.md`. This file is only the forward plan.
**Update this file after each implementation chunk**; as things ship, remove them
from here. The deeper pedagogy research is in
`Extra/Coding Platform Research Strategy.pdf`.

**Guardrails (do not regress these):** the learner writes and runs real code at
every step; concepts come back via spaced review (FSRS); the AI guide asks
questions, never hands over answers; keep the "no AI tells" writing voice; runtime
DB access stays RLS-scoped (no ORM on a direct connection). Product name stays
**dreamcode** (the domain is dreamcoder.dev; no rename).

---

## Now: content + environment (the focus before the final monetization step)

1. **Custom domain (dreamcoder.dev) - code done.** Site URL is env-driven
   (`NEXT_PUBLIC_SITE_URL` -> `metadataBase` / Open Graph); auth + Spotify redirects
   follow the live origin. **Remaining (owner, external dashboards):** add
   `https://dreamcoder.dev` alongside localhost in Supabase Auth (Site URL +
   redirect), the Google and GitHub OAuth apps, and the Spotify app redirect URI.
   See PROJECT.md "Custom domain".

2. **Content depth.** More Python and JavaScript lessons/practice/challenges to
   fill out the chapters, using the existing `curriculum.ts` / `data.ts` schemas.
   Add the **TypeScript** track. (The journey map is now generated from
   `curriculum.ts`, so new lessons appear on it automatically.)

3. **Accessibility, SEO, and polish pass** (focus states, alt text, keyboard nav,
   reduced-motion, page-level metadata; groundwork for i18n / translations).

4. **Confirm the backend end to end** (after the Supabase setup in PROJECT.md).
   Sign up, earn XP / complete a stop / pass a challenge while logged in, then
   reload and on a second device: progress, streak, badges, and FSRS due dates
   should persist server-side. Fix any sync gaps in `profile.ts` / `srs.ts` /
   `track.ts`.

---

## Final (do these last, at the owner's direction)

- **Plug in the AI provider.** The Dream Guide is fully built and provider-agnostic
  (`src/lib/ai/guide.ts` + `/api/guide`). Switch it on by setting `AI_PROVIDER` /
  `AI_API_KEY` / `AI_MODEL` in `.env.local` (gemini | openai | anthropic).
- **Billing** (e.g. Stripe) to actually sell the `pro` tier, then set
  `GUIDE_REQUIRE_PRO=true` to gate the AI guide behind it.

---

## Later / backlog

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

- **Claude (architectural / security-sensitive):** AI-hint integration (done),
  billing, telemetry events schema, server-side sandbox, domain/environment config.
- **Gemini / Antigravity (content + UI, parallel):** content depth, TypeScript
  track, dynamic journey map, accessibility, visual polish.

import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/supabase/server";
import { getFullProfile } from "@/lib/supabase/data";
import { isGuideConfigured, buildSystemPrompt, generateHint, GuideError } from "@/lib/ai/guide";

const BodySchema = z.object({
  problem: z.object({
    title: z.string().min(1).max(200),
    instructions: z.string().max(4000).optional(),
    functionName: z.string().max(120).optional(),
    language: z.string().max(40).optional(),
    kind: z.string().max(40).optional(),
  }),
  code: z.string().max(8000).optional().default(""),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

export async function POST(request: Request) {
  // 1. Live gate for now: must be signed in (protects the model key / cost).
  if (!(await getUser())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2. Parked pro gate. Off by default; set GUIDE_REQUIRE_PRO=true at launch to
  //    sell the guide as the Pro feature. No client change needed to flip it.
  if (process.env.GUIDE_REQUIRE_PRO === "true") {
    const profile = await getFullProfile();
    if (!profile || profile.tier !== "pro") {
      return NextResponse.json({ error: "upgrade_required" }, { status: 403 });
    }
  }

  // 3. No provider wired up yet -> tell the client to show the "not on" state.
  if (!isGuideConfigured()) {
    return NextResponse.json({ error: "guide_unconfigured" }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", issues: parsed.error.issues }, { status: 400 });
  }

  const { problem, code, messages } = parsed.data;
  const system = buildSystemPrompt(problem, code);

  try {
    const reply = await generateHint({ system, messages });
    return NextResponse.json({ reply });
  } catch (e) {
    if (e instanceof GuideError) {
      return NextResponse.json({ error: "guide_failed", detail: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "guide_failed" }, { status: 502 });
  }
}

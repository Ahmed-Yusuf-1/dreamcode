import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbContext, recordSubmission } from "@/lib/supabase/data";
import { rateLimit } from "@/lib/rateLimit";

const Schema = z
  .object({
    slug: z.string().min(1).max(100),
    code: z.string().max(20000),
    passed: z.boolean(),
  })
  .strict();

/** Record a code submission for the current user. */
export async function POST(request: Request) {
  const ctx = await getDbContext();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const limited = rateLimit(`submit:${ctx.user.id}`, { limit: 60, windowMs: 60_000 });
  if (!limited.ok) return NextResponse.json({ error: "rate limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });
  const ok = await recordSubmission(ctx, parsed.data.slug, parsed.data.code, parsed.data.passed);
  return NextResponse.json({ ok });
}

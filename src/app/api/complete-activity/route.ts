import { NextResponse } from "next/server";
import { z } from "zod";
import { awardActivities, getDbContext, getFullProfile } from "@/lib/supabase/data";
import { rateLimit } from "@/lib/rateLimit";

const Schema = z
  .object({
    activityKey: z.string().min(1).max(140).optional(),
    /** Guest progress being merged into the account after sign-in. */
    activityKeys: z.array(z.string().min(1).max(140)).min(1).max(400).optional(),
    clientDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    localHour: z.number().int().min(0).max(23).optional(),
  })
  .strict()
  .refine((body) => !!body.activityKey !== !!body.activityKeys, { message: "send activityKey or activityKeys" });

/**
 * Completes one activity (or merges a batch of guest completions). The reward is
 * looked up server side; the client only names what it finished.
 */
export async function POST(request: Request) {
  const ctx = await getDbContext();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const limited = rateLimit(`complete:${ctx.user.id}`, { limit: 60, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json({ error: "rate limited" }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { activityKey, activityKeys, clientDate, localHour } = parsed.data;
  const keys = activityKeys ?? (activityKey ? [activityKey] : []);
  const awarded = await awardActivities(ctx, keys, { clientDate, localHour });
  return NextResponse.json({ awarded, profile: await getFullProfile(ctx) });
}

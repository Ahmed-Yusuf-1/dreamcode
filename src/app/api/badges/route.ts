import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/supabase/server";
import { unlockBadge } from "@/lib/supabase/data";

const Schema = z.object({ badgeId: z.string().min(1).max(100) });

/** Unlock a badge for the current user (idempotent). */
export async function POST(request: Request) {
  if (!(await getUser())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const ok = await unlockBadge(parsed.data.badgeId);
  return NextResponse.json({ ok });
}

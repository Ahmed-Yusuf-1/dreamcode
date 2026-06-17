import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/supabase/server";
import { recordSubmission } from "@/lib/supabase/data";

const Schema = z.object({
  slug: z.string().min(1).max(100),
  code: z.string().max(20000),
  passed: z.boolean(),
});

/** Record a code submission for the current user. */
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
  const ok = await recordSubmission(parsed.data.slug, parsed.data.code, parsed.data.passed);
  return NextResponse.json({ ok });
}

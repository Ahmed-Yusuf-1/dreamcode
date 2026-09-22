import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbContext, spendXp } from "@/lib/supabase/data";

const Schema = z.object({ amount: z.number().int().min(1).max(50) }).strict();

export async function POST(request: Request) {
  const ctx = await getDbContext();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });
  return NextResponse.json({ profile: await spendXp(ctx, parsed.data.amount) });
}

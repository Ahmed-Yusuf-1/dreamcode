import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbContext, getSrsCards, upsertSrsCard } from "@/lib/supabase/data";

export async function GET() {
  const ctx = await getDbContext();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ cards: await getSrsCards(ctx) });
}

const Schema = z
  .object({
    cardId: z.string().min(1).max(100),
    dueAt: z.string().datetime({ offset: true }),
    stability: z.number().min(0).max(36500),
    difficulty: z.number().min(0).max(10),
    reps: z.number().int().min(0).max(100000),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .strict();

/** Insert or update one SRS card's scheduling state. */
export async function PUT(request: Request) {
  const ctx = await getDbContext();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
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
  const ok = await upsertSrsCard(ctx, parsed.data);
  return NextResponse.json({ ok });
}

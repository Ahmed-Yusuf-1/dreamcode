import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/supabase/server";
import { getSrsCards, upsertSrsCard } from "@/lib/supabase/data";

export async function GET() {
  if (!(await getUser())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ cards: await getSrsCards() });
}

const Schema = z.object({
  cardId: z.string().min(1).max(100),
  dueAt: z.string().max(40),
  stability: z.number(),
  difficulty: z.number(),
  reps: z.number().int().min(0),
  updatedAt: z.string().max(40).optional(),
});

/** Insert or update one SRS card's scheduling state. */
export async function PUT(request: Request) {
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
  const ok = await upsertSrsCard(parsed.data);
  return NextResponse.json({ ok });
}

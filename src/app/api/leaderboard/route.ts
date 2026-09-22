import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbContext, getLeaderboard, getLeaderboardStanding } from "@/lib/supabase/data";

const QuerySchema = z.object({
  scope: z.enum(["all", "week"]).default("all"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

/**
 * The public leaderboard. Anyone can read it, signed in or not: it carries only
 * handles, emblems and progress numbers, and only for learners who claimed a
 * handle and have not hidden themselves. A signed-in learner also gets their
 * own standing, so a place outside the top still shows.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse({
    scope: url.searchParams.get("scope") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "invalid query" }, { status: 400 });
  const { scope, limit } = parsed.data;

  const ctx = await getDbContext();
  const [rows, standing] = await Promise.all([
    getLeaderboard(ctx, scope, limit),
    ctx ? getLeaderboardStanding(ctx, scope) : Promise.resolve(null),
  ]);
  return NextResponse.json({ rows, standing, scope });
}

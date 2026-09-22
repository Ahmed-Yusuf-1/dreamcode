import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getDbContext,
  getFullProfile,
  HandleTakenError,
  setEmblem,
  setHandle,
  setLeaderboardHidden,
  updateProfile,
} from "@/lib/supabase/data";

export async function GET() {
  const ctx = await getDbContext();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ profile: await getFullProfile(ctx) });
}

const PatchSchema = z
  .object({
    name: z.string().trim().min(1).max(60).optional(),
    handle: z
      .string()
      .trim()
      .transform((value) => value.toLowerCase().replace(/^@/, ""))
      .pipe(z.string().regex(/^[a-z0-9_]{3,20}$/))
      .optional(),
    emblem: z.string().max(60).nullable().optional(),
    leaderboardHidden: z.boolean().optional(),
    settings: z
      .object({
        soundsEnabled: z.boolean().optional(),
        guideEnabled: z.boolean().optional(),
        remindersEnabled: z.boolean().optional(),
        activeTrack: z.enum(["python", "javascript", "typescript", "csharp"]).optional(),
      })
      .strip()
      .optional(),
  })
  .strict();

/**
 * Learners may change their display name, their preferences, and the three
 * things that make up their public identity: a handle, an emblem and whether
 * they appear on the leaderboard. Everything else is server-owned.
 */
export async function PATCH(request: Request) {
  const ctx = await getDbContext();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", issues: parsed.error.issues }, { status: 400 });
  }
  const { handle, emblem, leaderboardHidden, ...rest } = parsed.data;
  try {
    if (handle !== undefined) await setHandle(ctx, handle);
    if (emblem !== undefined) await setEmblem(ctx, emblem);
    if (leaderboardHidden !== undefined) await setLeaderboardHidden(ctx, leaderboardHidden);
  } catch (error) {
    if (error instanceof HandleTakenError) return NextResponse.json({ error: "handle taken" }, { status: 409 });
    if (error instanceof Error && /reserved handle/.test(error.message)) {
      return NextResponse.json({ error: "handle reserved" }, { status: 409 });
    }
    return NextResponse.json({ error: "could not save" }, { status: 400 });
  }
  if (Object.keys(rest).length === 0) return NextResponse.json({ profile: await getFullProfile(ctx) });
  return NextResponse.json({ profile: await updateProfile(ctx, rest) });
}

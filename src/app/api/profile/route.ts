import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/supabase/server";
import { getFullProfile, updateProfile } from "@/lib/supabase/data";

export async function GET() {
  if (!(await getUser())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ profile: await getFullProfile() });
}

const PatchSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  xp: z.number().int().min(0).optional(),
  streak: z.number().int().min(0).optional(),
  lastActiveDate: z.string().max(20).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export async function PATCH(request: Request) {
  if (!(await getUser())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
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
  return NextResponse.json({ profile: await updateProfile(parsed.data) });
}

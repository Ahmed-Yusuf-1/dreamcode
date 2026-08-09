import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/supabase/server";
import { awardActivity, getFullProfile } from "@/lib/supabase/data";
import { getActivityReward } from "@/lib/rewards";

const Schema = z.object({ activityKey: z.string().min(1).max(140) }).strict();

function localDateString() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

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

  const { activityKey } = parsed.data;
  const catalogReward = getActivityReward(activityKey);
  if (!catalogReward) {
    return NextResponse.json({ error: "unknown activity" }, { status: 400 });
  }

  if (activityKey.startsWith("review:") && activityKey.split(":")[1] !== localDateString()) {
    return NextResponse.json({ error: "review date must be today" }, { status: 400 });
  }

  const isLesson = !activityKey.includes(":") && catalogReward.xp === 15;
  const reward = {
    ...catalogReward,
    badgeIds: Array.from(new Set([
      ...catalogReward.badgeIds,
      ...(isLesson && new Date().getUTCHours() < 5 ? ["night-owl"] : []),
    ])),
  };
  const awarded = await awardActivity(activityKey, reward);
  return NextResponse.json({ awarded, profile: await getFullProfile() });
}

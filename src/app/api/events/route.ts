import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/supabase/server";
import { recordEvents, getEvents } from "@/lib/supabase/data";

export async function GET() {
  if (!(await getUser())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ events: await getEvents() });
}

const EventSchema = z.object({
  name: z.string().min(1).max(80),
  props: z.record(z.string(), z.unknown()).optional(),
});
const BodySchema = z.object({
  events: z.array(EventSchema).min(1).max(50),
});

/** Append a batch of telemetry events for the current user. */
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
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const ok = await recordEvents(parsed.data.events);
  return NextResponse.json({ ok });
}

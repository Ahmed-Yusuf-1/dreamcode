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

// Cap the serialized size of each event's `props` so a client cannot stuff
// arbitrarily large blobs into the append-only events table (storage abuse).
// 2 KB is generous for the small {slug, track, ...} payloads we actually send;
// combined with the 50-event batch cap that bounds a request to ~100 KB.
const MAX_PROPS_BYTES = 2048;

const EventSchema = z
  .object({
    name: z.string().min(1).max(80),
    props: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((e) => !e.props || JSON.stringify(e.props).length <= MAX_PROPS_BYTES, {
    message: "props too large",
    path: ["props"],
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

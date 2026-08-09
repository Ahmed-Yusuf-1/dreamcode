import { NextResponse } from "next/server";

/** Badge writes are evaluated by /api/complete-activity or submission rules. */
export async function POST() {
  return NextResponse.json(
    { error: "Direct badge unlocks are not allowed" },
    { status: 410 },
  );
}

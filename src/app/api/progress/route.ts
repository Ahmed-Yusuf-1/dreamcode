import { NextResponse } from "next/server";

/** Completion writes must pass the server-owned reward/activity catalog. */
export async function POST() {
  return NextResponse.json(
    { error: "Use the validated activity completion endpoint" },
    { status: 410 },
  );
}

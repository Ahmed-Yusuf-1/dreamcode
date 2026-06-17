import { NextResponse } from "next/server";

/**
 * Route handler to dynamically expose the Spotify Client ID from the server environment.
 * This guarantees the client ID is resolved dynamically at runtime in production.
 */
export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
  return NextResponse.json({ clientId });
}

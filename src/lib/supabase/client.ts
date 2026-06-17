"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Browser-side Supabase client (for use in client components: auth, optimistic
 * reads). Safe to call repeatedly; @supabase/ssr handles cookie-based sessions.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

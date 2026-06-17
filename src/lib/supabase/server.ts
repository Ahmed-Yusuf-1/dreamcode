import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

/**
 * Server-side Supabase client for Server Components, Route Handlers, and Server
 * Actions. Reads/writes the session from cookies (Next 16: `cookies()` is async).
 * All queries run with the logged-in user's session, so Row-Level Security
 * enforces that a user can only touch their own rows.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where setting cookies is not allowed.
          // The session refresh in proxy.ts handles writing cookies instead.
        }
      },
    },
  });
}

/** Returns the authenticated user, or null. Always verifies with Supabase. */
export async function getUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

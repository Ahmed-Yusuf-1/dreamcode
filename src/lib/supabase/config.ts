/**
 * Supabase configuration. Reads the public env vars and exposes a guard so the
 * rest of the app can keep working (in localStorage-only mode) until the keys
 * are filled in. Once `.env.local` is set, auth and server persistence turn on.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

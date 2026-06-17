import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Next 16 "Proxy" (formerly Middleware). Refreshes the Supabase auth session on
 * each request so server components and route handlers see a valid user. No-ops
 * entirely until Supabase is configured, so the app keeps working before setup.
 */
export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Refresh the session. Do not run other logic between client creation and this.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Run on everything except static assets, images, and the Pyodide worker.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|pyodide-worker.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { NextResponse } from "next/server";
import { z } from "zod";
import * as ts from "typescript";
import { rateLimit, clientIp, rateLimitHeaders } from "@/lib/rateLimit";
import { typeCheckErrors } from "@/lib/tsCheck";

// TypeScript can't run in the browser, so we strip its types to plain JS here
// (server-side, where the already-installed `typescript` package runs natively)
// and the client runs the emitted JS in the same in-browser engine the JavaScript
// track uses. This is a pure string->string transform: no code is executed on the
// server, so untrusted input is safe. It is type-STRIPPING (transpileModule), not a
// full type-check - syntax errors are reported; semantic type errors are not caught.
export const runtime = "nodejs";

const Schema = z.object({ code: z.string().max(20000) });

export async function POST(request: Request) {
  // Public + CPU-bound: cap per-IP throughput so it cannot be used to burn CPU.
  // Generous for normal use (the client transpiles on each Run, not per keystroke).
  const limit = rateLimit(`transpile:${clientIp(request)}`, { limit: 30, windowMs: 10_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: rateLimitHeaders(limit.retryAfter) },
    );
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

  const result = ts.transpileModule(parsed.data.code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      removeComments: false,
    },
    reportDiagnostics: true,
  });

  // Syntax errors from the transform itself.
  const syntax = (result.diagnostics ?? []).map((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, "\n"),
  );

  // Only run the (heavier) semantic type-check when the code parses cleanly -
  // type-checking broken syntax just produces noise. Type errors block running
  // the same way syntax errors do, so the TS track now genuinely catches them.
  const typeErrors = syntax.length === 0 ? typeCheckErrors(parsed.data.code) : [];

  return NextResponse.json({
    js: result.outputText,
    diagnostics: [...syntax, ...typeErrors],
  });
}

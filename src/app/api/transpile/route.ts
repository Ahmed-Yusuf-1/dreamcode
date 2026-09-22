import { NextResponse } from "next/server";
import { z } from "zod";
import * as ts from "typescript";
import { rateLimit, clientIp, rateLimitHeaders } from "@/lib/rateLimit";
import { formatDiagnostic, typeCheckErrors } from "@/lib/tsCheck";
import { guardLoops } from "@/lib/loopGuard";

// TypeScript can't run in the browser, so we strip its types to plain JS here
// (server-side, where the already-installed `typescript` package runs natively)
// and the client runs the emitted JS in the same in-browser engine the JavaScript
// track uses. This is a pure string->string transform plus a semantic type-check:
// no learner code is ever executed on the server, so untrusted input is safe.
export const runtime = "nodejs";

const Schema = z
  .object({
    code: z.string().max(20000),
    /** "javascript" skips type checking; used by the DOM preview. */
    language: z.enum(["typescript", "javascript"]).optional(),
    /** Instrument loops so a runaway loop stops itself (DOM preview). */
    guardLoops: z.boolean().optional(),
  })
  .strict();

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

  if (parsed.data.language === "javascript") {
    const guarded = guardLoops(parsed.data.code);
    return NextResponse.json({ js: guarded.js, diagnostics: guarded.diagnostics });
  }

  const result = ts.transpileModule(parsed.data.code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      removeComments: false,
    },
    fileName: "input.ts",
    reportDiagnostics: true,
  });

  // Syntax errors from the transform itself.
  const syntax = (result.diagnostics ?? []).map(formatDiagnostic);

  // Only run the (heavier) semantic type-check when the code parses cleanly -
  // type-checking broken syntax just produces noise. Type errors block running
  // the same way syntax errors do, so the TS track now genuinely catches them.
  const typeErrors = syntax.length === 0 ? typeCheckErrors(parsed.data.code) : [];

  const diagnostics = [...syntax, ...typeErrors];
  const js = parsed.data.guardLoops && diagnostics.length === 0 ? guardLoops(result.outputText).js : result.outputText;
  return NextResponse.json({ js, diagnostics });
}

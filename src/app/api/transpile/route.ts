import { NextResponse } from "next/server";
import { z } from "zod";
import * as ts from "typescript";

// TypeScript can't run in the browser, so we strip its types to plain JS here
// (server-side, where the already-installed `typescript` package runs natively)
// and the client runs the emitted JS in the same in-browser engine the JavaScript
// track uses. This is a pure string->string transform: no code is executed on the
// server, so untrusted input is safe. It is type-STRIPPING (transpileModule), not a
// full type-check - syntax errors are reported; semantic type errors are not caught.
export const runtime = "nodejs";

const Schema = z.object({ code: z.string().max(20000) });

export async function POST(request: Request) {
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

  const diagnostics = (result.diagnostics ?? []).map((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, "\n"),
  );

  return NextResponse.json({ js: result.outputText, diagnostics });
}

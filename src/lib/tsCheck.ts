import * as ts from "typescript";

/**
 * Server-side semantic type-checker for the TypeScript track.
 *
 * `/api/transpile` only type-STRIPS (transpileModule), so until now the editor
 * could not catch real type errors - a TS lesson that says "types are checked
 * before running" was not actually true. This adds a genuine type-check using the
 * already-bundled `typescript` package (no new external dependency, no client CDN).
 *
 * Lenient on purpose: `strict` and `noImplicitAny` are OFF so a beginner who omits
 * an annotation is not nagged, while genuine mistakes (assigning a string to a
 * number, calling a method that does not exist, wrong argument types) are caught.
 *
 * Fails OPEN: if the checker itself cannot run (e.g. the lib files are missing in
 * some deploy), it returns no errors rather than blocking every TS lesson.
 */

const INPUT = "input.ts";
const GLOBALS = "globals.d.ts";

// We intentionally do NOT include lib.dom.d.ts: it declares globals like
// `status`, `location`, and `name`, so a beginner writing `let location = ...`
// would get a spurious "cannot redeclare" error. The lessons only need `console`
// for output, so we inject a minimal ambient declaration for it instead.
const GLOBALS_SRC = `declare var console: {
  log(...data: unknown[]): void;
  error(...data: unknown[]): void;
  warn(...data: unknown[]): void;
  info(...data: unknown[]): void;
  debug(...data: unknown[]): void;
};`;

const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  lib: ["lib.es2020.d.ts"],
  noEmit: true,
  strict: false,
  noImplicitAny: false,
  skipLibCheck: true,
  types: [],
};

let globalsFile: ts.SourceFile | null = null;

// Parsing the lib .d.ts files is the slow part; cache them for the process so
// only the first request pays for it.
const libCache = new Map<string, ts.SourceFile>();

/**
 * Returns human-readable TYPE errors (with line numbers), or [] if the code
 * type-checks. Syntax errors are left to transpile's own diagnostics.
 */
export function typeCheckErrors(code: string): string[] {
  try {
    const sourceFile = ts.createSourceFile(INPUT, code, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
    if (!globalsFile) {
      globalsFile = ts.createSourceFile(GLOBALS, GLOBALS_SRC, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
    }
    const baseHost = ts.createCompilerHost(compilerOptions);
    const host: ts.CompilerHost = {
      ...baseHost,
      getSourceFile: (name, langVersion, onError, shouldCreate) => {
        if (name === INPUT) return sourceFile;
        if (name === GLOBALS) return globalsFile ?? undefined;
        const cached = libCache.get(name);
        if (cached) return cached;
        const sf = baseHost.getSourceFile(name, langVersion, onError, shouldCreate);
        if (sf) libCache.set(name, sf);
        return sf;
      },
      writeFile: () => {},
      fileExists: (f) => f === INPUT || f === GLOBALS || baseHost.fileExists(f),
      readFile: (f) => (f === INPUT ? code : f === GLOBALS ? GLOBALS_SRC : baseHost.readFile(f)),
    };

    const program = ts.createProgram([INPUT, GLOBALS], compilerOptions, host);
    return program
      .getSemanticDiagnostics(sourceFile)
      .filter((d) => d.category === ts.DiagnosticCategory.Error)
      .map(formatDiagnostic)
      .slice(0, 10);
  } catch {
    return [];
  }
}

function formatDiagnostic(d: ts.Diagnostic): string {
  const msg = ts.flattenDiagnosticMessageText(d.messageText, "\n");
  if (d.file && typeof d.start === "number") {
    const { line } = d.file.getLineAndCharacterOfPosition(d.start);
    return `Line ${line + 1}: ${msg}`;
  }
  return msg;
}

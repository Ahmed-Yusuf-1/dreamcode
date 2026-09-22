/**
 * Shared grading for challenges and projects. A graded task names a function and
 * a list of test cases; the learner's code is run once and the function is called
 * with each case's arguments. Results are compared structurally (object key order
 * never matters, numbers get a tiny float tolerance) and every test reports what
 * came back, so a failing learner sees "expected 10, got 9" instead of a red cross.
 */
import { testJavaScript, type RawTestOutcome } from "@/lib/javascriptRunner";
import { cleanPythonError } from "@/lib/pythonErrors";

export type GradedLanguage = "Python" | "JavaScript" | "TypeScript";

export interface GradedTestCase {
  label: string;
  args: unknown[];
  expected: unknown;
}

export interface TestOutcome {
  pass: boolean;
  /** What the learner's function returned (already comparable data). */
  actual?: unknown;
  /** The error raised for this case, if any. */
  error?: string;
}

export interface GradeResult {
  /** False when the code could not run at all (syntax error, missing function, timeout). */
  ok: boolean;
  error?: string;
  /** Extra lines (a readable traceback or compiler message) for the console. */
  errorDetail?: string[];
  outcomes: TestOutcome[];
  /** Anything the learner printed while the tests ran. */
  logs: string[];
}

const RESULT_MARKER = "__DC_RESULTS__";
const HARNESS_FUNCTION = "__dc_grade";

/** Structural equality: key order ignored, float noise tolerated, NaN equals NaN. */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (a === b) return true;
    return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  }
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => deepEqual(item, b[i]));
  }
  const ak = Object.keys(a as Record<string, unknown>);
  const bk = Object.keys(b as Record<string, unknown>);
  if (ak.length !== bk.length) return false;
  return ak.every(
    (k) =>
      Object.prototype.hasOwnProperty.call(b, k) &&
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
  );
}

function isPlainKey(key: string) {
  return /^[A-Za-z_$][\w$]*$/.test(key);
}

/** Prints a value the way the task's own language writes it (True/None vs true/null). */
export function formatValue(value: unknown, language: GradedLanguage): string {
  const py = language === "Python";
  if (value === null) return py ? "None" : "null";
  if (value === undefined) return py ? "None" : "undefined";
  if (typeof value === "boolean") return py ? (value ? "True" : "False") : String(value);
  if (typeof value === "number") return Number.isInteger(value) || !Number.isFinite(value) ? String(value) : String(value);
  if (typeof value === "string") {
    return py ? `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'` : JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map((v) => formatValue(v, language)).join(", ")}]`;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if ("__dcUncloneable" in record && typeof record.__dcUncloneable === "string") return record.__dcUncloneable;
    const entries = Object.entries(record).map(([k, v]) =>
      py ? `'${k}': ${formatValue(v, language)}` : `${isPlainKey(k) ? k : JSON.stringify(k)}: ${formatValue(v, language)}`,
    );
    if (entries.length === 0) return "{}";
    return py ? `{${entries.join(", ")}}` : `{ ${entries.join(", ")} }`;
  }
  return String(value);
}

/** `total([1, 2], 3)` for the examples panel and the test list. */
export function formatCall(functionName: string, args: unknown[], language: GradedLanguage) {
  return `${functionName}(${args.map((a) => formatValue(a, language)).join(", ")})`;
}

/**
 * The Python grading script: the learner's code first (so tracebacks keep their
 * line numbers), then a namespaced harness that calls the function once per case
 * and prints one JSON line of results.
 */
export function buildPythonHarness(code: string, functionName: string, testCases: { args: unknown[] }[]) {
  const cases = JSON.stringify(JSON.stringify(testCases.map((t) => t.args)));
  return `${code}


def ${HARNESS_FUNCTION}():
    import json as __dc_json
    import traceback as __dc_tb

    def __dc_default(value):
        if isinstance(value, (set, frozenset)):
            try:
                return sorted(value)
            except TypeError:
                return list(value)
        if hasattr(value, "__dict__"):
            return {k: v for k, v in vars(value).items() if not k.startswith("_")}
        return repr(value)

    __dc_fn = globals().get(${JSON.stringify(functionName)})
    if not callable(__dc_fn):
        print(${JSON.stringify(RESULT_MARKER)} + __dc_json.dumps({"missing": True}))
        return
    __dc_out = []
    for __dc_args in __dc_json.loads(${cases}):
        try:
            __dc_value = __dc_fn(*__dc_args)
            __dc_json.dumps(__dc_value, default=__dc_default)
            __dc_out.append({"ok": True, "value": __dc_value})
        except Exception as __dc_error:
            __dc_line = None
            for __dc_frame in __dc_tb.extract_tb(__dc_error.__traceback__):
                if __dc_frame.filename == "<exec>" and __dc_frame.name != ${JSON.stringify(HARNESS_FUNCTION)}:
                    __dc_line = __dc_frame.lineno
            __dc_message = type(__dc_error).__name__ + ": " + str(__dc_error)
            if __dc_line is not None:
                __dc_message += " (line " + str(__dc_line) + ")"
            __dc_out.append({"ok": False, "error": __dc_message})
    print(${JSON.stringify(RESULT_MARKER)} + __dc_json.dumps({"outcomes": __dc_out}, default=__dc_default))


${HARNESS_FUNCTION}()
`;
}

/** Splits harness stdout into the learner's own prints and the raw outcomes. */
export function parsePythonHarnessOutput(stdout: string[]): { logs: string[]; outcomes: RawTestOutcome[] | null; missing: boolean } {
  const logs: string[] = [];
  let payload: { outcomes?: RawTestOutcome[]; missing?: boolean } | null = null;
  for (const chunk of stdout) {
    for (const line of chunk.split("\n")) {
      if (line.startsWith(RESULT_MARKER)) {
        try {
          payload = JSON.parse(line.slice(RESULT_MARKER.length));
        } catch {
          payload = null;
        }
      } else {
        logs.push(line);
      }
    }
  }
  while (logs.length > 0 && logs[logs.length - 1] === "") logs.pop();
  return { logs, outcomes: payload?.outcomes ?? null, missing: !!payload?.missing };
}

function compare(raw: RawTestOutcome[], testCases: GradedTestCase[]): TestOutcome[] {
  return testCases.map((test, i) => {
    const outcome = raw[i];
    if (!outcome) return { pass: false, error: "This test did not run." };
    if (!outcome.ok) return { pass: false, error: outcome.error || "Error" };
    return { pass: deepEqual(outcome.value, test.expected), actual: outcome.value };
  });
}

export interface PythonRunner {
  (code: string, stdin?: string, options?: { packages?: string[] }): Promise<{ ok: boolean; stdout: string[]; error: string | null }>;
}

export interface GradeRequest {
  language: GradedLanguage;
  code: string;
  functionName: string;
  testCases: GradedTestCase[];
  runPython: PythonRunner;
  /** Pyodide packages the challenge needs (numpy, pandas). Python only. */
  packages?: string[];
}

/** Transpiles and semantically checks TypeScript on the server (no execution there). */
export async function compileTypeScript(code: string): Promise<{ js?: string; diagnostics: string[]; error?: string }> {
  try {
    const res = await fetch("/api/transpile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.status === 429) return { diagnostics: [], error: "Too many compiles in a row. Wait a few seconds and try again." };
    if (!res.ok) return { diagnostics: [], error: "Could not reach the TypeScript compiler." };
    const data = await res.json();
    const diagnostics = Array.isArray(data.diagnostics) ? (data.diagnostics as string[]) : [];
    return { js: typeof data.js === "string" ? data.js : "", diagnostics };
  } catch {
    return { diagnostics: [], error: "Could not reach the TypeScript compiler. Check your connection." };
  }
}

export async function gradeSubmission({ language, code, functionName, testCases, runPython, packages }: GradeRequest): Promise<GradeResult> {
  const failAll = (error: string, errorDetail?: string[], logs: string[] = []): GradeResult => ({
    ok: false,
    error,
    errorDetail,
    logs,
    outcomes: testCases.map(() => ({ pass: false })),
  });

  if (language === "Python") {
    const result = await runPython(buildPythonHarness(code, functionName, testCases), undefined, { packages });
    const parsed = parsePythonHarnessOutput(result.stdout);
    if (!result.ok) {
      const clean = cleanPythonError(result.error || "", [HARNESS_FUNCTION]);
      return failAll(clean.summary, clean.lines, parsed.logs);
    }
    if (parsed.missing) return failAll(`NameError: define a function called ${functionName}`, undefined, parsed.logs);
    if (!parsed.outcomes) return failAll("The tests could not read your function's results.", undefined, parsed.logs);
    return { ok: true, logs: parsed.logs, outcomes: compare(parsed.outcomes, testCases) };
  }

  let runnable = code;
  if (language === "TypeScript") {
    const compiled = await compileTypeScript(code);
    if (compiled.error) return failAll(compiled.error);
    if (compiled.diagnostics.length > 0) return failAll(compiled.diagnostics[0], compiled.diagnostics);
    runnable = compiled.js || "";
  }

  const execution = await testJavaScript(runnable, functionName, testCases);
  if (!execution.ok || !execution.outcomes) {
    const message = execution.error || "Execution failed.";
    const withLine = language === "JavaScript" && execution.errorLine ? `${message} (line ${execution.errorLine})` : message;
    return failAll(withLine, undefined, execution.logs);
  }
  return { ok: true, logs: execution.logs, outcomes: compare(execution.outcomes, testCases) };
}

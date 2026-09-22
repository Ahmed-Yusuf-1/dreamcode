export interface RawTestOutcome {
  ok: boolean;
  value?: unknown;
  error?: string;
}

export interface JavaScriptRunResult {
  ok: boolean;
  logs: string[];
  error?: string;
  /** 1-based line in the learner's code where a runtime error was thrown, when known. */
  errorLine?: number;
  outcomes?: RawTestOutcome[];
}

type RunnerRequest =
  | { kind: "run"; code: string }
  | {
      kind: "tests";
      code: string;
      functionName: string;
      testCases: { args: unknown[] }[];
    };

const TIMEOUT_MS = 5_000;

/**
 * Runs learner JavaScript in a brand new Web Worker (see public/javascript-worker.js).
 * The worker is terminated after every run, so state never leaks between runs and
 * an endless loop is stopped by the hard timeout instead of freezing the page.
 */
function execute(request: RunnerRequest): Promise<JavaScriptRunResult> {
  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker("/javascript-worker.js");
    } catch {
      resolve({ ok: false, logs: [], error: "The JavaScript runner could not start in this browser." });
      return;
    }
    const timer = window.setTimeout(() => {
      worker.terminate();
      resolve({
        ok: false,
        logs: [],
        error: `Stopped after ${TIMEOUT_MS / 1000} seconds. Look for a loop that never ends.`,
      });
    }, TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<JavaScriptRunResult>) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve(event.data);
    };
    worker.onerror = (event) => {
      event.preventDefault();
      window.clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, logs: [], error: event.message || "The JavaScript runner stopped unexpectedly." });
    };
    worker.postMessage(request);
  });
}

export function runJavaScript(code: string) {
  return execute({ kind: "run", code });
}

export function testJavaScript(code: string, functionName: string, testCases: { args: unknown[] }[]) {
  return execute({
    kind: "tests",
    code,
    functionName,
    testCases: testCases.map((t) => ({ args: t.args })),
  });
}

/** "TypeError: x is not a function (line 4)" when the worker could map the line. */
export function describeRunError(result: Pick<JavaScriptRunResult, "error" | "errorLine">) {
  const base = result.error || "Execution failed.";
  return result.errorLine ? `${base} (line ${result.errorLine})` : base;
}

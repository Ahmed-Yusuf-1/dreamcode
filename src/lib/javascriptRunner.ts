export interface JavaScriptRunResult {
  ok: boolean;
  logs: string[];
  error?: string;
  passes?: boolean[];
}

type RunnerRequest =
  | { kind: "run"; code: string }
  | {
      kind: "tests";
      code: string;
      functionName: string;
      testCases: { args: unknown[]; expected: unknown }[];
    };

function execute(request: RunnerRequest, timeoutMs = 5_000): Promise<JavaScriptRunResult> {
  return new Promise((resolve) => {
    const worker = new Worker("/javascript-worker.js");
    const timer = window.setTimeout(() => {
      worker.terminate();
      resolve({ ok: false, logs: [], error: "Execution timed out after 5 seconds. Check for an infinite loop." });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<JavaScriptRunResult>) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve(event.data);
    };
    worker.onerror = () => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, logs: [], error: "The JavaScript runner could not start." });
    };
    worker.postMessage(request);
  });
}

export function runJavaScript(code: string) {
  return execute({ kind: "run", code });
}

export function testJavaScript(
  code: string,
  functionName: string,
  testCases: { args: unknown[]; expected: unknown }[],
) {
  return execute({ kind: "tests", code, functionName, testCases });
}

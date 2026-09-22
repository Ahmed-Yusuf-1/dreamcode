/**
 * Pyodide reports errors with its own internal frames on top of the learner's
 * (files inside /lib/python3xx.zip). Learners should see exactly what `python
 * main.py` would print, so this keeps only frames from their code (`<exec>`,
 * shown as main.py) and the exception itself.
 */
export interface CleanPythonError {
  /** The final "NameError: name 'x' is not defined" line. */
  summary: string;
  /** A readable traceback restricted to the learner's code. */
  lines: string[];
  /** Line in the learner's code where the error happened, if known. */
  line?: number;
}

const FRAME = /^\s*File "([^"]+)", line (\d+)(?:, in (.+))?$/;

export function cleanPythonError(raw: string, hiddenFunctions: string[] = []): CleanPythonError {
  const text = (raw || "").replace(/\r/g, "").trimEnd();
  if (!text) return { summary: "Something went wrong.", lines: [] };

  const all = text.split("\n");
  const kept: string[] = [];
  let line: number | undefined;
  let keepingFrame = false;
  let sawTraceback = false;
  let messageStart = -1;

  for (let i = 0; i < all.length; i += 1) {
    const current = all[i];
    if (current.startsWith("Traceback (most recent call last)")) {
      sawTraceback = true;
      continue;
    }
    const frame = current.match(FRAME);
    if (frame) {
      const [, file, lineNo, fn] = frame;
      keepingFrame = file === "<exec>" && !(fn && hiddenFunctions.includes(fn));
      if (keepingFrame) {
        kept.push(`  File "main.py", line ${lineNo}${fn ? `, in ${fn}` : ""}`);
        line = Number(lineNo);
      }
      continue;
    }
    if (/^\s/.test(current) || current === "") {
      // Source line or caret under a frame.
      if (keepingFrame && current.trim()) kept.push(current);
      continue;
    }
    // First unindented line after the frames: the exception and its message.
    messageStart = i;
    break;
  }

  const message = messageStart >= 0 ? all.slice(messageStart) : [all[all.length - 1]];
  const summary = message.filter(Boolean).pop() || "Something went wrong.";
  const lines = sawTraceback && kept.length > 0 ? ["Traceback (most recent call last):", ...kept, ...message] : [...kept, ...message];
  return { summary, lines, line };
}

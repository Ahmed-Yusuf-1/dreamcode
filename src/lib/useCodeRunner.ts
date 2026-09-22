"use client";

import { useCallback, useState } from "react";
import { usePyodide } from "@/lib/usePyodide";
import { runJavaScript } from "@/lib/javascriptRunner";
import { compileTypeScript } from "@/lib/grader";
import { cleanPythonError } from "@/lib/pythonErrors";
import type { EditorLanguage } from "@/components/CodeEditor";

export interface RunOutcome {
  ok: boolean;
  lines: string[];
  errorLines: string[];
  /** Short status for the console footer. */
  summary: string;
  /** 1-based line of the error in the learner's code, when known. */
  errorLine?: number;
}

function splitLines(chunks: string[]) {
  const lines = chunks.flatMap((c) => c.split("\n"));
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/**
 * One runner for every browser language: Python through Pyodide, JavaScript in a
 * fresh worker, TypeScript type-checked on the server and then run as
 * JavaScript. Errors come back in the shape a learner would see from the real
 * tool, with the offending line when it is known.
 */
export interface RunSettings {
  /** Pyodide packages the lesson needs (numpy, pandas). Python only. */
  packages?: string[];
  /** Called while those packages download, so the caller can say what is happening. */
  onPackages?: (packages: string[]) => void;
}

export function useCodeRunner(language: EditorLanguage) {
  const py = usePyodide(language === "python");
  const [running, setRunning] = useState(false);

  const run = useCallback(
    async (code: string, stdin?: string, settings: RunSettings = {}): Promise<RunOutcome> => {
      setRunning(true);
      try {
        if (language === "python") {
          const res = await py.run(code, stdin, { packages: settings.packages, onPackages: settings.onPackages });
          const lines = splitLines(res.stdout);
          if (res.ok) {
            return { ok: true, lines, errorLines: [], summary: lines.length ? "Done." : "Finished, with no output to show." };
          }
          const clean = cleanPythonError(res.error || "");
          // The traceback already names the error, so the note says where and what next.
          const where = clean.line ? ` on line ${clean.line}` : "";
          const hint = /EOFError/.test(clean.summary) ? " Add a line to the Input box for every input() call." : "";
          return { ok: false, lines, errorLines: clean.lines, summary: `Your code stopped with an error${where}.${hint}`, errorLine: clean.line };
        }

        let js = code;
        if (language === "typescript") {
          const compiled = await compileTypeScript(code);
          if (compiled.error) return { ok: false, lines: [], errorLines: [], summary: compiled.error };
          if (compiled.diagnostics.length > 0) {
            const lineMatch = compiled.diagnostics[0].match(/^Line (\d+)/);
            return {
              ok: false,
              lines: [],
              errorLines: compiled.diagnostics,
              summary: "Fix the type error above, then run again.",
              errorLine: lineMatch ? Number(lineMatch[1]) : undefined,
            };
          }
          js = compiled.js || "";
        }

        const result = await runJavaScript(js);
        if (result.ok) {
          return {
            ok: true,
            lines: result.logs,
            errorLines: [],
            summary: result.logs.length ? "Done." : "Finished, with no output to show.",
          };
        }
        const line = language === "javascript" ? result.errorLine : undefined;
        const message = result.error || "Execution failed.";
        return {
          ok: false,
          lines: result.logs,
          errorLines: [line ? `${message} (line ${line})` : message],
          summary: "Your code stopped with an error.",
          errorLine: line,
        };
      } finally {
        setRunning(false);
      }
    },
    [language, py],
  );

  return { run, running, pythonStatus: py.status };
}

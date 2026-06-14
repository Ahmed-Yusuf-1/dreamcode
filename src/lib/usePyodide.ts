"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PyStatus = "booting" | "ready" | "error";

export interface PyResult {
  ok: boolean;
  stdout: string[];
  error: string | null;
  timedOut?: boolean;
}

// If a run does not finish in this long, assume an endless loop, kill the worker,
// and start a fresh one for next time.
const RUN_TIMEOUT_MS = 12000;

/**
 * Runs real Python in the browser via a Pyodide Web Worker. The worker is
 * created on mount and starts downloading Pyodide right away, so it is usually
 * ready by the time the learner clicks Run.
 */
export function usePyodide() {
  const [status, setStatus] = useState<PyStatus>("booting");
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef<Map<number, (r: PyResult) => void>>(new Map());
  const idRef = useRef(0);

  const spawn = useCallback(() => {
    const w = new Worker("/pyodide-worker.js");
    w.onmessage = (e: MessageEvent) => {
      const m = e.data || {};
      if (m.type === "status") {
        setStatus(m.status === "ready" ? "ready" : "error");
      } else if (m.type === "result") {
        const resolve = pending.current.get(m.id);
        if (resolve) {
          pending.current.delete(m.id);
          resolve({ ok: m.ok, stdout: m.stdout || [], error: m.error ?? null });
        }
      }
    };
    w.onerror = () => setStatus("error");
    w.postMessage({ type: "init" });
    workerRef.current = w;
    return w;
  }, []);

  useEffect(() => {
    spawn();
    const pendingMap = pending.current;
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
      pendingMap.clear();
    };
  }, [spawn]);

  const run = useCallback(
    (code: string): Promise<PyResult> =>
      new Promise<PyResult>((resolve) => {
        const w = workerRef.current ?? spawn();
        const id = ++idRef.current;

        const timer = setTimeout(() => {
          if (pending.current.delete(id)) {
            // Endless loop or hang: the only way to stop the worker is to kill it.
            workerRef.current?.terminate();
            setStatus("booting");
            spawn();
            resolve({
              ok: false,
              stdout: [],
              error: "Stopped - your code ran too long to finish (a loop that never ends?).",
              timedOut: true,
            });
          }
        }, RUN_TIMEOUT_MS);

        pending.current.set(id, (r) => {
          clearTimeout(timer);
          resolve(r);
        });

        w.postMessage({ type: "run", id, code });
      }),
    [spawn],
  );

  return { status, run };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PyStatus = "booting" | "ready" | "error";

export interface RunOptions {
  /** Pyodide packages this lesson needs, such as numpy or pandas. */
  packages?: string[];
  onPackages?: (packages: string[]) => void;
}

export interface PyResult {
  ok: boolean;
  stdout: string[];
  error: string | null;
  timedOut?: boolean;
}

// Once code starts executing, a run that has not finished in this long is treated
// as an endless loop: the worker is killed and a fresh one is started.
const RUN_TIMEOUT_MS = 12_000;
// The first run also waits for Pyodide to download; allow slow connections.
const BOOT_TIMEOUT_MS = 90_000;
// Data science lessons fetch NumPy and pandas (about 10 MB) before the first run.
const PACKAGE_TIMEOUT_MS = 120_000;

interface Pending {
  resolve: (r: PyResult) => void;
  timer: ReturnType<typeof setTimeout>;
  /** Called when the worker starts fetching packages, so the UI can say so. */
  onPackages?: (packages: string[]) => void;
}

/**
 * Runs real Python in the browser via a Pyodide Web Worker. When enabled, the
 * worker is created on mount and starts downloading Pyodide right away, so it is
 * usually ready by the time the learner clicks Run.
 */
export function usePyodide(enabled = true) {
  const [status, setStatus] = useState<PyStatus>("booting");
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef<Map<number, Pending>>(new Map());
  const idRef = useRef(0);
  const spawnRef = useRef<() => Worker>(() => {
    throw new Error("worker not ready");
  });

  const settle = useCallback((id: number, result: PyResult) => {
    const entry = pending.current.get(id);
    if (!entry) return;
    clearTimeout(entry.timer);
    pending.current.delete(id);
    entry.resolve(result);
  }, []);

  const kill = useCallback(
    (id: number, error: string) => {
      if (!pending.current.has(id)) return;
      // Endless loop or hang: the only way to stop the worker is to kill it.
      workerRef.current?.terminate();
      workerRef.current = null;
      setStatus("booting");
      settle(id, { ok: false, stdout: [], error, timedOut: true });
      spawnRef.current();
    },
    [settle],
  );

  const spawn = useCallback(() => {
    const w = new Worker("/pyodide-worker.js");
    w.onmessage = (e: MessageEvent) => {
      const m = e.data || {};
      if (m.type === "status") {
        setStatus(m.status === "ready" ? "ready" : "error");
      } else if (m.type === "loading") {
        // Packages are downloading: hold the run timer off until they land.
        const entry = pending.current.get(m.id);
        if (entry) {
          clearTimeout(entry.timer);
          entry.onPackages?.(Array.isArray(m.packages) ? m.packages : []);
          entry.timer = setTimeout(
            () => kill(m.id, "The lesson's Python packages took too long to download. Check your connection and try again."),
            PACKAGE_TIMEOUT_MS,
          );
        }
      } else if (m.type === "started") {
        const entry = pending.current.get(m.id);
        if (entry) {
          clearTimeout(entry.timer);
          entry.timer = setTimeout(
            () => kill(m.id, "Stopped: your code ran for more than 12 seconds. Look for a loop that never ends."),
            RUN_TIMEOUT_MS,
          );
        }
      } else if (m.type === "result") {
        settle(m.id, { ok: m.ok, stdout: m.stdout || [], error: m.error ?? null });
      }
    };
    w.onerror = () => setStatus("error");
    w.postMessage({ type: "init" });
    workerRef.current = w;
    return w;
  }, [kill, settle]);

  useEffect(() => {
    spawnRef.current = spawn;
  }, [spawn]);

  useEffect(() => {
    // Only download Python when this page actually runs Python.
    if (!enabled) return;
    spawn();
    const pendingMap = pending.current;
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
      pendingMap.forEach((entry) => clearTimeout(entry.timer));
      pendingMap.clear();
    };
  }, [spawn, enabled]);

  const run = useCallback(
    (code: string, stdin?: string, options: RunOptions = {}): Promise<PyResult> =>
      new Promise<PyResult>((resolve) => {
        const w = workerRef.current ?? spawn();
        const id = ++idRef.current;
        const timer = setTimeout(
          () => kill(id, "Python took too long to load. Check your connection and try again."),
          BOOT_TIMEOUT_MS,
        );
        pending.current.set(id, { resolve, timer, onPackages: options.onPackages });
        w.postMessage({ type: "run", id, code, stdin, packages: options.packages });
      }),
    [kill, spawn],
  );

  return { status, run };
}

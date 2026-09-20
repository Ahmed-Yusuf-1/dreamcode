/*
 * Dreamcode Python runner (Web Worker).
 *
 * Loads Pyodide (real CPython compiled to WebAssembly) off the main thread, so
 * running a learner's Python never freezes the UI. The big download happens once
 * on the first run and is then cached by the browser.
 *
 * Protocol (messages from the page):
 *   { type: "init" }            -> begins loading Pyodide
 *   { type: "run", id, code, stdin?, packages? } -> runs `code` (stdin lines feed
 *                                     input(); packages such as numpy are
 *                                     fetched once), replies with the result
 *
 * Replies:
 *   { type: "status", status: "ready" | "error", error? }
 *   { type: "loading", id, packages } -> fetching packages before the run
 *   { type: "started", id }     -> Pyodide is loaded and `code` is starting now
 *   { type: "result", id, ok, stdout: string[], error: string | null }
 */

const PYODIDE_VERSION = "0.29.4";

const INPUT_ECHO = [
  "import builtins as __dc_builtins",
  "def input(prompt=''):",
  "    value = __dc_builtins.input()",
  "    print(f'{prompt}{value}')",
  "    return value",
].join("\n");

let readyPromise = null;
let pyodide = null;
/** Packages already fetched in this worker, so a re-run does not wait again. */
const loadedPackages = new Set();

async function load() {
  importScripts(`https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`);
  pyodide = await loadPyodide();
  return pyodide;
}

function ensureLoaded() {
  if (!readyPromise) readyPromise = load();
  return readyPromise;
}

self.onmessage = async (event) => {
  const msg = event.data || {};

  if (msg.type === "init") {
    try {
      await ensureLoaded();
      self.postMessage({ type: "status", status: "ready" });
    } catch (err) {
      self.postMessage({ type: "status", status: "error", error: String(err) });
    }
    return;
  }

  if (msg.type === "run") {
    const { id, code } = msg;
    const packages = Array.isArray(msg.packages) ? msg.packages.filter((name) => typeof name === "string") : [];
    const stdinLines = typeof msg.stdin === "string" && msg.stdin.length > 0 ? msg.stdin.replace(/\r/g, "").split("\n") : [];
    try {
      await ensureLoaded();
    } catch (err) {
      self.postMessage({
        type: "result",
        id,
        ok: false,
        stdout: [],
        error: "Python could not load. Check your connection and try again. (" + String(err) + ")",
      });
      return;
    }

    const missing = packages.filter((name) => !loadedPackages.has(name));
    if (missing.length > 0) {
      self.postMessage({ type: "loading", id, packages: missing });
      try {
        await pyodide.loadPackage(missing);
        for (const name of missing) loadedPackages.add(name);
      } catch (err) {
        self.postMessage({
          type: "result",
          id,
          ok: false,
          stdout: [],
          error: missing.join(" and ") + " could not load. Check your connection and try again. (" + String(err) + ")",
        });
        return;
      }
    }

    const lines = [];
    let namespace = null;
    try {
      pyodide.setStdout({ batched: (s) => lines.push(s) });
      pyodide.setStderr({ batched: (s) => lines.push(s) });
      // input() reads the lines the learner typed into the Input box, one per
      // call. Returning undefined means end of input (EOFError in Python).
      let nextLine = 0;
      pyodide.setStdin({
        stdin: () => (nextLine < stdinLines.length ? stdinLines[nextLine++] : undefined),
        autoEOF: true,
      });

      // Fresh namespace per run so re-running starts clean (no state bleed), with
      // __name__ set so `if __name__ == "__main__":` behaves like a real script.
      namespace = pyodide.toPy({ __name__: "__main__" });
      // Echo each answer after its prompt, the way a terminal shows what you
      // typed. Runs under its own filename so it never appears in tracebacks.
      await pyodide.runPythonAsync(INPUT_ECHO, { globals: namespace, filename: "<dreamcode>" });
      self.postMessage({ type: "started", id });
      await pyodide.runPythonAsync(code, { globals: namespace });

      self.postMessage({ type: "result", id, ok: true, stdout: lines, error: null });
    } catch (err) {
      const message = err && err.message ? err.message : String(err);
      self.postMessage({ type: "result", id, ok: false, stdout: lines, error: message });
    } finally {
      if (namespace) {
        try {
          namespace.destroy();
        } catch {
          /* ignore */
        }
      }
      try {
        pyodide.setStdout({});
        pyodide.setStderr({});
        pyodide.setStdin({});
      } catch {
        /* ignore */
      }
    }
  }
};

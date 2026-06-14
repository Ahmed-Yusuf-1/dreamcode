/*
 * Dreamcode Python runner (Web Worker).
 *
 * Loads Pyodide (real CPython compiled to WebAssembly) off the main thread, so
 * running a learner's Python never freezes the UI. The big download happens once
 * on the first run and is then cached by the browser.
 *
 * Protocol (messages from the page):
 *   { type: "init" }            -> begins loading Pyodide
 *   { type: "run", id, code }   -> runs `code`, replies with the result
 *
 * Replies:
 *   { type: "status", status: "ready" | "error", error? }
 *   { type: "result", id, ok, stdout: string[], error: string | null }
 */

const PYODIDE_VERSION = "0.29.4";

let readyPromise = null;
let pyodide = null;

async function load() {
  importScripts(`https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`);
  // eslint-disable-next-line no-undef
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

    const lines = [];
    let namespace = null;
    try {
      pyodide.setStdout({ batched: (s) => lines.push(s) });
      pyodide.setStderr({ batched: (s) => lines.push(s) });

      // Fresh namespace per run so re-running starts clean (no state bleed).
      namespace = pyodide.toPy({});
      await pyodide.runPythonAsync(code, { globals: namespace });

      self.postMessage({ type: "result", id, ok: true, stdout: lines, error: null });
    } catch (err) {
      const message = err && err.message ? err.message : String(err);
      self.postMessage({ type: "result", id, ok: false, stdout: lines, error: message });
    } finally {
      if (namespace) {
        try {
          namespace.destroy();
        } catch (e) {
          /* ignore */
        }
      }
      try {
        pyodide.setStdout({});
        pyodide.setStderr({});
      } catch (e) {
        /* ignore */
      }
    }
  }
};

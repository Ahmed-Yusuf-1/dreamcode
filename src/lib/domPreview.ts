/**
 * Builds the document for the DOM preview: the lesson's HTML, a small bootstrap
 * that forwards console output and errors to the lesson page, the loop guard
 * that instrumented code calls, then the learner's script.
 *
 * The document is loaded into an <iframe sandbox="allow-scripts"> with no
 * allow-same-origin, so it runs in an opaque origin: it cannot read the app's
 * DOM, cookies, local storage or session. Messages carry a per-run token and the
 * page also checks the message source, so stale runs can never write into the
 * console of a newer one.
 */

export const DOM_MESSAGE_TAG = "__dcPreview";
export const LOOP_LIMIT_MS = 2000;

const PREVIEW_STYLE = `
  :root { color-scheme: light; }
  body { margin: 0; padding: 14px 16px; font: 15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: #13335f; background: #fffaf6; }
  button { font: inherit; font-weight: 700; padding: 6px 14px; border-radius: 999px; border: 2px solid #13335f; background: #ffe1ef; color: #13335f; cursor: pointer; }
  input { font: inherit; padding: 6px 10px; border-radius: 10px; border: 2px solid #c9d8f2; }
  ul { padding-left: 20px; }
  .done { text-decoration: line-through; opacity: .6; }
  .glow { color: #b8404f; font-weight: 800; }
  .hidden { display: none; }
`;

function bootstrap(token: string): string {
  // Plain ES5-style code: it runs in the preview document, not in the app bundle.
  return `
(function () {
  var TOKEN = ${JSON.stringify(token)};
  var TAG = ${JSON.stringify(DOM_MESSAGE_TAG)};
  function send(kind, text) {
    try { parent.postMessage({ tag: TAG, token: TOKEN, kind: kind, text: String(text) }, "*"); } catch (e) {}
  }
  function inspect(v, nested, depth) {
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    var t = typeof v;
    if (t === "string") return nested ? "'" + v + "'" : v;
    if (t === "number" || t === "boolean" || t === "bigint") return String(v);
    if (t === "function") return "[Function: " + (v.name || "(anonymous)") + "]";
    if (typeof Element !== "undefined" && v instanceof Element) {
      var id = v.id ? "#" + v.id : "";
      var cls = v.className && typeof v.className === "string" ? "." + v.className.trim().split(/\\s+/).join(".") : "";
      return "<" + v.tagName.toLowerCase() + id + cls + ">";
    }
    if (typeof NodeList !== "undefined" && (v instanceof NodeList || v instanceof HTMLCollection)) {
      return "NodeList(" + v.length + ") [ " + Array.prototype.map.call(v, function (x) { return inspect(x, true, depth + 1); }).join(", ") + " ]";
    }
    if (v instanceof Error) return v.name + ": " + v.message;
    if ((depth || 0) > 3) return Array.isArray(v) ? "[Array]" : "[Object]";
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      return "[ " + v.map(function (x) { return inspect(x, true, (depth || 0) + 1); }).join(", ") + " ]";
    }
    var keys = Object.keys(v);
    if (!keys.length) return "{}";
    return "{ " + keys.map(function (k) { return k + ": " + inspect(v[k], true, (depth || 0) + 1); }).join(", ") + " }";
  }
  function fmt(args) { return Array.prototype.map.call(args, function (a) { return inspect(a, false, 0); }).join(" "); }
  ["log", "info", "debug", "warn", "error"].forEach(function (m) {
    console[m] = function () { send("log", fmt(arguments)); };
  });
  window.addEventListener("error", function (e) {
    send("error", e.error && e.error.name ? e.error.name + ": " + e.error.message : e.message);
    e.preventDefault();
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    send("error", r && r.name ? r.name + ": " + r.message : "Uncaught (in promise) " + String(r));
    e.preventDefault();
  });
  var started = 0;
  var count = 0;
  window.__dcLoopGuard = function () {
    count++;
    if (count % 500 !== 0) return;
    var now = Date.now();
    if (!started) started = now;
    if (now - started > ${LOOP_LIMIT_MS}) {
      throw new Error("Stopped: a loop ran for more than ${LOOP_LIMIT_MS / 1000} seconds. Look for a loop that never ends.");
    }
  };
  window.__dcResetGuard = function () { started = 0; count = 0; };
  document.addEventListener("click", function () { window.__dcResetGuard(); }, true);
  window.__dcDone = function () { send("done", ""); };
})();
`;
}

/** Makes script text safe to embed inside a <script> element. */
function embed(js: string) {
  return js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
}

export function buildPreviewDocument(html: string, js: string | null, token: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>${PREVIEW_STYLE}</style>
<script>${bootstrap(token)}</script>
</head>
<body>
${html}
${js === null ? "" : `<script>${embed(js)}\n</script>`}
<script>window.__dcDone();</script>
</body>
</html>`;
}

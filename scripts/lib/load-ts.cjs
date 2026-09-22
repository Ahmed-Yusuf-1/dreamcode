/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Minimal TypeScript module loader for Node scripts (content audits, seed
 * generation). Transpiles on the fly and resolves the "@/..." path alias to
 * src/, so scripts can import the same content modules the app uses.
 */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..", "..");
const cache = new Map();

function resolveFile(request, fromDir) {
  let base;
  if (request.startsWith("@/")) base = path.join(root, "src", request.slice(2));
  else if (request.startsWith(".")) base = path.resolve(fromDir, request);
  else return null;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  throw new Error(`Cannot resolve ${request} from ${fromDir}`);
}

function loadFile(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const source = fs.readFileSync(filename, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    fileName: filename,
    reportDiagnostics: true,
  });
  if (result.diagnostics && result.diagnostics.length > 0) {
    const d = result.diagnostics[0];
    const where = d.file && typeof d.start === "number" ? `:${d.file.getLineAndCharacterOfPosition(d.start).line + 1}` : "";
    throw new Error(`${path.relative(root, filename)}${where}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`);
  }
  const output = result.outputText;
  const mod = { exports: {} };
  cache.set(filename, mod);
  const localRequire = (request) => {
    const file = resolveFile(request, path.dirname(filename));
    return file ? loadFile(file) : require(request);
  };
  new Function("module", "exports", "require", "__filename", "__dirname", output)(
    mod,
    mod.exports,
    localRequire,
    filename,
    path.dirname(filename),
  );
  return mod.exports;
}

function loadTs(relativePath) {
  return loadFile(path.join(root, relativePath));
}

module.exports = { loadTs, root };

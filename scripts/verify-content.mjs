/**
 * Content verification. Runs in CI (npm test) and locally.
 *
 * Static checks: identity and ordering of lessons, practice/quiz shape, unlock
 * references, placement banks, the "no AI tells" voice rules, and freshness of
 * the generated reward seed.
 *
 * Execution checks, on the same runtimes the browser uses:
 *   - Python through Pyodide 0.29 (the version public/pyodide-worker.js loads),
 *   - JavaScript through public/javascript-worker.js inside a Node worker thread,
 *   - TypeScript through the app's own type checker, then the JavaScript worker.
 * Every runnable lesson example and starter must run cleanly, every task
 * solution must pass its task, every "what does this print" answer must match
 * the real output, and every challenge and project must be passed by its
 * reference solution (scripts/fixtures/solutions) and not by its starter.
 *
 * Usage: node scripts/verify-content.mjs [--static] [--only=<slug-substring>]
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { Worker } from "node:worker_threads";

const require = createRequire(import.meta.url);
const { loadTs, root } = require("./lib/load-ts.cjs");
const ts = require("typescript");

const args = new Set(process.argv.slice(2));
const STATIC_ONLY = args.has("--static");
const ONLY = [...args].find((a) => a.startsWith("--only="))?.slice(7);

const errors = [];
const warnings = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);
const warn = (where, message) => warnings.push(`${where}: ${message}`);

const { lessons } = loadTs("src/lib/curriculum.ts");
const { practiceDatasets, challenges, moduleChallenges, projects, badges } = loadTs("src/lib/data.ts");
const { placementBanks } = loadTs("src/content/placement.ts");
const { buildPythonHarness, parsePythonHarnessOutput, deepEqual } = loadTs("src/lib/grader.ts");
const { checkTask } = loadTs("src/lib/lessonTask.ts");
const { typeCheckErrors, formatDiagnostic } = loadTs("src/lib/tsCheck.ts");
const { buildSql, buildBadgeSql, OUTPUT: SEED_FILE, BADGES_OUTPUT: BADGE_SEED_FILE } = require("./generate-reward-seed.cjs");
const { guardLoops } = loadTs("src/lib/loopGuard.ts");
const { buildPreviewDocument, DOM_MESSAGE_TAG } = loadTs("src/lib/domPreview.ts");

const trackOf = (l) => l.language || "python";
const moduleOf = (l) => l.module || l.chapter || "Basics";
const TIERS = ["beginner", "intermediate", "advanced", "expert"];
const IDENT = /^[A-Za-z_$][\w$]*$/;

/* ------------------------------------------------------------------ static */

const bySlug = new Map();
for (const l of lessons) {
  if (bySlug.has(l.slug)) fail(l.slug, "duplicate lesson slug");
  bySlug.set(l.slug, l);
}

for (const track of ["python", "javascript", "typescript", "csharp"]) {
  const ls = lessons.filter((l) => trackOf(l) === track).sort((a, b) => a.order - b.order);
  ls.forEach((l, i) => {
    if (l.order !== i + 1) fail(l.slug, `order ${l.order} breaks the ${track} sequence (expected ${i + 1})`);
  });
  // Modules must be contiguous: once a module ends it never reappears.
  const seen = new Set();
  let prev = null;
  for (const l of ls) {
    const m = moduleOf(l);
    if (m !== prev && seen.has(m)) fail(l.slug, `module "${m}" is split into separate runs in ${track}`);
    seen.add(m);
    prev = m;
  }
}

for (const l of lessons) {
  const where = `lesson ${l.slug}`;
  for (const key of ["title", "catalogTitle", "blurb", "catalogCode", "intro", "example", "tip", "kicker"]) {
    if (!l[key] || !String(l[key]).trim()) fail(where, `missing ${key}`);
  }
  if (!l.module) fail(where, "missing module");
  if (!TIERS.includes(l.tier)) fail(where, `invalid tier ${l.tier}`);
  if (!Array.isArray(l.reads) || l.reads.length === 0) fail(where, "needs at least one How it reads bullet");
  const runnable = l.runnable !== false;
  if (runnable && trackOf(l) === "csharp") fail(where, "C# lessons must be read + quiz (runnable: false)");
  if (!runnable) {
    if (!Array.isArray(l.quiz) || l.quiz.length < 2) fail(where, "read + quiz lessons need at least 2 questions");
    (l.quiz || []).forEach((q, i) => {
      if (!Array.isArray(q.options) || q.options.length < 2) fail(where, `quiz ${i + 1} needs at least 2 options`);
      if (!(q.answer >= 0 && q.answer < q.options.length)) fail(where, `quiz ${i + 1} answer index out of range`);
      if (new Set(q.options).size !== q.options.length) fail(where, `quiz ${i + 1} has duplicate options`);
      if (!q.explain) fail(where, `quiz ${i + 1} needs an explanation`);
    });
  }
  if (l.practiceSlug) {
    if (!practiceDatasets[l.practiceSlug]) fail(where, `practice ${l.practiceSlug} does not exist`);
    if (l.practiceSlug !== l.slug) fail(where, "practiceSlug must equal the lesson slug (the practice page looks the lesson up by it)");
  }
  if (l.task) {
    if (!l.task.prompt) fail(where, "task needs a prompt");
    if (!l.task.solution) fail(where, "task needs a reference solution");
    if (!(l.task.expectOutput?.length || l.task.mustInclude?.length)) fail(where, "task needs expectOutput or mustInclude to check");
    for (const p of l.task.mustInclude ?? []) {
      try {
        new RegExp(p, "m");
      } catch {
        fail(where, `task pattern is not a valid regex: ${p}`);
      }
    }
  }
}

for (const [slug, d] of Object.entries(practiceDatasets)) {
  const where = `practice ${slug}`;
  if (!bySlug.has(slug)) fail(where, "no lesson with this slug");
  const correct = d.predictOptions.filter((o) => o.correct);
  if (correct.length !== 1) fail(where, `needs exactly one correct predict option (has ${correct.length})`);
  if (new Set(d.predictOptions.map((o) => o.id)).size !== d.predictOptions.length) fail(where, "duplicate predict option ids");
  if (new Set(d.predictOptions.map((o) => o.label)).size !== d.predictOptions.length) fail(where, "duplicate predict option labels");
  if (d.parsonsFragments.length < 2) fail(where, "Parsons needs at least 2 fragments");
  if (new Set(d.parsonsFragments.map((f) => f.id)).size !== d.parsonsFragments.length) fail(where, "duplicate Parsons fragment ids");
  d.fadedLines.forEach((line, i) => {
    const holes = line.text.split("___").length - 1;
    if (holes !== line.blanks.length) fail(where, `faded line ${i + 1} has ${holes} blanks but ${line.blanks.length} answers`);
    line.blanks.forEach((b) => {
      if (!String(b).trim()) fail(where, `faded line ${i + 1} has an empty answer`);
    });
  });
  if (d.fadedLines.every((l) => l.blanks.length === 0)) fail(where, "faded step has no blanks");
}

const moduleNames = new Map();
for (const l of lessons) moduleNames.set(moduleOf(l), trackOf(l));
const langToTrack = { Python: "python", JavaScript: "javascript", TypeScript: "typescript" };

for (const [mod, slug] of Object.entries(moduleChallenges)) {
  const where = `moduleChallenges["${mod}"]`;
  if (!moduleNames.has(mod)) fail(where, "no such module");
  const c = challenges[slug];
  if (!c) fail(where, `challenge ${slug} does not exist`);
  else if (langToTrack[c.language] !== moduleNames.get(mod)) fail(where, `challenge language ${c.language} does not match the module's track`);
}

const sectionSlugs = new Set(Object.values(moduleChallenges));
for (const c of Object.values(challenges)) {
  const where = `challenge ${c.slug}`;
  if (!IDENT.test(c.functionName)) fail(where, "functionName is not an identifier");
  if (!langToTrack[c.language]) fail(where, `unknown language ${c.language}`);
  if (c.testCases.length < 3) warn(where, `only ${c.testCases.length} tests`);
  if (!(c.xp > 0)) fail(where, "xp must be positive");
  if (c.requires && !bySlug.has(c.requires)) fail(where, `requires unknown lesson ${c.requires}`);
  if (c.requires && trackOf(bySlug.get(c.requires) || {}) !== langToTrack[c.language]) fail(where, "requires a lesson from another track");
  if (!c.requires && !sectionSlugs.has(c.slug)) fail(where, "needs `requires` (standalone peak) or a moduleChallenges entry");
}

const projectIds = new Set(projects.map((p) => p.id));
for (const p of projects) {
  const where = `project ${p.id}`;
  if (!IDENT.test(p.functionName)) fail(where, "functionName is not an identifier");
  if (p.testCases.length < 2) fail(where, "needs at least 2 tests");
  for (const r of p.requires ?? []) {
    if (!bySlug.has(r) && !projectIds.has(r)) fail(where, `requires unknown key ${r}`);
  }
}

for (const [track, bank] of Object.entries(placementBanks)) {
  bank.forEach((q, i) => {
    const where = `placement ${track}[${i}]`;
    const l = bySlug.get(q.lesson);
    if (!l) fail(where, `unknown lesson ${q.lesson}`);
    else if (trackOf(l) !== track) fail(where, `lesson ${q.lesson} is from another track`);
    if (!(q.answer >= 0 && q.answer < q.options.length)) fail(where, "answer out of range");
  });
  const orders = bank.map((q) => bySlug.get(q.lesson)?.order ?? 0);
  if (orders.some((o, i) => i > 0 && o < orders[i - 1])) fail(`placement ${track}`, "questions must follow curriculum order");
}

// Voice: no em/en dashes, single-character ellipsis, Unicode minus or emoji.
const BANNED = /[\u2013\u2014\u2026\u2212]|[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
function scanVoice(value, where) {
  if (typeof value === "string") {
    const m = value.match(BANNED);
    if (m) fail(where, `banned character ${JSON.stringify(m[0])} in "${value.slice(Math.max(0, m.index - 20), m.index + 20)}"`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => scanVoice(v, `${where}[${i}]`));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) scanVoice(v, `${where}.${k}`);
  }
}
lessons.forEach((l) => scanVoice(l, `lesson ${l.slug}`));
scanVoice(practiceDatasets, "practice");
scanVoice(challenges, "challenges");
scanVoice(projects, "projects");
scanVoice(badges, "badges");
scanVoice(placementBanks, "placement");

if (!fs.existsSync(SEED_FILE) || fs.readFileSync(SEED_FILE, "utf8") !== buildSql()) {
  fail("supabase/seed/activity_rewards.sql", "is out of date: run `npm run seed:rewards`");
}
if (!fs.existsSync(BADGE_SEED_FILE) || fs.readFileSync(BADGE_SEED_FILE, "utf8") !== buildBadgeSql()) {
  fail("supabase/seed/badge_catalog.sql", "is out of date: run `npm run seed:rewards`");
}

/* ------------------------------------------------------------------ badges */

{
  const { RARITY, expandKeys, badgeMet, EMPTY_SNAPSHOT } = loadTs("src/lib/badges.ts");
  const { buildCatalog } = loadTs("src/lib/catalog.server.ts");
  const catalog = buildCatalog();
  const seen = new Set();
  const keys = new Set([
    ...catalog.lessons.map((l) => l.slug),
    ...catalog.lessons.filter((l) => l.practiceSlug).map((l) => `practice:${l.practiceSlug}`),
    ...catalog.challenges.map((c) => c.slug),
    ...catalog.projects.map((p) => p.id),
  ]);

  for (const badge of badges) {
    const where = `badge ${badge.id}`;
    if (seen.has(badge.id)) fail(where, "duplicate badge id");
    seen.add(badge.id);
    if (!RARITY[badge.rarity]) fail(where, `unknown rarity ${badge.rarity}`);
    if (!/^#[0-9a-f]{6}$/i.test(badge.accent)) fail(where, `accent must be a 6 digit hex, got ${badge.accent}`);

    const rule = badge.rule;
    const conditions = Object.keys(rule).length;
    if (conditions === 0) fail(where, "rule has no conditions, so it could never be earned");
    // A badge nobody has must not already be met by an empty history.
    if (badgeMet(badge, EMPTY_SNAPSHOT, catalog)) fail(where, "is already earned by a learner who has done nothing");

    if (rule.keys) {
      const expanded = expandKeys(rule.keys.source, catalog);
      if (expanded.length === 0) fail(where, "key rule matches no activity");
      for (const key of expanded) {
        if (!keys.has(key)) fail(where, `rule names unknown activity ${key}`);
      }
    }
    if (rule.count) {
      const scope = rule.count;
      const total = [...keys].filter((key) => {
        if (scope.of === "lesson") return catalog.lessons.some((l) => l.slug === key && (!scope.track || l.track === scope.track));
        if (scope.of === "practice") return key.startsWith("practice:");
        if (scope.of === "challenge") return catalog.challenges.some((c) => c.slug === key && (!scope.track || c.track === scope.track));
        if (scope.of === "project") return catalog.projects.some((p) => p.id === key && (!scope.track || p.track === scope.track));
        return true;
      }).length;
      if (scope.of !== "review" && total < scope.n) {
        fail(where, `asks for ${scope.n} ${scope.of}s but only ${total} exist`);
      }
    }
  }

  const emblemable = badges.filter((b) => !b.secret).length;
  if (emblemable === 0) fail("badges", "every badge is secret, so nothing can be shown as an emblem");
}

/* --------------------------------------------------------------- runtimes */

// Keep in step with public/pyodide-worker.js.
const PYODIDE_VERSION = "0.29.4";

// Same input() echo the browser worker installs (public/pyodide-worker.js).
const INPUT_ECHO = ["import builtins as __dc_builtins", "def input(prompt=''):", "    value = __dc_builtins.input()", "    print(f'{prompt}{value}')", "    return value"].join("\n");

let pyodide = null;
const loadedPackages = new Set();
async function runPython(code, stdin, packages = []) {
  if (!pyodide) {
    const { loadPyodide } = await import("pyodide");
    // Packages (numpy, pandas) are fetched from the same CDN the browser worker
    // uses and cached in node_modules for later runs.
    pyodide = await loadPyodide({ packageBaseUrl: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` });
  }
  const missing = packages.filter((name) => !loadedPackages.has(name));
  if (missing.length > 0) {
    await pyodide.loadPackage(missing);
    for (const name of missing) loadedPackages.add(name);
  }
  const out = [];
  const lines = typeof stdin === "string" && stdin.length ? stdin.split("\n") : [];
  let next = 0;
  pyodide.setStdout({ batched: (s) => out.push(s) });
  pyodide.setStderr({ batched: (s) => out.push(s) });
  pyodide.setStdin({ stdin: () => (next < lines.length ? lines[next++] : undefined), autoEOF: true });
  const globals = pyodide.toPy({ __name__: "__main__" });
  try {
    await pyodide.runPythonAsync(INPUT_ECHO, { globals, filename: "<dreamcode>" });
    await pyodide.runPythonAsync(code, { globals });
    return { ok: true, stdout: out, error: null };
  } catch (e) {
    return { ok: false, stdout: out, error: String(e.message || e) };
  } finally {
    globals.destroy();
  }
}

const WORKER_SOURCE = fs.readFileSync(path.join(root, "public", "javascript-worker.js"), "utf8");
const WORKER_SHIM = `
const { parentPort } = require("node:worker_threads");
globalThis.self = globalThis;
globalThis.postMessage = (m) => parentPort.postMessage(m);
const listeners = {};
globalThis.addEventListener = (t, f) => { (listeners[t] ||= []).push(f); };
globalThis.removeEventListener = (t, f) => { listeners[t] = (listeners[t] || []).filter((x) => x !== f); };
process.on("uncaughtException", (e) => { for (const f of listeners.error || []) f({ error: e, message: e.message, preventDefault() {} }); });
process.on("unhandledRejection", (r) => { for (const f of listeners.unhandledrejection || []) f({ reason: r, preventDefault() {} }); });
parentPort.on("message", (data) => globalThis.onmessage({ data }));
`;

function runWorker(request, timeoutMs = 6000) {
  return new Promise((resolve) => {
    const worker = new Worker(WORKER_SHIM + WORKER_SOURCE, { eval: true });
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ ok: false, logs: [], error: "timed out" });
    }, timeoutMs);
    worker.once("message", (msg) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(msg);
    });
    worker.once("error", (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, logs: [], error: String(e) });
    });
    worker.postMessage(request);
  });
}

function compileTs(code) {
  const result = ts.transpileModule(code, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    fileName: "input.ts",
    reportDiagnostics: true,
  });
  const syntax = (result.diagnostics ?? []).map(formatDiagnostic);
  const types = syntax.length ? [] : typeCheckErrors(code);
  return { js: result.outputText, diagnostics: [...syntax, ...types] };
}

/** Runs a DOM lesson program in jsdom, through the same document the preview builds. */
async function runDom(html, code) {
  const { JSDOM } = await import("jsdom");
  const guarded = guardLoops(code);
  if (guarded.diagnostics.length) return { ok: false, lines: [], error: guarded.diagnostics[0] };
  const token = "verify";
  const dom = new JSDOM(buildPreviewDocument(html, guarded.js, token), { runScripts: "dangerously", pretendToBeVisual: true });
  const lines = [];
  const errors = [];
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000);
    dom.window.addEventListener("message", (event) => {
      const data = event.data;
      if (!data || data.tag !== DOM_MESSAGE_TAG || data.token !== token) return;
      if (data.kind === "done") {
        clearTimeout(timer);
        setTimeout(resolve, 50);
      } else if (data.kind === "error") errors.push(data.text);
      else lines.push(data.text);
    });
  });
  dom.window.close();
  return { ok: errors.length === 0, lines, error: errors[0] ?? null };
}

/** Runs a program in its track's runtime and returns { ok, lines, error }. */
async function runProgram(language, code, stdin, html, packages) {
  if (html) return runDom(html, code);
  if (language === "python") {
    const r = await runPython(code, stdin, packages);
    const lines = r.stdout.flatMap((s) => s.split("\n"));
    return { ok: r.ok, lines, error: r.error ? r.error.trim().split("\n").pop() : null };
  }
  let js = code;
  if (language === "typescript") {
    const compiled = compileTs(code);
    if (compiled.diagnostics.length) return { ok: false, lines: [], error: compiled.diagnostics[0] };
    js = compiled.js;
  }
  const r = await runWorker({ kind: "run", code: js });
  return { ok: r.ok, lines: r.logs || [], error: r.error ?? null };
}

async function grade(language, code, functionName, testCases, packages) {
  if (language === "Python") {
    const r = await runPython(buildPythonHarness(code, functionName, testCases), undefined, packages);
    const parsed = parsePythonHarnessOutput(r.stdout);
    if (!r.ok) return { ok: false, error: r.error.trim().split("\n").pop() };
    if (parsed.missing || !parsed.outcomes) return { ok: false, error: `function ${functionName} missing` };
    return { ok: true, outcomes: parsed.outcomes };
  }
  let js = code;
  if (language === "TypeScript") {
    const compiled = compileTs(code);
    if (compiled.diagnostics.length) return { ok: false, error: compiled.diagnostics[0] };
    js = compiled.js;
  }
  const r = await runWorker({ kind: "tests", code: js, functionName, testCases: testCases.map((t) => ({ args: t.args })) });
  if (!r.ok) return { ok: false, error: r.error };
  return { ok: true, outcomes: r.outcomes };
}

const normalizeOutput = (s) =>
  String(s)
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .trim();

const OUTPUT_QUESTION = /^(what (does|will|would) .*\b(print|output|log|display|show)|what is (the )?(output|printed))/i;

/* -------------------------------------------------------------- execution */

async function verifyExecution() {
  const selected = (slug) => !ONLY || slug.includes(ONLY);

  for (const l of lessons) {
    if (l.runnable === false || !selected(l.slug)) continue;
    const lang = trackOf(l);
    const where = `lesson ${l.slug}`;
    for (const key of ["example", "starter"]) {
      const r = await runProgram(lang, l[key], l.stdin, l.html, l.packages);
      if (!r.ok) fail(where, `${key} does not run: ${r.error}`);
      else if (r.lines.length === 0) warn(where, `${key} prints nothing`);
    }
    for (const [i, section] of (l.deeper ?? []).entries()) {
      if (!section.code) continue;
      const r = await runProgram(lang, section.code, l.stdin, l.html, l.packages);
      if (!r.ok) fail(where, `go-deeper section ${i + 1} code does not run: ${r.error}`);
    }
    if (l.task?.solution) {
      const r = await runProgram(lang, l.task.solution, l.stdin, l.html, l.packages);
      if (!r.ok) fail(where, `task solution does not run: ${r.error}`);
      else {
        const check = checkTask(l.task, l.task.solution, r.lines);
        if (!check.ok) fail(where, `task solution does not pass its own check: ${check.message}`);
      }
      const s = await runProgram(lang, l.starter, l.stdin, l.html, l.packages);
      if (s.ok && checkTask(l.task, l.starter, s.lines).ok) fail(where, "the unchanged starter already passes the task");
    }
  }

  for (const [slug, d] of Object.entries(practiceDatasets)) {
    if (!selected(slug)) continue;
    const lesson = bySlug.get(slug);
    if (!lesson) continue;
    if (!OUTPUT_QUESTION.test(d.predictQuestion)) continue;
    const correct = d.predictOptions.find((o) => o.correct);
    const r = await runProgram(trackOf(lesson), d.predictCode, lesson.stdin, lesson.html, d.packages ?? lesson.packages);
    const where = `practice ${slug} predict`;
    if (!r.ok) {
      if (!/error|exception|raise|throw|crash|fail/i.test(correct?.label || "")) fail(where, `code errors (${r.error}) but the answer "${correct?.label}" is not an error`);
      continue;
    }
    const actual = normalizeOutput(r.lines.join("\n"));
    if (correct && normalizeOutput(correct.label) !== actual) {
      fail(where, `answer "${correct.label}" but the program prints ${JSON.stringify(actual)}`);
    }
    for (const o of d.predictOptions) {
      if (!o.correct && normalizeOutput(o.label) === actual) fail(where, `wrong option "${o.label}" matches the real output`);
    }
  }

  for (const [track, bank] of Object.entries(placementBanks)) {
    for (const [i, q] of bank.entries()) {
      if (!q.checksOutput || !q.code) continue;
      const r = await runProgram(track, q.code);
      const where = `placement ${track}[${i}]`;
      if (!r.ok) {
        fail(where, `code does not run: ${r.error}`);
        continue;
      }
      const actual = normalizeOutput(r.lines.join("\n"));
      if (normalizeOutput(q.options[q.answer]) !== actual) fail(where, `answer "${q.options[q.answer]}" but the program prints ${JSON.stringify(actual)}`);
    }
  }

  const tasks = [
    ...Object.values(challenges).map((c) => ({ kind: "challenge", id: c.slug, ...c })),
    ...projects.map((p) => ({ kind: "project", ...p })),
  ];
  const ext = { Python: "py", JavaScript: "js", TypeScript: "ts" };
  for (const t of tasks) {
    if (!selected(t.id)) continue;
    const where = `${t.kind} ${t.id}`;
    const file = path.join(root, "scripts", "fixtures", "solutions", `${t.id}.${ext[t.language]}`);
    if (!fs.existsSync(file)) {
      fail(where, `missing reference solution ${path.relative(root, file)}`);
      continue;
    }
    const solution = await grade(t.language, fs.readFileSync(file, "utf8"), t.functionName, t.testCases, t.packages);
    if (!solution.ok) fail(where, `reference solution errors: ${solution.error}`);
    else {
      solution.outcomes.forEach((o, i) => {
        if (!o.ok) fail(where, `reference solution raises on test ${i + 1}: ${o.error}`);
        else if (!deepEqual(o.value, t.testCases[i].expected)) {
          fail(where, `reference solution fails test ${i + 1}: got ${JSON.stringify(o.value)}, expected ${JSON.stringify(t.testCases[i].expected)}`);
        }
      });
    }
    const starter = await grade(t.language, t.starter, t.functionName, t.testCases, t.packages);
    if (t.language === "TypeScript" && !starter.ok && /^Line \d+/.test(starter.error || "")) {
      fail(where, `starter does not type-check: ${starter.error}`);
    }
    if (starter.ok && starter.outcomes.every((o, i) => o.ok && deepEqual(o.value, t.testCases[i].expected))) {
      fail(where, "the unchanged starter already passes every test");
    }
  }
}

/* ------------------------------------------------------------------ report */

const started = Date.now();
if (!STATIC_ONLY) await verifyExecution();

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`FAIL  ${e}`);

const counts = {
  lessons: lessons.length,
  practices: Object.keys(practiceDatasets).length,
  challenges: Object.keys(challenges).length,
  projects: projects.length,
  tasks: lessons.filter((l) => l.task).length,
};
const summary = `${counts.lessons} lessons, ${counts.practices} practices, ${counts.tasks} lesson tasks, ${counts.challenges} challenges, ${counts.projects} projects`;
if (errors.length) {
  console.error(`\nContent verification FAILED with ${errors.length} error(s) (${summary}).`);
  process.exit(1);
}
console.log(`Content verification passed${STATIC_ONLY ? " (static only)" : ""}: ${summary} in ${((Date.now() - started) / 1000).toFixed(1)}s.`);
process.exit(0);

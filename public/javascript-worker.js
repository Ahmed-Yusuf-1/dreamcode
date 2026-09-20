/*
 * Dreamcode JavaScript runner (Web Worker).
 *
 * Every run gets a brand new worker (see src/lib/javascriptRunner.ts), so learner
 * code can never touch the page, its DOM, or its storage, and an endless loop is
 * stopped by terminating the worker.
 *
 * Protocol (messages from the page):
 *   { kind: "run", code }                                 -> run a script
 *   { kind: "tests", code, functionName, testCases }      -> call a function per case
 *
 * Replies:
 *   { ok, logs: string[], error?, errorLine?, outcomes?: { ok, value?, error? }[] }
 *
 * Output is printed the way Node and browser devtools print it ([ 1, 2 ],
 * { a: 1 }, 'text' inside collections), so what learners see here matches what
 * they will see in real tools.
 */

// Lines that `new Function` adds before the body ("function anonymous(console\n) {").
const FUNCTION_HEADER_LINES = 2;
// How long a run may keep waiting for pending timers after its main body ends.
const TIMER_BUDGET_MS = 3000;

function isPlainKey(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key);
}

function inspect(value, depth, seen, nested) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  const type = typeof value;
  if (type === "string") return nested ? `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n")}'` : value;
  if (type === "number") return Object.is(value, -0) ? "-0" : String(value);
  if (type === "bigint") return `${value}n`;
  if (type === "boolean") return String(value);
  if (type === "symbol") return value.toString();
  if (type === "function") {
    if (/^class[\s{]/.test(Function.prototype.toString.call(value))) return `[class ${value.name || "(anonymous)"}]`;
    return `[Function: ${value.name || "(anonymous)"}]`;
  }

  if (seen.includes(value)) return "[Circular *1]";
  if (value instanceof Error) return value.stack && nested ? `[${value.name}: ${value.message}]` : `${value.name}: ${value.message}`;
  if (value instanceof Date) return isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
  if (value instanceof RegExp) return String(value);
  if (typeof Promise !== "undefined" && value instanceof Promise) return "Promise { <pending> }";

  if (depth > 3) return Array.isArray(value) ? "[Array]" : "[Object]";
  const next = seen.concat([value]);
  const child = (v) => inspect(v, depth + 1, next, true);

  let body;
  let open;
  let close;
  let prefix = "";

  if (Array.isArray(value)) {
    const items = [];
    let holes = 0;
    for (let i = 0; i < value.length; i += 1) {
      if (!(i in value)) {
        holes += 1;
        continue;
      }
      if (holes) {
        items.push(`<${holes} empty item${holes > 1 ? "s" : ""}>`);
        holes = 0;
      }
      items.push(child(value[i]));
    }
    if (holes) items.push(`<${holes} empty item${holes > 1 ? "s" : ""}>`);
    if (items.length === 0) return "[]";
    body = items;
    open = "[";
    close = "]";
  } else if (value instanceof Map) {
    prefix = `Map(${value.size}) `;
    if (value.size === 0) return `${prefix}{}`;
    body = Array.from(value.entries()).map(([k, v]) => `${child(k)} => ${child(v)}`);
    open = "{";
    close = "}";
  } else if (value instanceof Set) {
    prefix = `Set(${value.size}) `;
    if (value.size === 0) return `${prefix}{}`;
    body = Array.from(value.values()).map(child);
    open = "{";
    close = "}";
  } else {
    const proto = Object.getPrototypeOf(value);
    const ctorName = proto && proto.constructor && proto.constructor.name;
    if (proto === null) prefix = "[Object: null prototype] ";
    else if (ctorName && ctorName !== "Object") prefix = `${ctorName} `;
    const keys = Object.keys(value);
    if (keys.length === 0) return `${prefix}{}`;
    body = keys.map((k) => `${isPlainKey(k) ? k : `'${k}'`}: ${child(value[k])}`);
    open = "{";
    close = "}";
  }

  const oneLine = `${prefix}${open} ${body.join(", ")} ${close}`;
  if (oneLine.length <= 72 && !oneLine.includes("\n")) return oneLine;
  const pad = "  ".repeat(depth + 1);
  const endPad = "  ".repeat(depth);
  return `${prefix}${open}\n${body.map((b) => pad + b).join(",\n")}\n${endPad}${close}`;
}

function format(args) {
  // printf-style %s / %d / %o substitutions, like console.log("%s!", name).
  if (typeof args[0] === "string" && /%[sdifoOc%]/.test(args[0]) && args.length > 1) {
    let rest = args.slice(1);
    const first = args[0].replace(/%([sdifoOc%])/g, (match, spec) => {
      if (spec === "%") return "%";
      if (rest.length === 0) return match;
      const v = rest[0];
      rest = rest.slice(1);
      if (spec === "s") return typeof v === "string" ? v : inspect(v, 0, [], false);
      if (spec === "d" || spec === "i") return String(parseInt(v, 10));
      if (spec === "f") return String(parseFloat(v));
      if (spec === "c") return "";
      return inspect(v, 0, [], true);
    });
    return [first, ...rest.map((v) => inspect(v, 0, [], false))].join(" ");
  }
  return args.map((v) => inspect(v, 0, [], false)).join(" ");
}

function userLineFromStack(error, prefixLines) {
  const stack = error && typeof error.stack === "string" ? error.stack : "";
  const match = stack.match(/(?:<anonymous>|> Function):(\d+):(\d+)/);
  if (!match) return undefined;
  const line = Number(match[1]) - FUNCTION_HEADER_LINES - prefixLines;
  return line > 0 ? line : undefined;
}

function describeError(error) {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return `Uncaught ${inspect(error, 0, [], true)}`;
}

function makeConsole(logs) {
  let indent = "";
  const counts = {};
  const timers = {};
  const push = (text) => logs.push(indent ? text.split("\n").map((l) => indent + l).join("\n") : text);
  const out = (...args) => push(format(args));
  return {
    log: out,
    info: out,
    debug: out,
    trace: out,
    warn: out,
    error: out,
    dir: (v) => push(inspect(v, 0, [], true)),
    table: (data) => {
      if (data && typeof data === "object") {
        const rows = Array.isArray(data) ? data.map((row, i) => [i, row]) : Object.entries(data);
        rows.forEach(([key, row]) => push(`${key}: ${inspect(row, 0, [], true)}`));
      } else {
        out(data);
      }
    },
    group: (...label) => {
      if (label.length) out(...label);
      indent += "  ";
    },
    groupCollapsed: (...label) => {
      if (label.length) out(...label);
      indent += "  ";
    },
    groupEnd: () => {
      indent = indent.slice(2);
    },
    assert: (condition, ...args) => {
      if (!condition) push(`Assertion failed${args.length ? `: ${format(args)}` : ""}`);
    },
    count: (label = "default") => {
      counts[label] = (counts[label] || 0) + 1;
      push(`${label}: ${counts[label]}`);
    },
    countReset: (label = "default") => {
      counts[label] = 0;
    },
    time: (label = "default") => {
      timers[label] = Date.now();
    },
    timeEnd: (label = "default") => {
      if (timers[label] !== undefined) push(`${label}: ${Date.now() - timers[label]}ms`);
      delete timers[label];
    },
    timeLog: (label = "default") => {
      if (timers[label] !== undefined) push(`${label}: ${Date.now() - timers[label]}ms`);
    },
    clear: () => {
      logs.length = 0;
    },
  };
}

// Track pending timers so a run can wait for setTimeout callbacks (event loop
// lessons) instead of cutting their output off.
const nativeSetTimeout = self.setTimeout.bind(self);
const nativeClearTimeout = self.clearTimeout.bind(self);
const nativeSetInterval = self.setInterval.bind(self);
const nativeClearInterval = self.clearInterval.bind(self);
const pendingTimers = new Set();

self.setTimeout = (fn, delay, ...args) => {
  const id = nativeSetTimeout(() => {
    pendingTimers.delete(id);
    if (typeof fn === "function") fn(...args);
  }, delay);
  pendingTimers.add(id);
  return id;
};
self.clearTimeout = (id) => {
  pendingTimers.delete(id);
  nativeClearTimeout(id);
};
self.setInterval = (fn, delay, ...args) => {
  const id = nativeSetInterval(fn, delay, ...args);
  pendingTimers.add(id);
  return id;
};
self.clearInterval = (id) => {
  pendingTimers.delete(id);
  nativeClearInterval(id);
};

const sleep = (ms) => new Promise((resolve) => nativeSetTimeout(resolve, ms));

async function settle() {
  const started = Date.now();
  // Always flush queued microtasks and zero-delay timers.
  for (let i = 0; i < 3; i += 1) await sleep(0);
  while (pendingTimers.size > 0 && Date.now() - started < TIMER_BUDGET_MS) {
    await sleep(10);
  }
  return pendingTimers.size === 0;
}

function cloneable(value) {
  try {
    return structuredClone(value);
  } catch {
    return { __dcUncloneable: inspect(value, 0, [], true) };
  }
}

self.onmessage = async (event) => {
  const request = event.data;
  const logs = [];
  const consoleShim = makeConsole(logs);
  let uncaught = null;

  const onError = (e) => {
    e.preventDefault();
    if (!uncaught) uncaught = e.error || new Error(e.message);
  };
  const onRejection = (e) => {
    e.preventDefault();
    if (!uncaught) uncaught = e.reason instanceof Error ? e.reason : new Error(`Uncaught (in promise) ${inspect(e.reason, 0, [], true)}`);
  };
  self.addEventListener("error", onError);
  self.addEventListener("unhandledrejection", onRejection);

  try {
    if (request.kind === "run") {
      let execute;
      try {
        execute = new Function("console", `return (async () => {\n${request.code}\n})();`);
      } catch (error) {
        self.postMessage({ ok: false, logs, error: describeError(error) });
        return;
      }
      try {
        await execute(consoleShim);
      } catch (error) {
        self.postMessage({ ok: false, logs, error: describeError(error), errorLine: userLineFromStack(error, 1) });
        return;
      }
      const finished = await settle();
      if (uncaught) {
        self.postMessage({ ok: false, logs, error: describeError(uncaught), errorLine: userLineFromStack(uncaught, 1) });
        return;
      }
      if (!finished) logs.push("(stopped waiting for timers that were still scheduled)");
      self.postMessage({ ok: true, logs });
      return;
    }

    if (request.kind === "tests") {
      let fn;
      try {
        const getFunction = new Function(
          "console",
          `${request.code}\n;return typeof ${request.functionName} === "undefined" ? undefined : ${request.functionName};`,
        );
        fn = getFunction(consoleShim);
      } catch (error) {
        self.postMessage({ ok: false, logs, error: describeError(error), errorLine: userLineFromStack(error, 0) });
        return;
      }
      if (typeof fn !== "function") {
        self.postMessage({ ok: false, logs, error: `ReferenceError: ${request.functionName} is not defined as a function` });
        return;
      }
      const outcomes = [];
      for (const test of request.testCases) {
        try {
          const actual = await fn(...structuredClone(test.args));
          outcomes.push({ ok: true, value: cloneable(actual) });
        } catch (error) {
          outcomes.push({ ok: false, error: describeError(error) });
        }
      }
      await settle();
      self.postMessage({ ok: true, logs, outcomes });
      return;
    }

    throw new Error("Unknown runner request");
  } catch (error) {
    self.postMessage({ ok: false, logs, error: describeError(error) });
  } finally {
    self.removeEventListener("error", onError);
    self.removeEventListener("unhandledrejection", onRejection);
  }
};

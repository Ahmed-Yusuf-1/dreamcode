self.onmessage = async (event) => {
  const request = event.data;
  const logs = [];
  const console = {
    log: (...args) => logs.push(args.map((arg) => {
      if (typeof arg === "object") {
        try { return JSON.stringify(arg); } catch { return String(arg); }
      }
      return String(arg);
    }).join(" ")),
  };

  try {
    if (request.kind === "run") {
      const execute = new Function("console", `return (async () => {\n${request.code}\n})();`);
      await execute(console);
      // Let queued promise and zero-delay timer examples flush their output.
      for (let i = 0; i < 3; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      self.postMessage({ ok: true, logs });
      return;
    }

    if (request.kind === "tests") {
      const getFunction = new Function("console", `${request.code}; return ${request.functionName};`);
      const fn = getFunction(console);
      if (typeof fn !== "function") throw new Error(`${request.functionName} is not defined`);
      const passes = [];
      for (const test of request.testCases) {
        try {
          const actual = await fn(...test.args);
          passes.push(JSON.stringify(actual) === JSON.stringify(test.expected));
        } catch {
          passes.push(false);
        }
      }
      self.postMessage({ ok: true, logs, passes });
      return;
    }

    throw new Error("Unknown runner request");
  } catch (error) {
    self.postMessage({
      ok: false,
      logs,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

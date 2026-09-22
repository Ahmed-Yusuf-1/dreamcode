const runCheck = (ms, index) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ms < 0) reject(new Error(`check ${index} failed`));
      else resolve(index);
    }, Math.abs(ms));
  });

async function runChecklist(checks) {
  const results = await Promise.allSettled(checks.map((ms, i) => runCheck(ms, i)));
  return {
    passed: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").map((r) => r.reason.message),
  };
}

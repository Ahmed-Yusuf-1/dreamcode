import type { LessonTask } from "@/content/types";

export interface TaskCheck {
  ok: boolean;
  /** What is still missing, in plain words. */
  message: string;
}

function normalize(line: string) {
  return line.replace(/\s+$/g, "").replace(/^\s+/g, "");
}

/**
 * Checks a "Your turn" task against the learner's code and the output of their
 * last successful run. Expected lines must appear in order (other lines may sit
 * between them), and every required pattern must match the code.
 */
export function checkTask(task: LessonTask, code: string, output: string[]): TaskCheck {
  const stripped = code
    .split("\n")
    .filter((l) => !/^\s*(#|\/\/)/.test(l))
    .join("\n");

  for (const pattern of task.mustInclude ?? []) {
    let re: RegExp;
    try {
      re = new RegExp(pattern, "m");
    } catch {
      continue;
    }
    if (!re.test(stripped)) {
      return { ok: false, message: task.hint || "Your code is missing a piece this task asks for." };
    }
  }

  const expected = (task.expectOutput ?? []).map(normalize);
  if (expected.length > 0) {
    const lines = output.flatMap((chunk) => chunk.split("\n")).map(normalize);
    if (task.exact) {
      const printed = lines.filter((l) => l !== "");
      const same = printed.length === expected.length && printed.every((l, i) => l === expected[i]);
      return same
        ? { ok: true, message: "Task complete." }
        : { ok: false, message: task.hint || `The output should be exactly: ${expected.join(", ")}` };
    }
    let at = 0;
    for (const line of lines) {
      if (at < expected.length && line === expected[at]) at += 1;
    }
    if (at < expected.length) {
      return {
        ok: false,
        message: task.hint || `The output should include: ${expected[at]}`,
      };
    }
  }

  return { ok: true, message: "Task complete." };
}

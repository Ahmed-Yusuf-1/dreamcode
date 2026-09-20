import { expect, test } from "@playwright/test";
import { consoleLog, run, setCode, solution, watchErrors } from "./helpers";

test("a JavaScript lesson runs and checks the task", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/lesson/js-variables");
  await run(page);
  await expect(consoleLog(page)).toContainText("Done.");
  await setCode(page, 'const place = "the sky";\nlet mood = "curious";\nconsole.log(place, mood);');
  await run(page);
  await expect(consoleLog(page)).toContainText("the sky curious");
  expect(errors).toEqual([]);
});

test("JavaScript errors point at the right line and runaway loops stop", async ({ page }) => {
  await page.goto("/lesson/js-variables");
  await setCode(page, "const a = 1;\nconsole.log(b);");
  await run(page);
  await expect(consoleLog(page)).toContainText("ReferenceError: b is not defined (line 2)");
  await setCode(page, "while (true) {}");
  await run(page);
  await expect(consoleLog(page)).toContainText("Stopped after 5 seconds");
});

test("TypeScript type errors are reported before running", async ({ page }) => {
  await page.goto("/lesson/ts-types");
  await setCode(page, 'let stars: number = "many";\nconsole.log(stars);');
  await run(page);
  await expect(consoleLog(page)).toContainText("Line 1: Type 'string' is not assignable to type 'number'.");
});

test("DOM lessons change a live, sandboxed page", async ({ page }) => {
  await page.goto("/lesson/js-dom-basics");
  const preview = page.frameLocator('iframe[title="Page preview"]');
  await setCode(page, 'document.querySelector("h1").textContent = "Hello from the test";\nconsole.log("changed");');
  await run(page);
  await expect(preview.locator("h1")).toHaveText("Hello from the test");
  await expect(consoleLog(page)).toContainText("changed");
  await expect(page.locator('iframe[title="Page preview"]')).toHaveAttribute("sandbox", "allow-scripts");
});

test("a passing challenge pays XP once and shows on the dashboard", async ({ page }) => {
  await page.goto("/challenge/js-top-words");
  await setCode(page, solution("js-top-words.js"));
  await page.getByRole("button", { name: /Run tests/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/5 of 5 passing/)).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.getByText(/[1-9]\d* \/ 800 XP/)).toBeVisible();
});

test("a failing project shows what it got and what it expected", async ({ page }) => {
  await page.goto("/project/habit-tracker");
  await page.getByRole("button", { name: /Run tests/ }).click();
  await expect(page.getByText(/^got /).first()).toBeVisible();
  await expect(page.getByText(/of 4 passing/)).toBeVisible();
});

test("Python runs in the browser, with input() echoed like a terminal", async ({ page }) => {
  test.slow();
  await page.goto("/lesson/input-output");
  await run(page);
  await expect(consoleLog(page)).toContainText("Done.", { timeout: 120_000 });
  await setCode(page, "name = input('Name? ')\nprint('hi', name)\nprint(undefined_name)");
  await page.getByLabel(/one line per input/).fill("Ada");
  await run(page);
  await expect(consoleLog(page)).toContainText("Name? Ada");
  await expect(consoleLog(page)).toContainText("hi Ada");
  await expect(consoleLog(page)).toContainText("NameError");
  await expect(consoleLog(page)).toContainText("line 3");
});

test("a data science lesson fetches NumPy and runs it", async ({ page }) => {
  test.slow();
  await page.goto("/lesson/py-numpy-arrays");
  await page.getByRole("button", { name: /▶ Run$/ }).click();
  await expect(consoleLog(page)).toContainText("Downloading numpy");
  await expect(consoleLog(page)).toContainText("Sum: 18500", { timeout: 180_000 });
  await setCode(page, "import numpy as np\n\naltitudes = np.array([2000, 5000, 8000, 3500])\nhigh = altitudes[altitudes > 3000]\nprint(high)\nprint(high.mean())");
  await run(page);
  await expect(consoleLog(page)).toContainText("[5000 8000 3500]");
  await expect(page.getByText("✓ Done")).toBeVisible();
});

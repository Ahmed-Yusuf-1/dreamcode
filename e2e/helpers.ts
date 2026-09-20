import fs from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

export const solution = (file: string) => fs.readFileSync(path.join(__dirname, "..", "scripts", "fixtures", "solutions", file), "utf8");

/** Replaces the contents of the page's editable code editor. */
export async function setCode(page: Page, code: string) {
  const editor = page.locator(".cm-content[contenteditable=true]").first();
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Delete");
  await page.keyboard.insertText(code);
}

export async function run(page: Page) {
  await page.getByRole("button", { name: /▶ Run$/ }).click();
  await expect(page.getByRole("button", { name: /▶ Run$/ })).toBeEnabled({ timeout: 120_000 });
}

export const consoleLog = (page: Page) => page.getByRole("log").first();

/** Collects console errors and uncaught exceptions for a page. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource: the server responded with a status of 404/.test(m.text())) errors.push(m.text());
  });
  return errors;
}

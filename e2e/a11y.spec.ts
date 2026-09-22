import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Accessibility audit. Every page a learner spends time on is checked against
 * WCAG 2 A and AA rules; anything serious or critical fails the build.
 */
const PAGES = [
  "/",
  "/start",
  "/login",
  "/dashboard",
  "/lessons",
  "/journey",
  "/peaks",
  "/projects",
  "/badges",
  "/leaderboard",
  "/profile",
  "/review",
  "/placement",
  "/industry",
  "/lesson/variables",
  "/lesson/cs-hello",
  "/practice/variables",
  "/challenge/rain-counter",
  "/project/sky-house",
];

for (const path of PAGES) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    // color-contrast is disabled: the pages sit on a CSS gradient, which axe
    // cannot resolve, so it falls back to white and reports false failures.
    // Contrast is measured against the painted sky in contrast.spec.ts.
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(["color-contrast"])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const summary = serious.map((v) => `${v.id} (${v.impact}) on ${v.nodes.length}: ${v.nodes[0]?.target?.join(" ")}`).join("\n");
    expect(summary, summary).toBe("");
  });
}

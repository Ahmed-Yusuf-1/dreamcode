import { expect, test } from "@playwright/test";
import { setCode, solution } from "./helpers";

/**
 * Badges, ranks and the leaderboard, as a guest. Everything here runs against
 * the browser's own copy of the rules; the database enforces the same ones for
 * signed-in learners (scripts/test-db.mjs).
 */

test("the trophy case groups badges by rarity and keeps secrets", async ({ page }) => {
  await page.goto("/badges");
  for (const rarity of ["Legendary", "Epic", "Rare", "Common"]) {
    await expect(page.getByRole("heading", { name: rarity, exact: true })).toBeVisible();
  }
  await expect(page.getByText("Hidden badge").first()).toBeVisible();
  await expect(page.getByText("Python Master").first()).toBeVisible();
  await expect(page.getByText("Closest to earning")).toBeVisible();
});

test("passing a peak earns a badge, announces it, and it can be worn", async ({ page }) => {
  await page.goto("/challenge/js-top-words");
  await setCode(page, solution("js-top-words.js"));
  await page.getByRole("button", { name: /Run tests/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30_000 });

  // The victory modal names the badge, and the toast announces it app-wide.
  await expect(page.getByRole("dialog").getByText("Cloud Hopper")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("status").getByText("Cloud Hopper")).toBeVisible();

  await page.goto("/badges");
  const card = page.locator("li", { hasText: "Cloud Hopper" }).first();
  await expect(card.getByRole("button", { name: "Wear this" })).toBeVisible();
  await card.getByRole("button", { name: "Wear this" }).click();
  await expect(card.getByRole("button", { name: /Your emblem/ })).toBeVisible();

  // XP from the peak and its badge both land on the dashboard.
  await page.goto("/dashboard");
  await expect(page.getByText(/Stargazer · Level/).first()).toBeVisible();
  await expect(page.getByText(/Today's goal|Today’s goal/)).toBeVisible();
});

test("the leaderboard invites a guest to sign up and switches range", async ({ page }) => {
  await page.goto("/leaderboard");
  await expect(page.getByRole("heading", { name: "Who is climbing" })).toBeVisible();
  await expect(page.getByText("Your progress is saved in this browser")).toBeVisible();
  const allTime = page.getByRole("button", { name: "All time" });
  await allTime.click();
  await expect(allTime).toHaveAttribute("aria-pressed", "true");
  // Without Supabase configured the board is empty, and says so rather than breaking.
  await expect(page.getByText(/Nobody has claimed a handle yet|could not be reached/)).toBeVisible();
});

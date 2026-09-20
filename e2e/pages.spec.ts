import { expect, test } from "@playwright/test";
import { watchErrors } from "./helpers";

const ROUTES = [
  "/",
  "/start",
  "/login",
  "/signup",
  "/dashboard",
  "/lessons",
  "/journey",
  "/peaks",
  "/projects",
  "/review",
  "/badges",
  "/leaderboard",
  "/profile",
  "/placement",
  "/industry",
  "/lesson/variables",
  "/lesson/js-dom-basics",
  "/lesson/ts-generics",
  "/lesson/cs-hello",
  "/practice/variables",
  "/challenge/rain-counter",
  "/project/typed-store",
];

for (const route of ROUTES) {
  test(`${route} renders cleanly @mobile`, async ({ page }) => {
    const errors = watchErrors(page);
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test("unknown pages return the 404 page", async ({ page }) => {
  const response = await page.goto("/definitely-not-here");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("the nav fits on a phone and Explore reaches every hub @mobile", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone layout only");
  await page.goto("/lessons");
  const brand = await page.getByRole("link", { name: "dreamcode" }).first().boundingBox();
  const explore = await page.getByRole("button", { name: /Explore/ }).boundingBox();
  expect(brand && explore && brand.x + brand.width <= explore.x).toBeTruthy();
  await page.getByRole("button", { name: /Explore/ }).click();
  await page.getByRole("menuitem", { name: "Problem Peaks" }).click();
  await expect(page).toHaveURL(/\/peaks$/);
});

test("Explore opens on hover and click, and closes with Escape", async ({ page, isMobile }) => {
  test.skip(isMobile, "mouse and keyboard layout");
  await page.goto("/lessons");
  const button = page.getByRole("button", { name: /Explore/ });
  await button.hover();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await page.mouse.move(0, 400);
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("menuitem", { name: "Badges" }).click();
  await expect(page).toHaveURL(/\/badges$/);
});

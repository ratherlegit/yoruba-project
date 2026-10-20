import { expect, test } from "@playwright/test";
import { TRANSFORMS } from "../src/content/transforms";

test("Landing page: eight activity cards in order and the empty stats message", async ({ page }) => {
  await page.goto("/");
  const cards = page.getByTestId("activity-card");
  await expect(cards).toHaveCount(8);
  await expect(cards.locator("strong")).toHaveText(["Grammar", "Vocab", "Numbers", "Sound Bank", "Proverbs", "Transform", "Songs", "Dialogues"]);
  await expect(page.getByText("Start a lesson to see your stats")).toBeVisible();
  await expect(page.getByTestId("card-progress")).toHaveCount(0);
});

test("Grammar card opens the grammar page with the five levels", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("activity-card").first().click();
  await expect(page).toHaveURL(/\/grammar$/);
  await expect(page.locator('a[href^="/level/"]')).toHaveCount(5);
  await expect(page.getByRole("checkbox", { name: "Unlock all levels" })).toBeVisible();
});

test("A Transform check shows up on the landing card and the stats page after a reload", async ({ page }) => {
  await page.goto("/transform");
  await page.getByTestId("transform-input").fill(TRANSFORMS[0]!.answers[0]!);
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("transform-result")).toContainText("Correct");
  await page.goto("/");
  await expect(page.getByTestId("activity-card").nth(5)).toContainText("1 sentence checked");
  await page.getByRole("link", { name: "See all stats" }).click();
  await expect(page).toHaveURL(/\/stats$/);
  await expect(page.getByTestId("stats-transform")).toContainText("Negative: 1 right, 0 close, 0 wrong");
  await page.reload();
  await expect(page.getByTestId("stats-transform")).toContainText("Negative: 1 right");
});

test("A proverb guess and a tone practice answer show up on the stats page", async ({ page }) => {
  await page.goto("/proverbs");
  await page.getByTestId("choice").first().click();
  await page.goto("/sounds");
  const practice = page.getByTestId("practice");
  await practice.getByTestId("choice").first().click();
  await page.goto("/stats");
  await expect(page.getByTestId("stats-proverbs")).toContainText("1 of");
  await expect(page.getByTestId("stats-proverbs")).toContainText("proverbs guessed");
  await expect(page.getByTestId("stats-tone")).toContainText(/of 1 right/);
  await expect(page.getByTestId("stats-days")).toContainText("Days practised: 1");
});

test("The pages render when localStorage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
  });
  for (const path of ["/", "/stats", "/proverbs", "/transform"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test.describe("phone width", () => {
  test.use({ viewport: { width: 375, height: 800 } });
  for (const path of ["/", "/grammar", "/stats"]) {
    test(`no horizontal scroll and every nav link visible at ${path}`, async ({ page }) => {
      await page.goto(path);
      for (const name of ["Grammar", "Vocab", "Numbers", "Sound Bank", "Proverbs", "Songs", "Dialogues", "Transform", "Stats", "About"]) {
        await expect(page.getByRole("navigation").getByRole("link", { name })).toBeVisible();
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

for (const scheme of ["light", "dark"] as const) {
  test(`Landing and stats pages are visible in ${scheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await expect(page.getByTestId("activity-card").first()).toBeVisible();
    await page.goto("/stats");
    await expect(page.getByTestId("stats-grammar")).toBeVisible();
  });
}

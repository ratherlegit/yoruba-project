import { expect, test, type Page } from "@playwright/test";

const LEVEL_IDS = ["getting-started", "beginner", "intermediate", "advanced", "mastery"];

async function unlockAll(page: Page) {
  // Seed only when absent: init scripts rerun on every navigation and would wipe saved results.
  await page.addInitScript(() => {
    if (localStorage.getItem("yp:progress:v1") === null)
      localStorage.setItem("yp:progress:v1", JSON.stringify({ completedLessons: {}, skipAhead: true, theme: "system" }));
  });
}

async function answerEverything(page: Page) {
  for (let n = 0; n < 8; n++) {
    const choice = page.getByTestId("choice").first();
    if (await choice.count()) {
      await choice.click();
    } else {
      const bank = page.getByTestId("bank-word");
      while (await bank.count()) await bank.first().click();
      await page.getByRole("button", { name: "Check" }).click();
    }
    await page.getByRole("button", { name: /^(Continue|See results)$/ }).click();
  }
}

for (const scheme of ["light", "dark"] as const) {
  test.describe(`${scheme} mode`, () => {
    test.use({ colorScheme: scheme });

    for (const levelId of LEVEL_IDS) {
      test(`complete the first lesson of ${levelId}`, async ({ page }) => {
        await unlockAll(page);
        await page.goto(`/level/${levelId}`);
        await page.getByRole("link", { name: /Lesson 1/ }).click();
        await page.getByRole("button", { name: "Start practice" }).click();
        await answerEverything(page);
        await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
        await page.goto(`/level/${levelId}`);
        await expect(page.getByText(/best \d+%/)).toBeVisible();
      });
    }
  });
}

test.describe("phone width", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  for (const path of [
    "/",
    "/level/getting-started",
    "/lesson/getting-started/gs-1",
    "/lesson/getting-started/gs-3",
    "/lesson/mastery/m-4",
    "/about",
  ]) {
    test(`no horizontal scroll at ${path}`, async ({ page }) => {
      await unlockAll(page);
      await page.goto(path);
      for (const b of await page.getByRole("button", { name: "Show all" }).all()) await b.click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("the app still renders when localStorage is blocked", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Learn Yoruba grammar" })).toBeVisible();
  });
});

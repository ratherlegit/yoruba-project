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
        await expect(page.getByText(/Best \d+%/)).toBeVisible();
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

  test("no horizontal scroll on an activity page", async ({ page }) => {
    await unlockAll(page);
    await page.goto("/lesson/getting-started/gs-1");
    await page.getByRole("button", { name: "Start practice" }).click();
    await expect(page.getByText("Question 1 of 8")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("no horizontal scroll on the results view", async ({ page }) => {
    await unlockAll(page);
    await page.goto("/lesson/getting-started/gs-1");
    await page.getByRole("button", { name: "Start practice" }).click();
    await answerEverything(page);
    await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("the app still renders when localStorage is blocked", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Learn Yoruba, tone by tone" })).toBeVisible();
  });
});

test("the manual theme toggle sets data-theme and persists across reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
});

test("Listen on a word breakdown fetches its audio clip", async ({ page }) => {
  await unlockAll(page);
  await page.goto("/lesson/getting-started/gs-2");
  const showAll = page.getByRole("button", { name: "Show all" }).first();
  if (await showAll.count()) await showAll.click();
  const listen = page.getByRole("button", { name: /^Listen to/ }).first();
  await expect(listen).toBeVisible();
  const response = page.waitForResponse((r) => /\/audio\/[0-9a-f]{12}\.(mp3|ogg|wav)$/.test(r.url()));
  await listen.click();
  // Chromium's media element asks for the clip with a Range header, so 206 is as good as 200.
  const res = await response;
  expect([200, 206]).toContain(res.status());
  expect(res.headers()["content-type"] ?? "").toMatch(/^audio\//);
});

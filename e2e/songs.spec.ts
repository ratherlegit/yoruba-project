import { expect, test } from "@playwright/test";

test("Songs: from the landing card to a song page with its video and lyric lines", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("activity-card").filter({ hasText: "Songs" }).click();
  await expect(page).toHaveURL(/\/songs$/);
  await expect(page.getByTestId("song-card")).toHaveCount(9);
  await page.getByTestId("song-card").filter({ hasText: "Okunkun" }).click();
  await expect(page).toHaveURL(/\/songs\/okunkun$/);
  await expect(page.locator("iframe[src^='https://www.youtube-nocookie.com/embed/']")).toHaveCount(1);
  await expect(page.getByTestId("song-line").first()).toContainText("Ọjọ́ ti fe ṣ'òkùnkùn");
  const full = page.getByRole("link", { name: /full lyrics on notjustok/i });
  await expect(full).toHaveAttribute("target", "_blank");
  await expect(full).toHaveAttribute("rel", "noopener noreferrer");
});

test("Songs: the genre filter narrows the list and All brings it back", async ({ page }) => {
  await page.goto("/songs");
  const filter = page.getByRole("group", { name: "Filter by genre" });
  await filter.getByRole("button", { name: "Children's" }).click();
  await expect(page.getByTestId("song-card")).toHaveCount(2);
  await filter.getByRole("button", { name: "All" }).click();
  await expect(page.getByTestId("song-card")).toHaveCount(9);
});

test.describe("phone width", () => {
  test.use({ viewport: { width: 375, height: 800 } });
  for (const path of ["/songs", "/songs/awe", "/songs/motigbana"]) {
    test(`no horizontal scroll at ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

import { expect, test } from "@playwright/test";

test("Dialogues: from the landing card to a conversation, hide the English and answer a question", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("activity-card").filter({ hasText: "Dialogues" }).click();
  await expect(page).toHaveURL(/\/dialogues$/);
  await expect(page.getByTestId("dialogue-level")).toHaveCount(5);
  await expect(page.getByTestId("dialogue-card")).toHaveCount(15);
  await page.getByTestId("dialogue-card").filter({ hasText: "Good morning" }).first().click();
  await expect(page).toHaveURL(/\/dialogues\/gs-morning$/);
  await expect(page.getByTestId("dialogue-line").first()).toContainText("Ẹ káàárọ̀.");
  await expect(page.getByTestId("dialogue-english")).toHaveCount(4);
  await page.getByRole("button", { name: "Hide English" }).click();
  await expect(page.getByTestId("dialogue-english")).toHaveCount(0);
  await page.getByTestId("choice").first().click();
  await expect(page.locator('[data-state="correct"]')).toHaveCount(1);
  // Some female lines reuse clips that already exist; no male clips exist yet, so male lines have no Listen button.
  await expect(page.locator(".dlg-male button")).toHaveCount(0);
});

test.describe("phone width", () => {
  test.use({ viewport: { width: 375, height: 800 } });
  for (const path of ["/dialogues", "/dialogues/gs-names", "/dialogues/m-advice"]) {
    test(`no horizontal scroll at ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

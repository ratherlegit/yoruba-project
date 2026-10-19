import { expect, test } from "@playwright/test";

test("Proverbs: guess a meaning, see the reveal, move to the next proverb", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Proverbs" }).first().click();
  await expect(page).toHaveURL(/\/proverbs$/);
  await expect(page.getByTestId("proverb-position")).toContainText("Proverb 1 of");
  await expect(page.getByTestId("proverb-reveal")).toHaveCount(0);
  await page.getByTestId("choice").first().click();
  await expect(page.getByTestId("proverb-reveal")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByTestId("proverb-position")).toContainText("Proverb 2 of");
});

test("Proverbs card is visible in dark mode", async ({ page }) => {
  await page.goto("/proverbs");
  await page.getByRole("button", { name: /Switch to dark mode/ }).click();
  await expect(page.getByTestId("proverb-card")).toBeVisible();
});

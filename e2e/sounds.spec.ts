import { expect, test } from "@playwright/test";

test("Sound Bank is reachable from the nav and shows every section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Sound Bank" }).first().click();
  await expect(page).toHaveURL(/\/sounds$/);
  for (const name of ["Vowels", "Consonants", "Tones", "Minimal pairs", "Practice"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "ṣ", exact: true })).toBeVisible();
});

test("Sound Bank works in dark mode and jump links move to a section", async ({ page }) => {
  await page.goto("/sounds");
  await page.getByRole("button", { name: /Switch to dark mode/ }).click();
  await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Tones" }).click();
  await expect(page).toHaveURL(/#tones$/);
  await expect(page.getByRole("heading", { level: 2, name: "Tones" })).toBeInViewport();
});

test("practice shows a friendly message or a working quiz", async ({ page }) => {
  await page.goto("/sounds");
  const practice = page.getByTestId("practice");
  await expect(practice).toBeVisible();
  const choices = practice.getByTestId("choice");
  if (await choices.count()) {
    await choices.first().click();
    await expect(practice.locator('[data-state="correct"]')).toHaveCount(1);
  } else {
    await expect(practice).toContainText("audio");
  }
});

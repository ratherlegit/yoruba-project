import { expect, test, type Page } from "@playwright/test";

async function openGreetings(page: Page) {
  await page.goto("/vocab");
  await page.getByRole("link", { name: /Getting Started/i }).click();
  await page.getByRole("link", { name: /Greetings and courtesies/ }).click();
  await expect(page.getByRole("heading", { name: "Greetings and courtesies" })).toBeVisible();
}

async function answerAll(page: Page) {
  for (let n = 1; n <= 10; n++) {
    await expect(page.getByText(`Question ${n} of 10`)).toBeVisible();
    await page.getByTestId("choice").first().click();
    await page.getByRole("button", { name: /^(Continue|See results)$/ }).click();
  }
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
}

async function runTopic(page: Page) {
  await openGreetings(page);

  await expect(page.getByText("Card 1 of 10")).toBeVisible();
  await page.getByRole("button", { name: "Flip" }).click();
  await expect(page.getByTestId("flashcard-back")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Card 2 of 10")).toBeVisible();
  await expect(page.getByTestId("flashcard-back")).toHaveCount(0);

  await page.getByRole("button", { name: "Quiz" }).click();
  await answerAll(page);
  await page.getByRole("link", { name: "Back to level" }).first().click();
  await expect(page.getByText(/Best quiz \d+%/)).toBeVisible();

  await page.getByRole("link", { name: /Greetings and courtesies/ }).click();
  await page.getByRole("button", { name: "Gap fill" }).click();
  await answerAll(page);
  await page.getByRole("link", { name: "Back to level" }).first().click();
  await expect(page.getByText(/Best gap-fill \d+%/)).toBeVisible();
}

test("Greetings topic: flashcards, quiz and gap fill record completion", async ({ page }) => {
  await runTopic(page);
});

test("Greetings topic works in dark mode set with the theme toggle", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Theme").selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await runTopic(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("the Vocab nav link and the Home card both reach /vocab", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation").getByRole("link", { name: "Vocab" }).click();
  await expect(page).toHaveURL(/\/vocab$/);
  await expect(page.getByRole("heading", { name: "Learn Yoruba words" })).toBeVisible();

  await page.goto("/");
  await page.getByRole("main").getByRole("link", { name: /Common words by topic/ }).click();
  await expect(page).toHaveURL(/\/vocab$/);
});

test.describe("phone width", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("no horizontal scroll on the vocab topic page", async ({ page }) => {
    await openGreetings(page);
    await page.getByRole("button", { name: "Flip" }).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

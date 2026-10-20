import { expect, test } from "@playwright/test";
import { TRANSFORMS } from "../src/content/transforms";

const first = TRANSFORMS[0]!;

test("Transform: type the model answer, see Correct, move to the next sentence", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Transform" }).first().click();
  await expect(page).toHaveURL(/\/transform$/);
  await expect(page.getByTestId("transform-position")).toContainText("Sentence 1 of");
  await page.getByRole("button", { name: "Advanced" }).click();
  await page.getByTestId("transform-input").fill(first.answers[0]!);
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("transform-result")).toContainText("Correct");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByTestId("transform-position")).toContainText("Sentence 2 of");
});

test("Transform accepts a pasted decomposed (NFD) answer", async ({ page }) => {
  await page.goto("/transform");
  await page.getByRole("button", { name: "Advanced" }).click();
  await page.getByTestId("transform-input").fill(first.answers[0]!.normalize("NFD"));
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("transform-result")).toContainText("Correct");
});

test("Transform: easy mode accepts the answer without dots or tones, advanced calls it close", async ({ page }) => {
  const plain = first.answers[0]!.normalize("NFD").replace(/[̀-ͯ]/g, "");
  await page.goto("/transform");
  await page.getByTestId("transform-input").fill(plain);
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("transform-result")).toContainText("Correct");
  await page.goto("/transform");
  await page.getByRole("button", { name: "Advanced" }).click();
  await page.getByTestId("transform-input").fill(plain);
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("transform-result")).toContainText("check the dots and tones");
});

test("Transform: the tap row adds a letter and a tone mark", async ({ page }) => {
  await page.goto("/transform");
  const input = page.getByTestId("transform-input");
  await input.fill("l");
  await page.getByRole("button", { name: "ọ", exact: true }).click();
  await page.getByRole("button", { name: "Grave accent" }).click();
  expect(await input.inputValue()).toBe("lọ̀".normalize("NFC"));
});

test("Transform card is visible in dark mode", async ({ page }) => {
  await page.goto("/transform");
  await page.getByRole("button", { name: /Switch to dark mode/ }).click();
  await expect(page.getByTestId("transform-card")).toBeVisible();
});

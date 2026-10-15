import { expect, test, type Page } from "@playwright/test";
import type { BlankQuestion, PickQuestion } from "../src/content/types";
import { getVocabTopic } from "../src/content/vocab";
import { buildGap, buildQuiz } from "../src/lib/vocab-questions";

const TOPIC = getVocabTopic("getting-started", "gs-greetings")!;

// Mirrors VocabTopicPage: attempt n of a mode is built with seed `${topic.id}#${n}`.
type VocabQuestion = PickQuestion | BlankQuestion;
const questionsFor = (mode: "quiz" | "gap", attempt: number): VocabQuestion[] =>
  mode === "quiz" ? buildQuiz(TOPIC, `${TOPIC.id}#${attempt}`) : buildGap(TOPIC, `${TOPIC.id}#${attempt}`);

const answerOf = (q: VocabQuestion): string => (q.type === "pick" ? q.choices[q.answer]! : q.answer);

async function openGreetings(page: Page) {
  await page.goto("/vocab");
  await page.getByRole("link", { name: /Getting Started/ }).click();
  await page.getByRole("link", { name: /Greetings and courtesies/ }).click();
  await expect(page.getByRole("heading", { name: "Greetings and courtesies" })).toBeVisible();
}

// Answers every question, correctly when `pickRight(n)` is true and with a wrong choice otherwise,
// checks the feedback against the choice state each time, and checks the final score.
async function run(page: Page, mode: "quiz" | "gap", attempt: number, pickRight: (n: number) => boolean) {
  const qs = questionsFor(mode, attempt);
  expect(qs).toHaveLength(10);
  let right = 0;
  for (const [n, q] of qs.entries()) {
    await expect(page.getByText(`Question ${n + 1} of 10`)).toBeVisible();
    await expect(page.getByText(q.prompt, { exact: true })).toBeVisible();
    const answer = answerOf(q);
    const choices = page.getByTestId("choice");
    const texts = (await choices.allTextContents()).map((t) => t.trim());
    expect([...texts].sort()).toEqual([...q.choices].sort());
    const target = pickRight(n) ? answer : texts.find((t) => t !== answer)!;
    // The ✓ / ✗ marks are aria-hidden, so the accessible name stays the choice text after answering.
    const button = choices.and(page.getByRole("button", { name: target, exact: true }));
    await button.click();
    const status = page.getByRole("status").locator("p").first(); // the feedback line, not the Listen button
    if (target === answer) {
      right++;
      await expect(button).toHaveAttribute("data-state", "correct");
      await expect(status).toHaveText("Correct.");
    } else {
      await expect(button).toHaveAttribute("data-state", "wrong");
      await expect(choices.and(page.getByRole("button", { name: answer, exact: true }))).toHaveAttribute("data-state", "correct");
      await expect(status).toContainText(`Answer: ${answer}`);
    }
    await page.getByRole("button", { name: n === 9 ? "See results" : "Continue" }).click();
  }
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
  await expect(page.getByText(`You got ${right} of 10 right.`)).toBeVisible();
  return right;
}

async function runTopic(page: Page) {
  await openGreetings(page);

  await expect(page.getByText("Card 1 of 10")).toBeVisible();
  await page.getByRole("button", { name: "Flip" }).click();
  await expect(page.getByTestId("flashcard-back")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Card 2 of 10")).toBeVisible();
  await expect(page.getByTestId("flashcard-back")).toHaveCount(0);

  // Quiz: a half-wrong run first, then a perfect run on the next attempt.
  await page.getByRole("button", { name: "Quiz" }).click();
  expect(await run(page, "quiz", 0, (n) => n % 2 === 1)).toBe(5);
  await expect(page.getByRole("button", { name: "Retry the 5 you missed" })).toBeVisible();
  await page.getByRole("link", { name: "Back to level" }).click();
  await expect(page.getByText("Best quiz 50%")).toBeVisible();

  await page.getByRole("link", { name: /Greetings and courtesies/ }).click();
  await page.getByRole("button", { name: "Quiz" }).click();
  expect(await run(page, "quiz", 0, () => false)).toBe(0);
  await page.getByRole("button", { name: "Try again" }).click();
  expect(await run(page, "quiz", 1, () => true)).toBe(10);
  await expect(page.getByRole("button", { name: /^Retry the/ })).toHaveCount(0);
  await page.getByRole("link", { name: "Back to level" }).click();
  await expect(page.getByText("Best quiz 100%")).toBeVisible();

  // Gap fill: one perfect run.
  await page.getByRole("link", { name: /Greetings and courtesies/ }).click();
  await page.getByRole("button", { name: "Gap fill" }).click();
  expect(await run(page, "gap", 0, () => true)).toBe(10);
  await page.getByRole("link", { name: "Back to level" }).click();
  await expect(page.getByText("Best gap-fill 100%")).toBeVisible();
  await expect(page.getByText("Best quiz 100%")).toBeVisible();
}

test("Greetings topic: flashcards, quiz and gap fill record the exact scores", async ({ page }) => {
  await runTopic(page);
});

test("Greetings topic works in dark mode set with the theme toggle", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await runTopic(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("a gap-fill run with wrong answers scores below 100 and offers the retry", async ({ page }) => {
  await openGreetings(page);
  await page.getByRole("button", { name: "Gap fill" }).click();
  expect(await run(page, "gap", 0, (n) => n < 7)).toBe(7);
  await page.getByRole("button", { name: "Retry the 3 you missed" }).click();
  await expect(page.getByText("Question 1 of 3")).toBeVisible();
  await page.getByRole("link", { name: "Back to level" }).click();
  await expect(page.getByText("Best gap-fill 70%")).toBeVisible();
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

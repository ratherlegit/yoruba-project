import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { NUMBERS, PHRASES } from "../src/content/numbers";

const STEP = "/numbers/tens-and-twenties";
const manifest = JSON.parse(readFileSync("src/content/audio-manifest.json", "utf8")) as Record<string, string>;

function answerFor(prompt: string): string {
  let m = /^Type (\d+) in Yoruba$/.exec(prompt);
  if (m) return NUMBERS.find((n) => n.value === Number(m![1]))!.yoruba;
  m = /^What number is (.+)\?$/.exec(prompt);
  if (m) return String(NUMBERS.find((n) => n.yoruba === m![1])!.value);
  m = /^Say '(.+)' in Yoruba$/.exec(prompt);
  if (m) return PHRASES.find((p) => p.prompt === m![1])!.answers[0]!;
  m = /^What price is (.+)\?$/.exec(prompt);
  if (m) return PHRASES.find((p) => p.answers[0] === m![1])!.numeral;
  throw new Error(`unexpected prompt: ${prompt}`);
}
const prompt = (page: Page) => page.getByTestId("numbers-prompt").innerText();

// A "Listen and type the number" question: play the clip, see which file loads, and read the number from its word.
async function answerForHear(page: Page): Promise<string> {
  const request = page.waitForRequest(/\/audio\/[0-9a-f]{12}\.mp3/);
  await page.getByRole("button", { name: "Play the number" }).click();
  const file = (await request).url().split("/").pop()!;
  const key = Object.entries(manifest).find(([, f]) => f === file)![0];
  return String(NUMBERS.find((n) => n.yoruba.normalize("NFC").toLowerCase() === key)!.value);
}
const answerOf = async (page: Page, p: string) => (p.startsWith("Listen and type") ? answerForHear(page) : answerFor(p));

async function playRound(page: Page, total = 8) {
  for (let i = 0; i < total; i++) {
    await page.getByTestId("numbers-input").fill(await answerOf(page, await prompt(page)));
    await page.getByRole("button", { name: "Check" }).click();
    await expect(page.getByTestId("numbers-result")).toContainText("Correct.");
    await page.getByRole("button", { name: i === total - 1 ? "See score" : "Next" }).click();
  }
}

// Answers questions correctly until a "Type N in Yoruba" question appears, then returns its model answer.
async function untilTypeQuestion(page: Page): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const p = await prompt(page);
    if (p.startsWith("Type ")) return answerFor(p);
    await page.getByTestId("numbers-input").fill(await answerOf(page, p));
    await page.getByRole("button", { name: "Check" }).click();
    await page.getByRole("button", { name: "Next" }).click();
  }
  throw new Error("no Type question in the round");
}

test("Numbers: from the landing card through a practice round to the stats page", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("activity-card").nth(2).click();
  await expect(page).toHaveURL(/\/numbers$/);
  await expect(page.getByTestId("numbers-step-card")).toHaveCount(6);
  await page.getByTestId("numbers-step-card").nth(2).click();
  await expect(page).toHaveURL(/\/numbers\/tens-and-twenties$/);
  await expect(page.getByTestId("numbers-examples")).toContainText("ogójì");
  await expect(page.getByTestId("numbers-examples")).toContainText("20 × 2");
  await expect(page.getByTestId("numbers-question")).toContainText("Question 1 of 8");
  await playRound(page);
  await expect(page.getByTestId("numbers-score")).toContainText("You got 8 of 8 right.");
  await page.goto("/");
  await expect(page.getByTestId("activity-card").nth(2)).toContainText("1 of 6 steps done");
  await page.goto("/stats");
  await expect(page.getByTestId("stats-numbers")).toContainText("1 of 6 steps done");
  await expect(page.getByTestId("stats-numbers")).toContainText("Tens and twenties");
  await expect(page.getByTestId("stats-numbers")).toContainText("100%");
  await page.goto("/numbers");
  await expect(page.getByTestId("numbers-step-card").nth(2)).toContainText("Best 100%");
});

test("Numbers accepts a pasted decomposed (NFD) answer", async ({ page }) => {
  await page.goto(STEP);
  await page.getByRole("button", { name: "Advanced" }).click();
  const model = await untilTypeQuestion(page);
  await page.getByTestId("numbers-input").fill(model.normalize("NFD"));
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("numbers-result")).toContainText("Correct.");
});

test("Numbers: easy mode accepts plain letters, advanced calls them close", async ({ page }) => {
  const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  await page.goto(STEP);
  let model = await untilTypeQuestion(page);
  await page.getByTestId("numbers-input").fill(plain(model));
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("numbers-result")).toContainText("Correct.");
  await page.goto(STEP);
  await page.getByRole("button", { name: "Advanced" }).click();
  model = await untilTypeQuestion(page);
  await page.getByTestId("numbers-input").fill(plain(model));
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("numbers-result")).toContainText("check the dots and tones");
});

test("Numbers One to ten is no longer in the vocab list", async ({ page }) => {
  await page.goto("/vocab/getting-started");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Numbers one to ten")).toHaveCount(0);
});

test("The Numbers pages render and work when localStorage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
  });
  await page.goto("/numbers");
  await expect(page.getByTestId("numbers-step-card")).toHaveCount(6);
  await page.goto(STEP);
  await page.getByTestId("numbers-input").fill(answerFor(await prompt(page)));
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("numbers-result")).toContainText("Correct.");
});

test.describe("phone width", () => {
  test.use({ viewport: { width: 375, height: 800 } });
  for (const path of ["/numbers", STEP, "/numbers/one-to-ten"]) {
    test(`no horizontal scroll and the Numbers nav link visible at ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("navigation").getByRole("link", { name: "Numbers" })).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

for (const scheme of ["light", "dark"] as const) {
  test(`Numbers pages are visible in ${scheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/numbers");
    await expect(page.getByTestId("numbers-step-card").first()).toBeVisible();
    await page.goto(STEP);
    await expect(page.getByTestId("numbers-practice")).toBeVisible();
  });
}

// Each audio button must sit beside its writing, never wrapped onto a line below it.
for (const width of [1280, 768, 375]) {
  test(`Numbers: audio buttons sit next to their writing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/numbers/one-to-ten");
    const groups = page.locator(".numbers-table .with-audio");
    const count = await groups.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const g = groups.nth(i);
      if ((await g.locator("button").count()) === 0) continue; // no clip for this text
      const text = await g.locator(".yo").boundingBox();
      const button = await g.locator("button").boundingBox();
      expect(button, `group ${i}`).not.toBeNull();
      expect(text, `group ${i}`).not.toBeNull();
      // The button's top must be on the first line of the text, not below its last line.
      expect(button!.y, `group ${i}: button below its text`).toBeLessThan(text!.y + text!.height);
      expect(button!.x, `group ${i}: button left of its text`).toBeGreaterThanOrEqual(text!.x);
    }
    // An example sentence's button stays with its last word, on one line.
    const tails = page.locator(".numbers-table .audio-tail");
    for (let i = 0; i < (await tails.count()); i++) {
      const box = await tails.nth(i).boundingBox();
      if ((await tails.nth(i).locator("button").count()) === 0) continue;
      expect(box!.height, `sentence tail ${i} split across lines`).toBeLessThan(60);
    }
    // A single counting word must stay on one line (no break inside the word).
    const words = page.locator(".numbers-table td:nth-child(2) .with-audio .yo, .numbers-table td:nth-child(3) .with-audio .yo");
    const n = await words.count();
    for (let i = 0; i < n; i++) {
      const box = await words.nth(i).boundingBox();
      expect(box!.height, `word ${i} wrapped`).toBeLessThan(40);
    }
  });
}

test("Numbers: on a phone every table cell is on screen (rows stack, nothing needs a sideways scroll)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/numbers/one-to-ten");
  const cells = page.locator(".numbers-table td");
  const n = await cells.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    const box = await cells.nth(i).boundingBox();
    expect(box!.x + box!.width, `cell ${i} runs off the right edge`).toBeLessThanOrEqual(376);
  }
  await expect(page.getByText("I have only one nose.")).toBeInViewport({ ratio: 1 });
});

test("Numbers: the last word of an example sentence sits on the same line as the words before it", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/numbers/one-to-ten");
  const rows = await page.locator(".numbers-table .audio-sentence").evaluateAll((els) =>
    els.map((el) => {
      const rect = (node: Node, a: number, b: number) => {
        const r = document.createRange();
        r.setStart(node, a);
        r.setEnd(node, b);
        return r.getBoundingClientRect();
      };
      const head = el.firstChild as Text;
      const tail = el.querySelector(".audio-tail")!.firstChild as Text;
      return { head: rect(head, 0, 1).bottom, last: rect(tail, 0, 1).bottom };
    }),
  );
  expect(rows.length).toBe(20);
  for (const [i, r] of rows.entries()) {
    expect(Math.abs(r.head - r.last), `sentence ${i}: last word is off the baseline`).toBeLessThan(0.5);
  }
});

test("Numbers: the English line sits under its example sentence, not beside the button", async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto("/numbers/one-to-ten");
  const sentence = await page.locator(".numbers-table .audio-sentence").first().boundingBox();
  const english = await page.getByText("I have only one nose.").boundingBox();
  expect(english!.y).toBeGreaterThanOrEqual(sentence!.y + sentence!.height - 1);
});

test("Numbers: at desktop width the one to ten examples stay on one line, and the practice card stays readable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/numbers/one-to-ten");
  const sentences = page.locator(".numbers-table .audio-sentence");
  const n = await sentences.count();
  expect(n).toBe(20);
  for (let i = 0; i < n; i++) {
    const box = await sentences.nth(i).boundingBox();
    // One line is the 44px audio button; a wrapped sentence would be taller.
    expect(box!.height, `example ${i} wraps`).toBeLessThan(50);
  }
  const card = await page.getByTestId("numbers-practice").boundingBox();
  expect(card!.width).toBeLessThanOrEqual(740);
});

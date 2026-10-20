import { render, screen, within } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { LEVELS } from "@/content/levels";
import { PROVERBS } from "@/content/proverbs";
import { VOCAB_LEVELS } from "@/content/vocab";
import { __resetStatsStoreForTests } from "@/hooks/useStats";
import { __resetProgressStoreForTests } from "@/hooks/useProgress";
import { __resetVocabProgressStoreForTests } from "@/hooks/useVocabProgress";
import { dayKey } from "@/lib/stats";
import { routeTree } from "@/router";

async function renderStats() {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/stats"] }) });
  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { level: 1, name: "Your stats" });
  return await screen.findByRole("main");
}
const section = (id: string) => screen.getByTestId(`stats-${id}`);
const EMPTY = "Start a lesson to see your stats";

beforeEach(() => {
  localStorage.clear();
  __resetStatsStoreForTests();
  __resetProgressStoreForTests();
  __resetVocabProgressStoreForTests();
});

describe("Stats page, empty", () => {
  it("shows the empty message and a link into each activity, with no zeros, NaN or percentages", async () => {
    const main = await renderStats();
    for (const [id, link, href] of [
      ["grammar", "Go to Grammar", "/grammar"], ["vocab", "Go to Vocab", "/vocab"], ["tone", "Go to Sound Bank", "/sounds"],
      ["proverbs", "Go to Proverbs", "/proverbs"], ["transform", "Go to Transform", "/transform"], ["days", "Start with Grammar", "/grammar"],
    ] as const) {
      expect(within(section(id)).getByText(EMPTY), id).toBeInTheDocument();
      expect(within(section(id)).getByRole("link", { name: link }).getAttribute("href"), id).toBe(href);
    }
    expect(main.textContent).not.toMatch(/NaN|\d%/);
  });
  it("renders the empty state when the stats value is corrupt", async () => {
    localStorage.setItem("yp:stats:v1", "{broken");
    await renderStats();
    expect(within(section("tone")).getByText(EMPTY)).toBeInTheDocument();
  });
});

describe("Stats page, with data", () => {
  const first = LEVELS[0]!;
  const topic = VOCAB_LEVELS.flatMap((l) => l.topics)[0]!;
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 12);

  beforeEach(() => {
    localStorage.setItem("yp:progress:v1", JSON.stringify({
      completedLessons: {
        [first.lessons[0]!.id]: { bestScore: 1, completedAt: "2026-10-01T00:00:00.000Z" },
        [first.lessons[1]!.id]: { bestScore: 0.5, completedAt: "2026-10-01T00:00:00.000Z" },
      },
      skipAhead: false, theme: "system",
    }));
    localStorage.setItem("yp:vocab-progress:v1", JSON.stringify({
      topics: { [topic.id]: { quiz: { bestScore: 0.8, completedAt: "2026-10-01T00:00:00.000Z" } } },
    }));
    localStorage.setItem("yp:stats:v1", JSON.stringify({
      tone: { words: { answered: 4, correct: 3 }, sentences: { answered: 0, correct: 0 }, sounds: { answered: 0, correct: 0 } },
      proverbs: { [PROVERBS[0]!.id]: { correct: true }, [PROVERBS[1]!.id]: { correct: false } },
      transform: {
        "easy:a": { kind: "negative", mode: "easy", result: "right" },
        "advanced:b": { kind: "negative", mode: "advanced", result: "close" },
        "advanced:c": { kind: "future", mode: "advanced", result: "wrong" },
      },
      days: [dayKey(yesterday), dayKey(today)],
    }));
  });

  it("shows lessons done per level and each completed lesson's best score", async () => {
    await renderStats();
    const g = section("grammar");
    expect(g.textContent).toContain(`2 of ${first.lessons.length} lessons done`);
    expect(g.textContent).toContain("100%");
    expect(g.textContent).toContain("50%");
    expect(within(g).queryByText(EMPTY)).toBeNull();
  });
  it("shows vocab topics done and the best quiz score", async () => {
    await renderStats();
    expect(section("vocab").textContent).toContain("1 of");
    expect(section("vocab").textContent).toContain("Quiz 80%");
  });
  it("shows tone practice per mode with accuracy, and hides modes with no answers", async () => {
    await renderStats();
    const t = section("tone");
    expect(t.textContent).toContain("Words");
    expect(t.textContent).toContain("3 of 4 right (75%)");
    expect(t.textContent).not.toContain("Sentences");
  });
  it("shows proverbs guessed and right", async () => {
    await renderStats();
    expect(section("proverbs").textContent).toContain(`2 of ${PROVERBS.length} proverbs guessed`);
    expect(section("proverbs").textContent).toContain("1 right on the first try");
  });
  it("shows transform results by kind and mode with close counted on its own", async () => {
    await renderStats();
    const t = section("transform");
    expect(t.textContent).toContain("Negative: 1 right, 1 close, 0 wrong");
    expect(t.textContent).toContain("Future: 0 right, 0 close, 1 wrong");
    expect(t.textContent).toContain("Advanced: 0 right, 1 close, 1 wrong");
    expect(t.textContent).not.toContain("Question");
  });
  it("shows days practised and the current run, and keeps the other sections' data when one is empty", async () => {
    await renderStats();
    // Two stats days plus the day the seeded lesson and topic were completed.
    expect(section("days").textContent).toContain("Days practised: 3");
    expect(section("days").textContent).toContain("Day run: 2");
  });
  it("hides the day run when the last practice day is old", async () => {
    localStorage.setItem("yp:stats:v1", JSON.stringify({ tone: { words: { answered: 1, correct: 1 } }, days: ["2020-01-01"] }));
    await renderStats();
    // 2020-01-01 plus the day the seeded lesson and topic were completed.
    expect(section("days").textContent).toContain("Days practised: 2");
    expect(section("days").textContent).not.toContain("Day run");
  });
});

describe("Stats page, grammar only", () => {
  it("counts the day a lesson was completed as a practice day", async () => {
    localStorage.setItem("yp:progress:v1", JSON.stringify({
      completedLessons: { [LEVELS[0]!.lessons[0]!.id]: { bestScore: 1, completedAt: new Date(2026, 9, 1, 12).toISOString() } },
      skipAhead: false, theme: "system",
    }));
    await renderStats();
    expect(within(section("days")).queryByText(EMPTY)).toBeNull();
    expect(section("days").textContent).toContain("Days practised: 1");
  });
  it("counts the day a vocab topic was completed as a practice day", async () => {
    const topic = VOCAB_LEVELS.flatMap((l) => l.topics)[0]!;
    localStorage.setItem("yp:vocab-progress:v1", JSON.stringify({
      topics: { [topic.id]: { gap: { bestScore: 1, completedAt: new Date(2026, 9, 2, 12).toISOString() } } },
    }));
    await renderStats();
    expect(section("days").textContent).toContain("Days practised: 1");
  });
});

import { render, screen, within } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { LEVELS } from "@/content/levels";
import { NUMBER_STEPS } from "@/content/numbers";
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
const cells = (root: HTMLElement, first: string) => {
  const row = [...root.querySelectorAll("tbody tr")].find((r) => r.firstElementChild?.textContent === first);
  return row && [...row.querySelectorAll("td")].map((c) => c.textContent);
};
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
      ["proverbs", "Go to Proverbs", "/proverbs"], ["transform", "Go to Transform", "/transform"], ["numbers", "Go to Numbers", "/numbers"], ["days", "Start with Grammar", "/grammar"],
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
    expect(section("vocab").textContent).toContain("80%");
  });
  it("shows tone practice per mode with accuracy, and hides modes with no answers", async () => {
    await renderStats();
    const t = section("tone");
    expect(t.textContent).toContain("Words");
    expect(cells(t, "Words")).toEqual(["Words", "3", "4", "75%"]);
    expect(t.textContent).not.toContain("Sentences");
  });
  it("shows proverbs guessed and right", async () => {
    await renderStats();
    expect(cells(section("proverbs"), "Proverbs guessed")).toEqual(["Proverbs guessed", `2 of ${PROVERBS.length}`]);
    expect(cells(section("proverbs"), "Right on the first try")).toEqual(["Right on the first try", "1"]);
  });
  it("shows transform results by kind and mode with close counted on its own", async () => {
    await renderStats();
    const t = section("transform");
    expect(cells(t, "Negative")).toEqual(["Negative", "1", "1", "0"]);
    expect(cells(t, "Future")).toEqual(["Future", "0", "0", "1"]);
    expect(cells(t, "Advanced")).toEqual(["Advanced", "0", "1", "1"]);
    expect(t.textContent).not.toContain("Question");
  });
  it("shows days practised and the current run, and keeps the other sections' data when one is empty", async () => {
    await renderStats();
    // Two stats days plus the day the seeded lesson and topic were completed.
    expect(section("days").textContent).toContain("Days practised3");
    expect(section("days").textContent).toContain("Day run2");
  });
  it("hides the day run when the last practice day is old", async () => {
    localStorage.setItem("yp:stats:v1", JSON.stringify({ tone: { words: { answered: 1, correct: 1 } }, days: ["2020-01-01"] }));
    await renderStats();
    // 2020-01-01 plus the day the seeded lesson and topic were completed.
    expect(section("days").textContent).toContain("Days practised2");
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
    expect(section("days").textContent).toContain("Days practised1");
  });
  it("counts the day a vocab topic was completed as a practice day", async () => {
    const topic = VOCAB_LEVELS.flatMap((l) => l.topics)[0]!;
    localStorage.setItem("yp:vocab-progress:v1", JSON.stringify({
      topics: { [topic.id]: { gap: { bestScore: 1, completedAt: new Date(2026, 9, 2, 12).toISOString() } } },
    }));
    await renderStats();
    expect(section("days").textContent).toContain("Days practised1");
  });
});

describe("Stats page, numbers", () => {
  it("shows steps done, the best score per step and accuracy by question type", async () => {
    localStorage.setItem("yp:stats:v1", JSON.stringify({
      numbers: {
        steps: { "tens-and-twenties": { best: 0.75 }, "one-to-ten": { best: 1 } },
        kinds: { "to-yoruba": { answered: 4, correct: 3 }, "to-numeral": { answered: 2, correct: 2 }, counting: { answered: 0, correct: 0 }, hear: { answered: 0, correct: 0 } },
      },
    }));
    await renderStats();
    const n = section("numbers");
    expect(within(n).queryByText(EMPTY)).toBeNull();
    expect(n.textContent).toContain(`2 of ${NUMBER_STEPS.length} steps done`);
    expect(n.textContent).toContain("Tens and twenties");
    expect(n.textContent).toContain("75%");
    expect(cells(n, "Numeral to Yoruba")).toEqual(["Numeral to Yoruba", "3", "4", "75%"]);
    expect(cells(n, "Yoruba to numeral")).toEqual(["Yoruba to numeral", "2", "2", "100%"]);
    expect(n.textContent).not.toContain("Counting");
  });
  it("shows nothing for numbers with no practice, with no NaN", async () => {
    const main = await renderStats();
    expect(within(section("numbers")).getByText(EMPTY)).toBeInTheDocument();
    expect(main.textContent).not.toMatch(/NaN/);
  });
});

import { render, screen, within } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { LEVELS } from "@/content/levels";
import { NUMBER_STEPS } from "@/content/numbers";
import { PROVERBS } from "@/content/proverbs";
import { __resetStatsStoreForTests } from "@/hooks/useStats";
import { emptyProgress, recordCompletion, saveProgress } from "@/lib/progress";
import { routeTree } from "@/router";

async function renderHome() {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/"] }) });
  render(<RouterProvider router={router} />);
  await router.load();
  return await screen.findByRole("main");
}

const lessons = LEVELS.flatMap((l) => l.lessons);

beforeEach(() => {
  localStorage.clear();
  __resetStatsStoreForTests();
});

describe("Home", () => {
  it("shows the hero and seven activity cards in order, each linking to its page", async () => {
    const main = await renderHome();
    expect(screen.getByRole("heading", { level: 1, name: "Learn Yoruba, tone by tone" })).toBeInTheDocument();
    const cards = within(main).getAllByTestId("activity-card");
    expect(cards.map((c) => c.querySelector("strong")!.textContent)).toEqual(["Grammar", "Vocab", "Numbers", "Sound Bank", "Proverbs", "Transform", "Songs"]);
    expect(cards.map((c) => c.getAttribute("href"))).toEqual(["/grammar", "/vocab", "/numbers", "/sounds", "/proverbs", "/transform", "/songs"]);
  });

  it("no longer lists the levels or the unlock checkbox", async () => {
    const main = await renderHome();
    expect(within(main).queryByText("Getting Started")).toBeNull();
    expect(screen.queryByRole("checkbox", { name: "Unlock all levels" })).toBeNull();
  });

  it("shows an empty state with no digits, percent signs or NaN for a new visitor", async () => {
    const main = await renderHome();
    expect(within(main).getByText("Start a lesson to see your stats")).toBeInTheDocument();
    expect(within(main).getByRole("link", { name: "Start with Grammar" }).getAttribute("href")).toBe("/grammar");
    expect(within(main).queryByRole("link", { name: "See all stats" })).toBeNull();
    expect(main.textContent).not.toMatch(/\d|NaN|%/);
    expect(screen.queryAllByTestId("card-progress")).toHaveLength(0);
  });

  it("shows lesson progress on the Grammar card and in the strip", async () => {
    let p = emptyProgress;
    p = recordCompletion(p, lessons[0]!.id, 1);
    p = recordCompletion(p, lessons[1]!.id, 0.5);
    saveProgress(p);
    const main = await renderHome();
    const grammar = within(main).getAllByTestId("activity-card")[0]!;
    expect(grammar.textContent).toContain(`2 of ${lessons.length} lessons done`);
    expect(within(main).getByText("Lessons done")).toBeInTheDocument();
    expect(within(main).getByText("Days practised")).toBeInTheDocument();
    expect(within(main).getByRole("link", { name: "See all stats" }).getAttribute("href")).toBe("/stats");
    expect(within(main).queryByText("Start a lesson to see your stats")).toBeNull();
  });

  it("shows practice progress on the Sound Bank and Proverbs cards and accuracy in the strip", async () => {
    localStorage.setItem("yp:stats:v1", JSON.stringify({
      tone: { words: { answered: 3, correct: 2 }, sentences: { answered: 1, correct: 1 }, sounds: { answered: 0, correct: 0 } },
      proverbs: { [PROVERBS[0]!.id]: { correct: true } },
      transform: { "easy:neg-mo-lo": { kind: "negative", mode: "easy", result: "right" } },
      days: ["2026-10-01"],
    }));
    const main = await renderHome();
    const cards = within(main).getAllByTestId("activity-card");
    expect(cards[3]!.textContent).toContain("4 practice answers");
    expect(cards[4]!.textContent).toContain(`1 of ${PROVERBS.length} proverbs guessed`);
    expect(cards[5]!.textContent).toContain("1 sentence checked");
    expect(within(main).getByText("Practice answers right")).toBeInTheDocument();
    expect(within(main).getByText("Days practised")).toBeInTheDocument();
  });

  it("uses singular wording for one practice answer", async () => {
    localStorage.setItem("yp:stats:v1", JSON.stringify({ tone: { words: { answered: 1, correct: 1 } } }));
    const main = await renderHome();
    expect(within(main).getAllByTestId("activity-card")[3]!.textContent).toContain("1 practice answer");
    expect(within(main).getAllByTestId("activity-card")[3]!.textContent).not.toContain("1 practice answers");
  });

  it("shows the Numbers card with its steps done, and nothing when there is no progress", async () => {
    const empty = await renderHome();
    expect(within(empty).getAllByTestId("activity-card")[2]!.textContent).not.toMatch(/steps done/);
  });

  it("shows how many Numbers steps are done", async () => {
    localStorage.setItem("yp:stats:v1", JSON.stringify({ numbers: { steps: { "one-to-ten": { best: 1 }, hundreds: { best: 0.5 } } } }));
    const main = await renderHome();
    expect(within(main).getAllByTestId("activity-card")[2]!.textContent).toContain(`2 of ${NUMBER_STEPS.length} steps done`);
  });

  it("shows a Songs card, last, linking to the songs page and with no progress line", async () => {
    await renderHome();
    const main = screen.getByRole("main");
    const card = within(main).getAllByTestId("activity-card")[6]!;
    expect(card.getAttribute("href")).toBe("/songs");
    expect(card.textContent).toContain("Songs");
    expect(within(card).queryByTestId("card-progress")).toBeNull();
  });
});

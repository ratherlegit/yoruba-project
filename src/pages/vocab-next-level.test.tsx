import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { __resetVocabProgressStoreForTests } from "@/hooks/useVocabProgress";
import { nextVocabTopicPath } from "@/content/vocab";
import { routeTree } from "@/router";

// One fixture topic per level, so "Next topic" from the last Getting Started
// topic has to cross into the first Beginner topic.
const { topic } = vi.hoisted(() => ({
  topic: (id: string, level: string, title: string) => ({
    id,
    level,
    title,
    blurb: `${title} blurb.`,
    sources: [],
    words: ["ata", "obe", "iyọ̀", "ẹja", "ewé", "isu", "ẹran", "ẹyin", "àkàrà", "ọbẹ̀"].map((y, i) => ({
      id: `${id}-${i}`,
      yoruba: y,
      english: `${id} meaning ${i}`,
      pos: "noun" as const,
      sentence: { yoruba: `Mo rí ${y} lánàá.`, english: `I saw it yesterday ${id} ${i}.` },
      confidence: "verified" as const,
    })),
  }),
}));

vi.mock("@/content/vocab/getting-started", () => ({
  gettingStartedTopics: [topic("fx-gs-last", "getting-started", "Fixture last start")],
}));
vi.mock("@/content/vocab/beginner", () => ({
  beginnerTopics: [topic("fx-b-first", "beginner", "Fixture first beginner")],
}));
// Keep Intermediate, Advanced and Mastery empty so the fixture Beginner topic stays the last topic overall.
vi.mock("@/content/vocab/intermediate", () => ({ intermediateTopics: [] }));
vi.mock("@/content/vocab/advanced", () => ({ advancedTopics: [] }));
vi.mock("@/content/vocab/mastery", () => ({ masteryTopics: [] }));

beforeEach(() => {
  localStorage.clear();
  __resetVocabProgressStoreForTests();
});

describe("Next topic across levels", () => {
  it("nextVocabTopicPath steps from the last Getting Started topic into Beginner", () => {
    expect(nextVocabTopicPath("getting-started", "fx-gs-last")).toEqual({ levelId: "beginner", topicId: "fx-b-first" });
    expect(nextVocabTopicPath("beginner", "fx-b-first")).toBeNull();
  });

  it("the results page links on to the first Beginner topic", async () => {
    const user = userEvent.setup();
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ["/vocab/getting-started/fx-gs-last"] }),
    });
    render(<RouterProvider router={router} />);
    await router.load();
    await user.click(await screen.findByRole("button", { name: "Quiz" }));
    for (let n = 0; n < 10; n++) {
      await user.click((await screen.findAllByTestId("choice"))[0]!);
      await user.click(screen.getByRole("button", { name: n === 9 ? "See results" : "Continue" }));
    }
    const results = (await screen.findByRole("heading", { name: "Results" })).closest("section")!;
    const next = within(results).getByRole("link", { name: "Next topic" });
    expect(next).toHaveAttribute("href", "/vocab/beginner/fx-b-first");
    await user.click(next);
    expect(await screen.findByRole("heading", { name: "Fixture first beginner" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/vocab/beginner/fx-b-first");
  });
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildQuiz } from "@/lib/vocab-questions";
import { __resetVocabProgressStoreForTests } from "@/hooks/useVocabProgress";
import { getVocabTopic } from "@/content/vocab";
import { routeTree } from "@/router";

vi.mock("@/content/vocab/getting-started", () => {
  const mk = (prefix: string, yoruba: string[]) =>
    yoruba.map((y, i) => ({
      id: `${prefix}-${i}`,
      yoruba: y,
      english: `${prefix} meaning ${i}`,
      pos: "noun" as const,
      sentence: { yoruba: `Mo rí ${y} lánàá.`, english: `I saw it yesterday ${prefix} ${i}.` },
      confidence: "verified" as const,
    }));
  return {
    gettingStartedTopics: [
      {
        id: "fx-food",
        level: "getting-started",
        title: "Fixture food",
        blurb: "Fixture blurb.",
        sources: [],
        words: mk("food", ["ata", "obe", "iyọ̀", "ẹja", "ewé", "isu", "ẹran", "ẹyin", "àkàrà", "ọbẹ̀"]),
      },
      {
        id: "fx-home",
        level: "getting-started",
        title: "Fixture home",
        blurb: "Home blurb.",
        sources: [],
        words: mk("home", ["ilé", "àga", "ilẹ̀kùn", "fèrèsé", "orùlé", "ọgbà", "yàrá", "tábìlì", "ibùsùn", "pẹpẹ"]),
      },
    ],
  };
});

// Keep the later levels empty so these tests stay fixture-only as real topics land:
// fx-home stays the last topic overall, and Beginner stays a "Coming soon" level.
vi.mock("@/content/vocab/beginner", () => ({ beginnerTopics: [] }));

async function renderAt(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  render(<RouterProvider router={router} />);
  await router.load();
}

const progressRaw = () => localStorage.getItem("yp:vocab-progress:v1");

// Answer every quiz question, choosing the correct option when `right` is true, else a wrong one.
async function runQuiz(user: ReturnType<typeof userEvent.setup>, right: boolean, count = 10, attempt = 0) {
  const qs = buildQuiz(getVocabTopic("getting-started", "fx-food")!, `fx-food#${attempt}`);
  for (let n = 0; n < count; n++) {
    const q = qs[n]!;
    const correct = q.choices[q.answer]!;
    const buttons = await screen.findAllByTestId("choice");
    const pick = buttons.find((b) => (b.textContent!.replace(/^[✓✗] /, "") === correct) === right)!;
    await user.click(pick);
    await user.click(screen.getByRole("button", { name: n === qs.length - 1 ? "See results" : "Continue" }));
  }
}

beforeEach(() => {
  localStorage.clear();
  __resetVocabProgressStoreForTests();
});

describe("vocab pages", () => {
  it("/vocab lists five level cards with rings labelled in topics", async () => {
    await renderAt("/vocab");
    expect(await screen.findByRole("heading", { name: "Learn Yoruba words" })).toBeInTheDocument();
    for (const t of ["Getting Started", "Beginner", "Intermediate", "Advanced", "Mastery"]) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
    expect(screen.getByLabelText("0 of 2 topics complete")).toBeInTheDocument();
    expect(screen.queryByLabelText("0 of 0 topics complete")).not.toBeInTheDocument();
    expect(screen.getAllByText("Coming soon")).toHaveLength(4);
    expect(screen.getByText("Beginner").closest("a")).toBeNull();
    expect(screen.getByText("Getting Started").closest("a")).toHaveAttribute("href", "/vocab/getting-started");
  });

  it("the grammar home still labels rings in lessons", async () => {
    await renderAt("/");
    expect((await screen.findAllByLabelText(/lessons complete/)).length).toBe(5);
  });

  it("a level lists its topics and shows best scores once recorded", async () => {
    localStorage.setItem(
      "yp:vocab-progress:v1",
      JSON.stringify({ topics: { "fx-food": { quiz: { bestScore: 0.8, completedAt: "2026-01-01T00:00:00.000Z" } } } }),
    );
    await renderAt("/vocab/getting-started");
    expect(await screen.findByRole("link", { name: /Fixture food/ })).toHaveTextContent("Best quiz 80%");
    expect(screen.getByRole("link", { name: /Fixture home/ })).not.toHaveTextContent("Best");
  });

  it("an empty level says topics are on the way", async () => {
    await renderAt("/vocab/beginner");
    expect(await screen.findByText("Topics for this level are on the way.")).toBeInTheDocument();
  });

  it("unknown level and topic ids render NotFound", async () => {
    await renderAt("/vocab/nope");
    expect(await screen.findByText(/couldn't find/i)).toBeInTheDocument();
  });

  it("unknown topic id renders NotFound", async () => {
    await renderAt("/vocab/getting-started/nope");
    expect(await screen.findByText(/couldn't find/i)).toBeInTheDocument();
  });

  it("the topic page defaults to flashcards and Quiz starts at question 1 of 10", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-food");
    expect(await screen.findByText("Card 1 of 10")).toBeInTheDocument();
    const mode = (name: string) => screen.getByRole("button", { name });
    expect(mode("Flashcards")).toHaveAttribute("aria-pressed", "true");
    expect(mode("Flashcards")).toHaveClass("btn-primary");
    for (const other of ["Quiz", "Gap fill"]) {
      expect(mode(other)).toHaveAttribute("aria-pressed", "false");
      expect(mode(other)).not.toHaveClass("btn-primary");
    }
    await user.click(mode("Quiz"));
    expect(await screen.findByText("Question 1 of 10")).toBeInTheDocument();
    expect(mode("Quiz")).toHaveAttribute("aria-pressed", "true");
    expect(mode("Quiz")).toHaveClass("btn-primary");
    expect(mode("Flashcards")).toHaveAttribute("aria-pressed", "false");
    expect(mode("Flashcards")).not.toHaveClass("btn-primary");
  });

  it("finishing a full quiz records quiz progress and shows results", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-food");
    await user.click(await screen.findByRole("button", { name: "Quiz" }));
    await runQuiz(user, true);
    expect(await screen.findByText("You got 10 of 10 right.")).toBeInTheDocument();
    const saved = JSON.parse(progressRaw()!);
    expect(saved.topics["fx-food"].quiz.bestScore).toBe(1);
    expect(saved.topics["fx-food"].gap).toBeUndefined();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to flashcards" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Retry the/ })).not.toBeInTheDocument();
  });

  it("abandoning a quiz midway records nothing", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-food");
    await user.click(await screen.findByRole("button", { name: "Quiz" }));
    await runQuiz(user, true, 4);
    await user.click(screen.getByRole("button", { name: "Flashcards" }));
    expect(progressRaw()).toBeNull();
  });

  it("retrying only the missed ones does not overwrite the full-run score", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-food");
    await user.click(await screen.findByRole("button", { name: "Quiz" }));
    await runQuiz(user, false);
    expect(await screen.findByText("You got 0 of 10 right.")).toBeInTheDocument();
    expect(JSON.parse(progressRaw()!).topics["fx-food"].quiz.bestScore).toBe(0);
    await user.click(screen.getByRole("button", { name: "Retry the 10 you missed" }));
    expect(await screen.findByText("Question 1 of 10")).toBeInTheDocument();
  });

  it("a retry run of fewer questions is not recorded as a completion", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-food");
    await user.click(await screen.findByRole("button", { name: "Quiz" }));
    const qs = buildQuiz(getVocabTopic("getting-started", "fx-food")!, "fx-food#0");
    // Miss only the first question.
    for (let n = 0; n < 10; n++) {
      const q = qs[n]!;
      const correct = q.choices[q.answer]!;
      const buttons = await screen.findAllByTestId("choice");
      await user.click(buttons.find((b) => (b.textContent === correct) === (n !== 0))!);
      await user.click(screen.getByRole("button", { name: n === 9 ? "See results" : "Continue" }));
    }
    expect(JSON.parse(progressRaw()!).topics["fx-food"].quiz.bestScore).toBe(0.9);
    await user.click(await screen.findByRole("button", { name: "Retry the 1 you missed" }));
    expect(await screen.findByText("Question 1 of 1")).toBeInTheDocument();
    const buttons = await screen.findAllByTestId("choice");
    const q0 = qs[0]!;
    await user.click(buttons.find((b) => b.textContent === q0.choices[q0.answer])!);
    await user.click(screen.getByRole("button", { name: "See results" }));
    expect(await screen.findByText("You got 1 of 1 right.")).toBeInTheDocument();
    expect(JSON.parse(progressRaw()!).topics["fx-food"].quiz.bestScore).toBe(0.9);
  });

  it("gap fill mode runs and records under gap", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-food");
    await user.click(await screen.findByRole("button", { name: "Gap fill" }));
    expect(await screen.findByText("Question 1 of 10")).toBeInTheDocument();
    for (let n = 0; n < 10; n++) {
      await user.click((await screen.findAllByTestId("choice"))[0]!);
      await user.click(screen.getByRole("button", { name: n === 9 ? "See results" : "Continue" }));
    }
    expect(JSON.parse(progressRaw()!).topics["fx-food"].gap).toBeDefined();
    expect(JSON.parse(progressRaw()!).topics["fx-food"].quiz).toBeUndefined();
  });

  it("Back to flashcards returns to cards; Try again restarts the quiz", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-food");
    await user.click(await screen.findByRole("button", { name: "Quiz" }));
    await runQuiz(user, true);
    await user.click(await screen.findByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Question 1 of 10")).toBeInTheDocument();
    await runQuiz(user, true, 10, 1);
    await user.click(await screen.findByRole("button", { name: "Back to flashcards" }));
    expect(await screen.findByText("Card 1 of 10")).toBeInTheDocument();
  });

  it("Next topic links on and resets the page state", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-food");
    await user.click(await screen.findByRole("button", { name: "Quiz" }));
    await runQuiz(user, true);
    await user.click(await screen.findByRole("link", { name: "Next topic" }));
    expect(await screen.findByRole("heading", { name: "Fixture home" })).toBeInTheDocument();
    expect(await screen.findByText("Card 1 of 10")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Results" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Flashcards" })).toHaveAttribute("aria-pressed", "true");
  });

  it("the last topic's results offer no Next topic and the page has one Back to level link", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-home");
    await user.click(await screen.findByRole("button", { name: "Quiz" }));
    for (let n = 0; n < 10; n++) {
      await user.click((await screen.findAllByTestId("choice"))[0]!);
      await user.click(screen.getByRole("button", { name: n === 9 ? "See results" : "Continue" }));
    }
    const results = (await screen.findByRole("heading", { name: "Results" })).closest("section")!;
    expect(within(results).queryByRole("link", { name: "Next topic" })).not.toBeInTheDocument();
    const back = screen.getAllByRole("link", { name: "Back to level" });
    expect(back).toHaveLength(1);
    expect(back[0]).toHaveAttribute("href", "/vocab/getting-started");
  });

  it("a vocab run leaves the grammar progress key untouched", async () => {
    const user = userEvent.setup();
    await renderAt("/vocab/getting-started/fx-food");
    await user.click(await screen.findByRole("button", { name: "Quiz" }));
    await runQuiz(user, true);
    await screen.findByRole("heading", { name: "Results" });
    expect(localStorage.getItem("yp:progress:v1")).toBeNull();
  });

  it("the nav and home link to Vocab", async () => {
    await renderAt("/");
    const links = await screen.findAllByRole("link", { name: /Vocab/ });
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Common words by topic, with flashcards and practice.")).toBeInTheDocument();
  });
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { __resetStatsStoreForTests } from "@/hooks/useStats";
import { audioUrlFor } from "@/lib/audio";
import { buildNumbersRound, type NumbersQuestion } from "@/lib/numbers-practice";
import { loadStats } from "@/lib/stats";
import { NumbersPractice } from "./NumbersPractice";

vi.mock("@/lib/audio", () => ({ audioUrlFor: vi.fn(() => null) }));
vi.mock("@/lib/clip", () => ({ playClip: vi.fn() }));
vi.mock("@/lib/numbers-practice", async (orig) => {
  const real = await orig<typeof import("@/lib/numbers-practice")>();
  return { ...real, buildNumbersRound: vi.fn(real.buildNumbersRound) };
});

const FIXED: NumbersQuestion[] = [
  { id: "a", kind: "to-yoruba", prompt: "Type 11 in Yoruba", answers: ["ọ̀kanlá", "oókànlá"], model: "ọ̀kanlá", build: "10+1" },
  { id: "b", kind: "to-numeral", prompt: "What number is ogójì?", answers: ["40"], model: "40" },
  { id: "c", kind: "counting", prompt: "Say 'two children' in Yoruba", answers: ["ọmọ méjì"], model: "ọmọ méjì" },
  { id: "d", kind: "hear", prompt: "Listen and type the number", answers: ["20"], model: "20", audioText: "ogún" },
];
const input = () => screen.getByTestId("numbers-input") as HTMLInputElement;
const check = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole("button", { name: "Check" }));
async function answer(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(input(), text);
  await check(user);
}
async function finishAll(user: ReturnType<typeof userEvent.setup>, ok: boolean) {
  const answers = ["ọ̀kanlá", "40", "ọmọ méjì", "20"];
  for (let i = 0; i < 4; i++) {
    await answer(user, ok ? answers[i]! : "zzz");
    await user.click(screen.getByRole("button", { name: i === 3 ? "See score" : "Next" }));
  }
}

beforeEach(() => {
  localStorage.clear();
  __resetStatsStoreForTests();
  vi.mocked(audioUrlFor).mockReset().mockReturnValue(null);
  vi.mocked(buildNumbersRound).mockReset();
  vi.mocked(buildNumbersRound).mockReturnValue(FIXED);
});

describe("NumbersPractice", () => {
  it("shows the first question, the mode switch in Easy, and no result", () => {
    render(<NumbersPractice stepId="s" />);
    expect(screen.getByTestId("numbers-question").textContent).toContain("Question 1 of 4");
    expect(screen.getByText("Type 11 in Yoruba")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Easy" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByTestId("numbers-result")).toBeNull();
    expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("does nothing when Check is pressed on an empty box", async () => {
    render(<NumbersPractice stepId="s" />);
    await check(userEvent.setup());
    expect(screen.queryByTestId("numbers-result")).toBeNull();
    expect(localStorage.getItem("yp:stats:v1")).toBeNull();
  });

  it("marks the right answer and shows how the number is built", async () => {
    const user = userEvent.setup();
    render(<NumbersPractice stepId="s" />);
    await answer(user, "ọ̀kanlá");
    expect(screen.getByTestId("numbers-result").textContent).toContain("Correct.");
    expect(screen.getByTestId("numbers-result").textContent).toContain("10 + 1");
    expect(input().disabled).toBe(true);
  });

  it("accepts a valid variant", async () => {
    const user = userEvent.setup();
    render(<NumbersPractice stepId="s" />);
    await answer(user, "oókànlá");
    expect(screen.getByTestId("numbers-result").textContent).toContain("Correct.");
    expect(screen.getByTestId("numbers-result").textContent).toContain("ọ̀kanlá");
  });

  it("is close in Advanced mode and correct in Easy mode for missing dots and tones", async () => {
    const user = userEvent.setup();
    const first = render(<NumbersPractice stepId="s" />);
    await user.click(screen.getByRole("button", { name: "Advanced" }));
    await answer(user, "okanla");
    expect(screen.getByTestId("numbers-result").textContent).toContain("Right words, check the dots and tones.");
    first.unmount();
    render(<NumbersPractice stepId="s" />);
    await answer(user, "okanla");
    expect(screen.getByTestId("numbers-result").textContent).toContain("Correct.");
  });

  it("marks a wrong answer and shows the model answer", async () => {
    const user = userEvent.setup();
    render(<NumbersPractice stepId="s" />);
    await answer(user, "ogún");
    expect(screen.getByTestId("numbers-result").textContent).toContain("Not quite.");
    expect(screen.getByTestId("numbers-result").textContent).toContain("ọ̀kanlá");
  });

  it("inserts a tapped letter at the caret", async () => {
    const user = userEvent.setup();
    render(<NumbersPractice stepId="s" />);
    await user.type(input(), "m");
    await user.click(within(screen.getByTestId("yoruba-keys")).getByRole("button", { name: "ọ" }));
    expect(input().value).toBe("mọ");
  });

  it("checks on Enter", async () => {
    const user = userEvent.setup();
    render(<NumbersPractice stepId="s" />);
    await user.type(input(), "ọ̀kanlá{Enter}");
    expect(screen.getByTestId("numbers-result")).toBeTruthy();
  });

  it("shows the Listen button for a hear question only when there is a clip", async () => {
    const user = userEvent.setup();
    const none = render(<NumbersPractice stepId="s" />);
    await finishToHear(user);
    expect(screen.queryByRole("button", { name: "Play the number" })).toBeNull();
    none.unmount();
    vi.mocked(audioUrlFor).mockReturnValue("/audio/x.mp3");
    render(<NumbersPractice stepId="s" />);
    await finishToHear(user);
    expect(screen.getByRole("button", { name: "Play the number" })).toBeInTheDocument();
  });

  it("records every answer by kind", async () => {
    const user = userEvent.setup();
    render(<NumbersPractice stepId="s" />);
    await answer(user, "ọ̀kanlá");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await answer(user, "99");
    const kinds = loadStats().numbers.kinds;
    expect(kinds["to-yoruba"]).toEqual({ answered: 1, correct: 1 });
    expect(kinds["to-numeral"]).toEqual({ answered: 1, correct: 0 });
  });

  it("shows the score at the end and stores the step's best score once", async () => {
    const user = userEvent.setup();
    render(<NumbersPractice stepId="tens" />);
    await finishAll(user, true);
    expect(screen.getByTestId("numbers-score").textContent).toContain("You got 4 of 4 right.");
    expect(loadStats().numbers.steps.tens).toEqual({ best: 1 });
  });

  it("keeps the best score when a later round is worse, and Try again starts a new round", async () => {
    const user = userEvent.setup();
    render(<NumbersPractice stepId="tens" />);
    await finishAll(user, true);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByTestId("numbers-question").textContent).toContain("Question 1 of 4");
    await finishAll(user, false);
    expect(screen.getByTestId("numbers-score").textContent).toContain("You got 0 of 4 right.");
    expect(loadStats().numbers.steps.tens).toEqual({ best: 1 });
  });

  it("records answers but no step score when the learner leaves mid-round", async () => {
    const user = userEvent.setup();
    const r = render(<NumbersPractice stepId="tens" />);
    await answer(user, "ọ̀kanlá");
    r.unmount();
    expect(loadStats().numbers.kinds["to-yoruba"].answered).toBe(1);
    expect(loadStats().numbers.steps).toEqual({});
  });

  it("still completes a round when storage throws", async () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const user = userEvent.setup();
    render(<NumbersPractice stepId="tens" />);
    await finishAll(user, true);
    expect(screen.getByTestId("numbers-score").textContent).toContain("4 of 4");
    spy.mockRestore();
  });

  it("shows a friendly message when a step has no questions", () => {
    vi.mocked(buildNumbersRound).mockReturnValue([]);
    render(<NumbersPractice stepId="nope" />);
    expect(screen.getByText(/No practice questions/)).toBeInTheDocument();
  });
});

async function finishToHear(user: ReturnType<typeof userEvent.setup>) {
  for (let i = 0; i < 3; i++) {
    await answer(user, "zzz");
    await user.click(screen.getByRole("button", { name: "Next" }));
  }
}

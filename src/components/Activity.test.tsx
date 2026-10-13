import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Question } from "@/content/types";
import { Activity } from "./Activity";

const questions: Question[] = [
  { type: "blank", prompt: "Fish is ___ja.", answer: "ẹ", choices: ["ẹ", "e", "i"] },
  { type: "pick", prompt: "Which is child?", choices: ["ọmọ", "ẹja"], answer: 0 },
  { type: "order", english: "Fish and child", words: ["ọmọ", "àti", "ẹja"], answer: ["ẹja", "àti", "ọmọ"] },
];

describe("Activity", () => {
  it("walks through all questions and reports the score and missed questions", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<Activity questions={questions} onDone={onDone} />);

    await user.click(screen.getByRole("button", { name: "ẹ" }));
    expect(screen.getByText("Correct.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.click(screen.getByRole("button", { name: "ẹja" }));
    expect(screen.getByText(/Not quite/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue" }));

    for (const w of ["ẹja", "àti", "ọmọ"]) {
      await user.click(screen.getByRole("button", { name: w }));
    }
    await user.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText("Correct.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "See results" }));

    expect(onDone).toHaveBeenCalledTimes(1);
    const result = onDone.mock.calls[0]![0];
    expect(result.correct).toBe(2);
    expect(result.total).toBe(3);
    expect(result.missed).toEqual([questions[1]]);
  });

  it("disables answering after an answer is given", async () => {
    const user = userEvent.setup();
    render(<Activity questions={questions} onDone={() => {}} />);
    await user.click(screen.getByRole("button", { name: "e" }));
    expect(screen.getByRole("button", { name: "ẹ" })).toBeDisabled();
  });

  it("lets a learner remove a placed word in the order question", async () => {
    const user = userEvent.setup();
    render(<Activity questions={[questions[2]!]} onDone={() => {}} />);
    await user.click(screen.getByRole("button", { name: "ọmọ" }));
    await user.click(screen.getByRole("button", { name: "Remove ọmọ" }));
    expect(screen.getAllByTestId("bank-word")).toHaveLength(3);
  });

  it("explains a tone-only mistake", async () => {
    const user = userEvent.setup();
    const q: Question = { type: "pick", prompt: "Which means vehicle?", choices: ["ọkọ", "ọkọ̀"], answer: 1 };
    render(<Activity questions={[q]} onDone={() => {}} />);
    await user.click(screen.getByRole("button", { name: "ọkọ" }));
    expect(screen.getByText(/wrong tone/i)).toBeInTheDocument();
  });

  it("marks answers with text, not color alone", async () => {
    const user = userEvent.setup();
    render(<Activity questions={questions} onDone={() => {}} />);
    await user.click(screen.getByRole("button", { name: "e" }));
    const [first, second] = screen.getAllByTestId("choice");
    expect(first).toHaveTextContent("✓");
    expect(second).toHaveTextContent("✗");
  });
});

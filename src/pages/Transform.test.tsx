import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Transform as T } from "@/content/transforms";
import { routeTree } from "@/router";
import { __resetStatsStoreForTests } from "@/hooks/useStats";
import { loadStats } from "@/lib/stats";
import { Transform } from "./Transform";

const item = (id: string, over: Partial<T>): T => ({
  id, kind: "negative", base: "Mo lọ", baseEnglish: "I went", answers: ["Mi ò lọ"],
  rule: `rule for ${id}`, source: "Test source", confidence: "needs-review", note: "n", ...over,
});
const four: T[] = [
  item("t1", {}),
  item("t2", { kind: "question", base: "O lọ", baseEnglish: "You went", answers: ["Ṣé o lọ?"] }),
  item("t3", { kind: "future", base: "Ó jẹun", baseEnglish: "She ate", answers: ["Ó máa jẹun", "Ó yóò jẹun"] }),
  item("t4", { kind: "past", base: "Mo ń kàwé", baseEnglish: "I am reading", answers: ["Mo kàwé"] }),
];

const input = () => screen.getByTestId("transform-input") as HTMLInputElement;
async function answer(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(input(), text);
  await user.click(screen.getByRole("button", { name: "Check" }));
}

describe("Transform page", () => {
  it("shows the first sentence, its English, the instruction and no result", () => {
    render(<Transform items={four} />);
    expect(screen.getByTestId("transform-position").textContent).toBe("Sentence 1 of 4");
    const card = screen.getByTestId("transform-card");
    expect(card.textContent).toContain("Mo lọ");
    expect(card.textContent).toContain("I went");
    expect(card.textContent).toContain("Make this negative");
    expect(screen.queryByTestId("transform-result")).toBeNull();
    expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows the instruction for each kind", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await user.click(screen.getByRole("button", { name: "Advanced" }));
    await answer(user, "Mi ò lọ");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByTestId("transform-card").textContent).toContain("Turn this into a question");
  });

  it("marks an exact answer correct and reveals the model answer and rule", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await user.click(screen.getByRole("button", { name: "Advanced" }));
    await answer(user, "Mi ò lọ");
    expect(screen.getByTestId("transform-result").textContent).toContain("Correct");
    const reveal = screen.getByTestId("transform-reveal");
    expect(reveal.textContent).toContain("Mi ò lọ");
    expect(reveal.textContent).toContain("rule for t1");
  });

  it("calls missing dots and tones close in advanced mode and correct in easy mode", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Transform items={four} />);
    await user.click(screen.getByRole("button", { name: "Advanced" }));
    await answer(user, "mi o lo");
    expect(screen.getByTestId("transform-result").textContent).toContain("Right words, check the dots and tones");
    expect(screen.getByTestId("transform-reveal").textContent).toContain("Mi ò lọ");
    unmount();
    render(<Transform items={four} />);
    await user.click(screen.getByRole("button", { name: "Easy" }));
    await answer(user, "mi o lo");
    expect(screen.getByTestId("transform-result").textContent).toContain("Correct");
  });

  it("marks a wrong answer and shows the correct one beside it", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await answer(user, "Mo ń lọ");
    expect(screen.getByTestId("transform-result").textContent).toContain("Not quite");
    const reveal = screen.getByTestId("transform-reveal");
    expect(reveal.textContent).toContain("Mo ń lọ");
    expect(reveal.textContent).toContain("Mi ò lọ");
  });

  it("lists other accepted answers", async () => {
    const user = userEvent.setup();
    render(<Transform items={four.slice(2)} />);
    await answer(user, "o jẹun");
    expect(screen.getByTestId("transform-reveal").textContent).toContain("Ó yóò jẹun");
  });

  it("does nothing when Check is pressed on an empty box", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await user.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.queryByTestId("transform-result")).toBeNull();
  });

  it("checks on Enter", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await user.type(input(), "Mi ò lọ{Enter}");
    expect(screen.getByTestId("transform-result")).toBeTruthy();
  });

  it("locks the box after checking, then Next and Previous keep it as left", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await answer(user, "Mi ò lọ");
    expect(input().disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByTestId("transform-position").textContent).toBe("Sentence 2 of 4");
    expect(input().value).toBe("");
    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByTestId("transform-position").textContent).toBe("Sentence 1 of 4");
    expect(input().disabled).toBe(true);
    expect(input().value).toBe("Mi ò lọ");
    expect(screen.getByTestId("transform-result")).toBeTruthy();
  });

  it("inserts a tapped letter at the caret", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await user.type(input(), "m");
    await user.click(within(screen.getByTestId("yoruba-keys")).getByRole("button", { name: "ọ" }));
    expect(input().value).toBe("mọ");
  });

  it("puts a tapped tone mark on the previous letter", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await user.type(input(), "ma");
    await user.click(within(screen.getByTestId("yoruba-keys")).getByRole("button", { name: "Acute accent" }));
    expect(input().value).toBe("má");
  });

  it("disables Previous on the first and Next on the last sentence", async () => {
    const user = userEvent.setup();
    render(<Transform items={[four[0]!]} />);
    expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true);
    await answer(user, "Mi ò lọ");
    expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows a friendly message for an empty list", () => {
    render(<Transform items={[]} />);
    expect(screen.getByText(/No sentences yet/)).toBeTruthy();
  });

  it("sets aria-pressed on the mode buttons and keeps a checked result when the mode changes", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    expect(screen.getByRole("button", { name: "Easy" }).getAttribute("aria-pressed")).toBe("true");
    await answer(user, "mi o lo");
    expect(screen.getByTestId("transform-result").textContent).toContain("Correct");
    await user.click(screen.getByRole("button", { name: "Advanced" }));
    expect(screen.getByRole("button", { name: "Advanced" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("transform-result").textContent).toContain("Correct");
  });

  it("is linked from the nav at /transform", async () => {
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/"] }) });
    render(<RouterProvider router={router} />);
    await router.load();
    expect((await screen.findByRole("link", { name: "Transform" })).getAttribute("href")).toBe("/transform");
  });
});

describe("Transform stats", () => {
  beforeEach(() => {
    localStorage.clear();
    __resetStatsStoreForTests();
  });

  it("records a right answer under the current mode", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await answer(user, "mi o lo");
    expect(loadStats().transform).toEqual({ "easy:t1": { kind: "negative", mode: "easy", result: "right" } });
  });
  it("records a close answer in advanced mode", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await user.click(screen.getByRole("button", { name: "Advanced" }));
    await answer(user, "mi o lo");
    expect(loadStats().transform["advanced:t1"]!.result).toBe("close");
  });
  it("records a wrong answer", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await answer(user, "Mo ń lọ");
    expect(loadStats().transform["easy:t1"]!.result).toBe("wrong");
  });
  it("records nothing for an empty Check", async () => {
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await user.click(screen.getByRole("button", { name: "Check" }));
    expect(localStorage.getItem("yp:stats:v1")).toBeNull();
  });
  it("counts the same item once per mode, keeping the first result", async () => {
    const user = userEvent.setup();
    const first = render(<Transform items={four} />);
    await answer(user, "Mo ń lọ");
    first.unmount();
    render(<Transform items={four} />);
    await answer(user, "Mi ò lọ");
    expect(loadStats().transform["easy:t1"]!.result).toBe("wrong");
    expect(Object.keys(loadStats().transform)).toEqual(["easy:t1"]);
  });
  it("still works when storage throws", async () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const user = userEvent.setup();
    render(<Transform items={four} />);
    await answer(user, "Mi ò lọ");
    expect(screen.getByTestId("transform-result").textContent).toContain("Correct");
    spy.mockRestore();
  });
});

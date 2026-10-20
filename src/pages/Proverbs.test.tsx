import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { shuffledChoices } from "@/components/ChoiceQuestion";
import type { Proverb } from "@/content/proverbs";
import { proverbChoices } from "@/lib/proverb-choices";
import { routeTree } from "@/router";
import { __resetStatsStoreForTests } from "@/hooks/useStats";
import { loadStats } from "@/lib/stats";
import { Proverbs } from "./Proverbs";

const make = (n: number): Proverb => ({
  id: `p${n}`,
  yoruba: `Òwe ${n}`,
  literal: `Literal ${n}`,
  meaning: `Meaning ${n}`,
  usedWhen: `Used when ${n}`,
  wrong: [`Wrong A ${n}`, `Wrong B ${n}`],
  source: "s",
  confidence: "needs-review",
  note: "n",
});
const three = [make(1), make(2), make(3)];
const next = () => screen.getByRole("button", { name: "Next" });
const prev = () => screen.getByRole("button", { name: "Previous" });

describe("Proverbs page", () => {
  it("shows the first proverb, its translation and three choices, with no reveal yet", () => {
    render(<Proverbs proverbs={three} />);
    expect(screen.getByTestId("proverb-position")).toHaveTextContent("Proverb 1 of 3");
    expect(screen.getByText("Òwe 1")).toBeInTheDocument();
    expect(screen.getByText("Literal 1")).toBeInTheDocument();
    expect(screen.getAllByTestId("choice")).toHaveLength(3);
    expect(screen.queryByTestId("proverb-reveal")).not.toBeInTheDocument();
  });
  it("locks Next until answered and Previous on the first proverb", () => {
    render(<Proverbs proverbs={three} />);
    expect(next()).toBeDisabled();
    expect(prev()).toBeDisabled();
  });
  it("reveals the meaning and when it is said after a correct answer", async () => {
    render(<Proverbs proverbs={three} />);
    await userEvent.click(screen.getByRole("button", { name: /Meaning 1/ }));
    const reveal = screen.getByTestId("proverb-reveal");
    expect(reveal).toHaveTextContent("Meaning 1");
    expect(reveal).toHaveTextContent("You would say this when");
    expect(reveal).toHaveTextContent("Used when 1");
  });
  it("marks a wrong answer wrong and still shows the correct meaning", async () => {
    render(<Proverbs proverbs={three} />);
    await userEvent.click(screen.getByRole("button", { name: /Wrong A 1/ }));
    expect(screen.getByRole("button", { name: /Wrong A 1/ })).toHaveAttribute("data-state", "wrong");
    expect(within(screen.getByTestId("proverb-reveal")).getByText(/Meaning 1/)).toBeInTheDocument();
  });
  it("moves on, and going back shows the answered proverb revealed and locked", async () => {
    render(<Proverbs proverbs={three} />);
    await userEvent.click(screen.getByRole("button", { name: /Meaning 1/ }));
    await userEvent.click(next());
    expect(screen.getByTestId("proverb-position")).toHaveTextContent("Proverb 2 of 3");
    expect(screen.queryByTestId("proverb-reveal")).not.toBeInTheDocument();
    await userEvent.click(prev());
    expect(screen.getByTestId("proverb-position")).toHaveTextContent("Proverb 1 of 3");
    expect(screen.getByTestId("proverb-reveal")).toBeInTheDocument();
    for (const c of screen.getAllByTestId("choice")) expect(c).toBeDisabled();
  });
  it("disables Next on the last proverb", async () => {
    render(<Proverbs proverbs={three} />);
    for (let i = 1; i <= 3; i++) {
      await userEvent.click(screen.getByRole("button", { name: new RegExp(`Meaning ${i}`) }));
      if (i < 3) await userEvent.click(next());
    }
    expect(screen.getByTestId("proverb-position")).toHaveTextContent("Proverb 3 of 3");
    expect(next()).toBeDisabled();
  });
  it("shows a friendly message when there are no proverbs", () => {
    render(<Proverbs proverbs={[]} />);
    expect(screen.getByText(/No proverbs yet/)).toBeInTheDocument();
  });
  it("does not always put the correct meaning in the same position", () => {
    const positions = new Set<number>();
    for (let n = 1; n <= 20; n++) {
      const p = make(n);
      positions.add(shuffledChoices("What is this proverb about?", proverbChoices(p), p.meaning).indexOf(p.meaning));
    }
    expect(positions.size).toBeGreaterThan(1);
  });
  it("is linked from the nav at /proverbs", async () => {
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/"] }) });
    render(<RouterProvider router={router} />);
    await router.load();
    expect((await screen.findByRole("link", { name: "Proverbs" })).getAttribute("href")).toBe("/proverbs");
  });
});

describe("Proverbs stats", () => {
  beforeEach(() => {
    localStorage.clear();
    __resetStatsStoreForTests();
  });
  const pick = (p: Proverb, text: string) =>
    screen.getAllByTestId("choice").find((c) => c.textContent!.replace(/^[✓✗] /, "") === text)!;

  it("records nothing before an answer", () => {
    render(<Proverbs proverbs={three} />);
    expect(localStorage.getItem("yp:stats:v1")).toBeNull();
  });
  it("records a right guess", async () => {
    const user = userEvent.setup();
    render(<Proverbs proverbs={three} />);
    await user.click(pick(three[0]!, three[0]!.meaning));
    expect(loadStats().proverbs).toEqual({ p1: { correct: true } });
  });
  it("records a wrong guess", async () => {
    const user = userEvent.setup();
    render(<Proverbs proverbs={three} />);
    await user.click(pick(three[0]!, three[0]!.wrong[0]));
    expect(loadStats().proverbs).toEqual({ p1: { correct: false } });
  });
  it("does not count again when going Next and Previous", async () => {
    const user = userEvent.setup();
    render(<Proverbs proverbs={three} />);
    await user.click(pick(three[0]!, three[0]!.meaning));
    await user.click(next());
    await user.click(prev());
    expect(Object.keys(loadStats().proverbs)).toEqual(["p1"]);
    expect(loadStats().days).toHaveLength(1);
  });
  it("keeps the first result when the page is mounted again", async () => {
    const user = userEvent.setup();
    const first = render(<Proverbs proverbs={three} />);
    await user.click(pick(three[0]!, three[0]!.wrong[0]));
    first.unmount();
    render(<Proverbs proverbs={three} />);
    await user.click(pick(three[0]!, three[0]!.meaning));
    expect(loadStats().proverbs.p1).toEqual({ correct: false });
  });
  it("still works when storage throws", async () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const user = userEvent.setup();
    render(<Proverbs proverbs={three} />);
    await user.click(pick(three[0]!, three[0]!.meaning));
    expect(screen.getByTestId("proverb-reveal")).toBeTruthy();
    spy.mockRestore();
  });
});

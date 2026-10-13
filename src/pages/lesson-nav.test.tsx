import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { LEVELS } from "@/content/levels";
import type { Lesson } from "@/content/types";
import { routeTree } from "@/router";

const base = LEVELS[0]!.lessons[0]!;
const one = (id: string, title: string): Lesson => ({ ...base, id, title, questions: [base.questions[0]!] });
const added = [one("t-1", "Test lesson one"), one("t-2", "Test lesson two")];

beforeAll(() => { LEVELS[0]!.lessons.push(...added); });
afterAll(() => { LEVELS[0]!.lessons.splice(LEVELS[0]!.lessons.length - added.length, added.length); });
beforeEach(() => { localStorage.clear(); });

describe("lesson to lesson navigation", () => {
  it("Next lesson opens the new lesson on its instruction page, not the old results", async () => {
    const user = userEvent.setup();
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/lesson/getting-started/t-1"] }) });
    render(<RouterProvider router={router} />);
    await user.click(await screen.findByRole("button", { name: "Start practice" }));
    await user.click((await screen.findAllByTestId("choice"))[0]!);
    await user.click(screen.getByRole("button", { name: "See results" }));
    await user.click(await screen.findByRole("link", { name: "Next lesson" }));
    expect(await screen.findByRole("heading", { name: "Test lesson two" })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Start practice" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Results" })).not.toBeInTheDocument();
  });
});

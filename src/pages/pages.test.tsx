import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { emptyProgress, saveProgress } from "@/lib/progress";
import { routeTree } from "@/router";

async function renderAt(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  render(<RouterProvider router={router} />);
  await router.load();
}

beforeEach(() => {
  localStorage.clear();
});

describe("pages", () => {
  it("home lists the five levels", async () => {
    await renderAt("/");
    for (const t of ["Getting Started", "Beginner", "Intermediate", "Advanced", "Mastery"]) {
      expect(await screen.findByText(t)).toBeInTheDocument();
    }
  });

  it("an unknown level shows a friendly page with a way home", async () => {
    await renderAt("/level/nope");
    expect(await screen.findByText(/couldn't find/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
  });

  it("an unknown lesson shows a friendly page", async () => {
    await renderAt("/lesson/getting-started/nope");
    expect(await screen.findByText(/couldn't find/i)).toBeInTheDocument();
  });

  it("a locked lesson URL shows the locked message with a way home, not not-found", async () => {
    await renderAt("/lesson/beginner/b-1");
    expect(await screen.findByRole("heading", { name: "Beginner is locked" })).toBeInTheDocument();
    expect(screen.getByText(/finish all of Getting Started/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.queryByText(/couldn't find/i)).not.toBeInTheDocument();
  });

  it("finishing the last lesson of a still-locked next level explains instead of linking", async () => {
    const user = userEvent.setup();
    await renderAt("/lesson/getting-started/gs-4");
    await user.click(await screen.findByRole("button", { name: "Start practice" }));
    for (let n = 0; n < 8; n++) {
      const choices = screen.queryAllByTestId("choice");
      if (choices.length) await user.click(choices[0]!);
      else {
        while (screen.queryAllByTestId("bank-word").length) await user.click(screen.getAllByTestId("bank-word")[0]!);
        await user.click(screen.getByRole("button", { name: "Check" }));
      }
      await user.click(screen.getByRole("button", { name: n === 7 ? "See results" : "Continue" }));
    }
    expect(await screen.findByText(/The next level opens after you finish every lesson in Getting Started\./)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Next lesson" })).not.toBeInTheDocument();
  });

  it("an unknown path shows a friendly page", async () => {
    await renderAt("/totally/unknown");
    expect(await screen.findByText(/couldn't find/i)).toBeInTheDocument();
  });

  it("a locked level explains how to unlock it", async () => {
    await renderAt("/level/beginner");
    expect(await screen.findByText(/finish all of Getting Started/i)).toBeInTheDocument();
  });

  it("a user with Unlock all saved can open a locked-by-default level directly", async () => {
    saveProgress({ ...emptyProgress, skipAhead: true });
    await renderAt("/level/beginner");
    expect(await screen.findByRole("heading", { name: "Beginner" })).toBeInTheDocument();
    expect(screen.queryByText(/is locked/i)).not.toBeInTheDocument();
  });

  it("the first level lists its lessons as links", async () => {
    await renderAt("/level/getting-started");
    expect(await screen.findByRole("link", { name: /Lesson 1/ })).toBeInTheDocument();
  });

  it("a lesson opens on its instruction page, not the activity", async () => {
    await renderAt("/lesson/getting-started/gs-1");
    expect(await screen.findByRole("button", { name: "Start practice" })).toBeInTheDocument();
    expect(screen.queryByText(/Question 1 of/)).not.toBeInTheDocument();
  });

  it("the activity opens after Start practice", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    await renderAt("/lesson/getting-started/gs-1");
    await userEvent.setup().click(await screen.findByRole("button", { name: "Start practice" }));
    expect(await screen.findByText(/Question 1 of 8/)).toBeInTheDocument();
  });

  it("about explains the notation", async () => {
    await renderAt("/about");
    expect((await screen.findAllByText(/tone/i)).length).toBeGreaterThan(0);
  });
});

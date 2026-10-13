import { render, screen } from "@testing-library/react";
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

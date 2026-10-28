import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/router";

async function renderAt(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  render(<RouterProvider router={router} />);
  await router.load();
  return await screen.findByRole("button", { name: /Activities/ });
}

const NAMES = ["Grammar", "Vocab", "Numbers", "Sound Bank", "Proverbs", "Songs", "Dialogues", "Transform"];

describe("Activities menu", () => {
  it("is closed at first, with Stats and About still in the nav", async () => {
    const button = await renderAt("/stats");
    expect(button).toHaveAttribute("aria-expanded", "false");
    const nav = document.querySelector(".header-nav") as HTMLElement;
    expect(within(nav).queryByRole("link", { name: "Grammar" })).toBeNull();
    expect(within(nav).getByRole("link", { name: "Stats" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("lists all eight activities when opened", async () => {
    const button = await renderAt("/stats");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const list = document.querySelector(".activities-list") as HTMLElement;
    expect(within(list).getAllByRole("link").map((a) => a.textContent)).toEqual(NAMES);
  });

  it("closes on Escape and on a click outside", async () => {
    const button = await renderAt("/stats");
    fireEvent.click(button);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".activities-list")).toBeNull();
    fireEvent.click(button);
    fireEvent.mouseDown(document.body);
    expect(document.querySelector(".activities-list")).toBeNull();
  });
});

import { render, screen, within, fireEvent } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { NUMBER_STEPS } from "@/content/numbers";
import { __resetStatsStoreForTests } from "@/hooks/useStats";
import { routeTree } from "@/router";

async function renderAt(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  render(<RouterProvider router={router} />);
  await router.load();
}

beforeEach(() => {
  localStorage.clear();
  __resetStatsStoreForTests();
});

describe("Numbers path", () => {
  it("has a hero that says what the page is for", async () => {
    await renderAt("/numbers");
    expect(await screen.findByRole("heading", { level: 1, name: "Count in Yoruba, from one to a thousand" })).toBeInTheDocument();
    expect(document.querySelector(".hero")).not.toBeNull();
  });

  it("lists the six steps in order, each linking to its page", async () => {
    await renderAt("/numbers");
    const cards = await screen.findAllByTestId("numbers-step-card");
    expect(cards).toHaveLength(6);
    expect(cards.map((c) => c.querySelector("strong")!.textContent)).toEqual(
      NUMBER_STEPS.map((s, i) => `${i + 1}. ${s.title}`),
    );
    expect(cards.map((c) => c.getAttribute("href"))).toEqual(NUMBER_STEPS.map((s) => `/numbers/${s.id}`));
  });

  it("shows no best score with no data", async () => {
    await renderAt("/numbers");
    await screen.findAllByTestId("numbers-step-card");
    expect(document.body.textContent).not.toMatch(/Best|NaN/);
  });

  it("shows the best score of a step that has one", async () => {
    localStorage.setItem("yp:stats:v1", JSON.stringify({ numbers: { steps: { "tens-and-twenties": { best: 0.75 } } } }));
    await renderAt("/numbers");
    const cards = await screen.findAllByTestId("numbers-step-card");
    expect(cards[2]!.textContent).toContain("Best 75%");
    expect(cards.filter((c) => c.textContent!.includes("Best"))).toHaveLength(1);
  });

  it("is linked from the nav at /numbers", async () => {
    await renderAt("/");
    fireEvent.click(await screen.findByRole("button", { name: /Activities/ }));
    expect((await screen.findByRole("link", { name: "Numbers" })).getAttribute("href")).toBe("/numbers");
  });
});

describe("Numbers step page", () => {
  it("shows the title, the rule, the examples with how each is built, and a way back", async () => {
    await renderAt("/numbers/tens-and-twenties");
    expect(await screen.findByRole("heading", { level: 1, name: "Tens and twenties" })).toBeInTheDocument();
    expect(screen.getByText(/Twenty \(ogún\) is the base/)).toBeInTheDocument();
    const table = screen.getByTestId("numbers-examples");
    const row = within(table).getByText("ogójì").closest("tr")!;
    expect(row.textContent).toContain("40");
    expect(row.textContent).toContain("20 × 2");
    expect(screen.getByRole("link", { name: "Back to Numbers" }).getAttribute("href")).toBe("/numbers");
    expect(screen.getByTestId("numbers-practice")).toBeInTheDocument();
  });

  it("shows the after-noun forms and two examples per number on step one", async () => {
    await renderAt("/numbers/one-to-ten");
    const table = await screen.findByTestId("numbers-examples");
    expect(table.textContent).toContain("méjì");
    expect(table.textContent).toContain("Mo ní ojú méjì.");
    expect(table.textContent).toContain("I have two eyes.");
    expect(table.textContent).toContain("Example after a noun");
    expect(table.textContent).toContain("Example on its own");
    expect(table.textContent).toContain("Ọ̀kan àti ọ̀kan jẹ́ èjì.");
    expect(table.textContent).toContain("One and one make two.");
  });

  it("keeps each example sentence's audio button attached to the sentence's last word", async () => {
    await renderAt("/numbers/one-to-ten");
    const table = await screen.findByTestId("numbers-examples");
    const tails = table.querySelectorAll(".audio-tail");
    expect(tails).toHaveLength(20);
    expect(tails[0]!.textContent).toBe("ní.");
    expect(tails[1]!.textContent).toBe("ẹ̀ta.");
    expect(tails[16]!.textContent).toBe("mẹ́sàn-án.");
    // The tail is the last word of the sentence, so a wrapped sentence never strands the button.
    expect(tails[2]!.parentElement!.textContent).toBe("Mo ní ojú méjì.");
  });

  it("lists the phrases on the counting and money steps", async () => {
    await renderAt("/numbers/money");
    expect(await screen.findByText("àádọ́ta náírà")).toBeInTheDocument();
    expect(screen.getByText("fifty naira")).toBeInTheDocument();
  });

  it("shows a friendly page for an unknown step", async () => {
    await renderAt("/numbers/nope");
    expect(await screen.findByText(/couldn't find that step/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Numbers" }).getAttribute("href")).toBe("/numbers");
  });
});

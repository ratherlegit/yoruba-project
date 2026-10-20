import { render, screen, within } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/router";

async function renderAbout() {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/about"] }) });
  render(<RouterProvider router={router} />);
  await router.load();
  return await screen.findByRole("main");
}

describe("About page", () => {
  it("describes the site and lists every section of it", async () => {
    const main = await renderAbout();
    expect(within(main).getByRole("heading", { level: 1, name: "About this site" })).toBeInTheDocument();
    const list = within(main).getByTestId("about-sections");
    for (const name of ["Grammar", "Vocab", "Numbers", "Sound Bank", "Proverbs", "Transform", "Songs", "Dialogues", "Stats"]) {
      expect(within(list).getByText(name, { selector: "strong" }), name).toBeInTheDocument();
    }
  });

  it("explains where progress is kept, what the audio and videos are, and how reliable the Yoruba is", async () => {
    const main = await renderAbout();
    const text = main.textContent!;
    expect(text).toMatch(/saved in your browser/i);
    expect(text).toMatch(/no accounts/i);
    expect(text).toContain("ElevenLabs");
    expect(text).toContain("YouTube");
    expect(text).toMatch(/native speaker/i);
  });

  it("has no lesson content and not the old review-list sentence", async () => {
    const main = await renderAbout();
    const text = main.textContent!;
    expect(text).not.toContain("Reading tone marks");
    expect(text).not.toContain("Reading a word breakdown");
    expect(text).not.toContain("High tone is an acute accent");
    expect(text).not.toContain("Items still waiting on review by a Yoruba speaker are tracked in the project's review list.");
  });
});

describe("Site footer", () => {
  it("describes the whole site, not just grammar and vocabulary", async () => {
    await renderAbout();
    const footer = document.querySelector("footer.site-footer")!;
    expect(footer.textContent).toContain("Learn Yoruba from zero, with tone marks and audio.");
    expect(footer.textContent).not.toContain("grammar and vocabulary from scratch");
  });
});

import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DIALOGUES, SITUATIONS } from "@/content/dialogues";
import { LEVELS } from "@/content/levels";
import { routeTree } from "@/router";

// Which clips "exist" is decided per test; the real manifest has no dialogue clips yet.
const clips = vi.hoisted(() => ({ has: ((_text: string, _voice: string) => false) as (text: string, voice: string) => boolean }));
vi.mock("@/lib/audio", async (orig) => ({
  ...(await orig<typeof import("@/lib/audio")>()),
  audioUrlFor: (text: string, voice: string = "female") => (clips.has(text, voice) ? `/audio/${voice}.mp3` : null),
}));

const instances: { url: string }[] = [];
beforeEach(() => {
  instances.length = 0;
  clips.has = () => false;
  vi.stubGlobal(
    "Audio",
    class {
      play = vi.fn(() => Promise.resolve());
      pause = vi.fn();
      addEventListener = vi.fn();
      constructor(public url: string) {
        instances.push(this as never);
      }
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

async function renderAt(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  render(<RouterProvider router={router} />);
  await router.load();
}

const morning = DIALOGUES.find((d) => d.id === "gs-morning")!;

describe("Dialogues index", () => {
  it("lists the five levels in order, each with its situation and its conversations", async () => {
    await renderAt("/dialogues");
    const sections = await screen.findAllByTestId("dialogue-level");
    expect(sections).toHaveLength(5);
    expect(sections.map((s) => s.querySelector("h2")!.textContent)).toEqual(LEVELS.map((l) => l.title));
    for (const [i, level] of LEVELS.entries()) {
      const situation = SITUATIONS.find((s) => s.level === level.id)!;
      expect(sections[i]!.textContent).toContain(situation.title);
      const links = within(sections[i]!).getAllByTestId("dialogue-card");
      expect(links.map((a) => a.getAttribute("href"))).toEqual(
        DIALOGUES.filter((d) => d.situationId === situation.id).map((d) => `/dialogues/${d.id}`),
      );
    }
  });
  it("is in the top nav", async () => {
    await renderAt("/dialogues");
    await screen.findAllByTestId("dialogue-card");
    const nav = document.querySelector(".header-nav") as HTMLElement;
    expect(within(nav).getByRole("link", { name: "Dialogues" })).toHaveAttribute("href", "/dialogues");
  });
});

describe("Dialogue page", () => {
  it("shows the title, the setting, and every line with its speaker, Yoruba and English", async () => {
    await renderAt(`/dialogues/${morning.id}`);
    expect(await screen.findByRole("heading", { level: 1, name: morning.title })).toBeInTheDocument();
    expect(screen.getByText(morning.setting)).toBeInTheDocument();
    const lines = screen.getAllByTestId("dialogue-line");
    expect(lines).toHaveLength(morning.lines.length);
    morning.lines.forEach((l, i) => {
      expect(lines[i]!.textContent).toContain(l.speaker);
      expect(lines[i]!.textContent).toContain(l.yoruba);
      expect(lines[i]!.textContent).toContain(l.english);
    });
  });

  it("hides and shows the English, and the questions still work with it hidden", async () => {
    await renderAt(`/dialogues/${morning.id}`);
    await screen.findAllByTestId("dialogue-line");
    fireEvent.click(screen.getByRole("button", { name: "Hide English" }));
    expect(screen.queryAllByTestId("dialogue-english")).toHaveLength(0);
    expect(screen.getByRole("button", { name: "Show English" })).toBeInTheDocument();
    const choices = screen.getAllByTestId("choice");
    expect(choices.length).toBeGreaterThan(0);
    fireEvent.click(choices[0]!);
    expect(document.querySelector('[data-state="correct"]')).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Show English" }));
    expect(screen.getAllByTestId("dialogue-english")).toHaveLength(morning.lines.length);
  });

  it("shows no Listen or Play all button when there are no clips, and still reads fully", async () => {
    await renderAt(`/dialogues/${morning.id}`);
    await screen.findAllByTestId("dialogue-line");
    expect(screen.queryAllByRole("button", { name: /^Listen/ })).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "Play all" })).toBeNull();
  });

  it("shows Listen only on lines that have a clip in that speaker's voice, and Play all starts the first clip", async () => {
    const first = morning.lines[0]!;
    const second = morning.lines[1]!;
    expect(first.voice).toBe("female");
    expect(second.voice).toBe("male");
    // The female clip exists for line 1; for line 2 only the female clip exists, which must not be used for the male voice.
    clips.has = (t, v) => (v === "female" && (t === first.yoruba || t === second.yoruba)) || (v === "male" && t === morning.lines[3]!.yoruba);
    await renderAt(`/dialogues/${morning.id}`);
    await screen.findAllByTestId("dialogue-line");
    const lines = screen.getAllByTestId("dialogue-line");
    expect(within(lines[0]!).queryByRole("button", { name: /^Listen/ })).not.toBeNull();
    expect(within(lines[1]!).queryByRole("button", { name: /^Listen/ })).toBeNull();
    expect(within(lines[2]!).queryByRole("button", { name: /^Listen/ })).toBeNull();
    expect(within(lines[3]!).queryByRole("button", { name: /^Listen/ })).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Play all" }));
    await vi.waitFor(() => expect(instances.length).toBeGreaterThan(0));
    expect(instances[0]!.url).toBe("/audio/female.mp3");
  });

  it("marks a chosen answer right or wrong and reveals the correct one", async () => {
    await renderAt(`/dialogues/${morning.id}`);
    await screen.findAllByTestId("dialogue-line");
    const q = morning.questions[0]!;
    const wrong = screen.getAllByTestId("choice").find((c) => q.choices.some((x) => x !== q.answer && c.textContent!.includes(x)))!;
    fireEvent.click(wrong);
    expect(wrong).toHaveAttribute("data-state", "wrong");
    expect(document.querySelector('[data-state="correct"]')!.textContent).toContain(q.answer);
  });

  it("shows a not-found card with a way back for an unknown conversation", async () => {
    await renderAt("/dialogues/nope");
    expect(await screen.findByText("We couldn't find that conversation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Dialogues" })).toHaveAttribute("href", "/dialogues");
  });
});

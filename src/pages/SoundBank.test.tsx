import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const audio = new Map<string, string>([
  ["ọkọ", "/audio/a.mp3"], ["ọkọ̀", "/audio/b.mp3"], ["ọkọ́", "/audio/c.mp3"], ["ọmọ", "/audio/d.mp3"],
]);
vi.mock("@/lib/audio", async (orig) => ({
  ...(await orig<typeof import("@/lib/audio")>()),
  audioUrlFor: (t: string) => audio.get(t.normalize("NFC")) ?? null,
}));
const sequence = vi.fn(async (_words: string[]) => {});
vi.mock("@/lib/play-sequence", () => ({ playSequence: (words: string[]) => sequence(words) }));

import { SoundBank } from "./SoundBank";

const SECTION_NAMES = ["Tones", "Key consonants", "Minimal pairs", "Letters reference", "Practice"];

describe("SoundBank", () => {
  it("renders the page heading and all section headings with a jump bar", () => {
    render(<SoundBank />);
    expect(screen.getByRole("heading", { level: 1, name: /Sound Bank/ })).toBeInTheDocument();
    for (const name of SECTION_NAMES) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
      expect(within(screen.getByRole("navigation", { name: "Sections" })).getByRole("link", { name })).toHaveAttribute("href", `#${name.toLowerCase().replace(" ", "-")}`);
    }
  });
  it("renders the sections in the right order, with Practice last", () => {
    render(<SoundBank />);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(SECTION_NAMES);
    const links = within(screen.getByRole("navigation", { name: "Sections" })).getAllByRole("link").map((a) => a.textContent);
    expect(links).toEqual(SECTION_NAMES);
  });
  it("shows the tone grid with 11 rows and the three key consonant cards", () => {
    render(<SoundBank />);
    expect(screen.getAllByTestId(/^tc-/)).toHaveLength(11);
    for (const name of ["gb", "p", "s versus ṣ".normalize("NFC")]) expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
  });
  it("keeps the old vowel and consonant cards in a collapsed reference without the four key consonants", () => {
    render(<SoundBank />);
    const details = screen.getByText(/Show vowels and other consonants/).closest("details")!;
    expect(details).not.toHaveAttribute("open");
    expect(within(details).getByTestId("sound-v-a")).toBeInTheDocument();
    expect(within(details).getByTestId("sound-c-b")).toBeInTheDocument();
    for (const id of ["c-gb", "c-p", "c-s", "c-sh"]) expect(within(details).queryByTestId(`sound-${id}`)).toBeNull();
    expect(screen.queryByTestId("sound-t-high")).toBeNull();
  });
  it("shows speaker buttons only for words that have audio", () => {
    render(<SoundBank />);
    expect(screen.getAllByRole("button", { name: "Listen to ọmọ" }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Listen to ahọ́n" })).toBeNull();
    expect(screen.getAllByText("ahọ́n").length).toBeGreaterThan(0); // word still shown
  });
  it("Play all plays the pair's words in order", async () => {
    sequence.mockClear();
    render(<SoundBank />);
    const card = screen.getByTestId("pair-p-oko-tone");
    await userEvent.click(within(card).getByRole("button", { name: "Play all" }));
    expect(sequence).toHaveBeenCalledWith(["ọkọ", "ọkọ̀", "ọkọ́"]);
  });
  it("the Practice section offers Words and Sentences modes", () => {
    render(<SoundBank />);
    const practice = screen.getByTestId("practice");
    expect(within(practice).getByRole("button", { name: "Words" })).toBeInTheDocument();
    expect(within(practice).getByRole("button", { name: "Sentences" })).toBeInTheDocument();
  });
  it("practice gives feedback and offers Try again", async () => {
    render(<SoundBank />);
    const practice = screen.getByTestId("practice");
    const choices = within(practice).getAllByTestId("choice");
    await userEvent.click(choices[0]!);
    expect(within(practice).getAllByTestId("choice").some((c) => c.getAttribute("data-state") === "correct")).toBe(true);
  });
});

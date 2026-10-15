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

describe("SoundBank", () => {
  it("renders the page heading and all section headings with a jump bar", () => {
    render(<SoundBank />);
    expect(screen.getByRole("heading", { level: 1, name: /Sound Bank/ })).toBeInTheDocument();
    for (const name of ["Vowels", "Consonants", "Tones", "Minimal pairs", "Practice"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
      expect(within(screen.getByRole("navigation", { name: "Sections" })).getByRole("link", { name })).toHaveAttribute("href", `#${name.toLowerCase().replace(" ", "-")}`);
    }
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
  it("practice gives feedback and offers Try again", async () => {
    render(<SoundBank />);
    const practice = screen.getByTestId("practice");
    const choices = within(practice).getAllByTestId("choice");
    await userEvent.click(choices[0]!);
    expect(within(practice).getAllByTestId("choice").some((c) => c.getAttribute("data-state") === "correct")).toBe(true);
  });
});

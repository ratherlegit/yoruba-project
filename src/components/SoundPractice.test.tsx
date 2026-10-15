import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MinimalPair } from "@/content/sounds";
import { audioUrlFor } from "@/lib/audio";
import { SoundPractice } from "./SoundPractice";

vi.mock("@/lib/audio", () => ({ audioUrlFor: vi.fn() }));

const pairs: MinimalPair[] = [
  { id: "p1", contrast: "tone", explain: "x", confidence: "verified", words: [{ yoruba: "ọkọ", english: "husband" }, { yoruba: "ọkọ̀", english: "vehicle" }] },
  { id: "p2", contrast: "tone", explain: "x", confidence: "verified", words: [{ yoruba: "igba", english: "two hundred" }, { yoruba: "ìgbà", english: "time" }] },
];

beforeEach(() => {
  vi.mocked(audioUrlFor).mockReset();
});

describe("SoundPractice", () => {
  it("shows the still-being-added message when no word has audio", () => {
    vi.mocked(audioUrlFor).mockReturnValue(null);
    render(<SoundPractice pairs={pairs} />);
    expect(screen.getByText(/still being added/)).toBeInTheDocument();
  });

  it("runs through every question, shows the score, and restarts on Try again", async () => {
    vi.mocked(audioUrlFor).mockImplementation((t: string) => `/audio/${t}.mp3`);
    vi.stubGlobal("Audio", class { play = () => Promise.resolve(); pause = () => {}; addEventListener() {} });
    const user = userEvent.setup();
    render(<SoundPractice pairs={pairs} />);
    const total = 4;
    expect(screen.getByRole("button", { name: "Play the word" })).toBeInTheDocument();
    for (let i = 1; i <= total; i++) {
      expect(screen.getByText(`Question ${i} of ${total}`)).toBeInTheDocument();
      await user.click(screen.getAllByTestId("choice")[0]!);
      await user.click(screen.getByRole("button", { name: i === total ? "See score" : "Next" }));
    }
    expect(screen.getByText(/You got \d of 4 right\./)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByText(`Question 1 of ${total}`)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});

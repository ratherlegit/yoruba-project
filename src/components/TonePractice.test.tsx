import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ConsonantSet } from "@/content/sound-focus";
import type { MinimalPair } from "@/content/sounds";
import type { ToneTwinEntry } from "@/content/tone-twins";
import type { VocabLevel } from "@/content/vocab/types";
import { audioUrlFor } from "@/lib/audio";
import { playClip } from "@/lib/clip";
import type { ToneSources } from "@/lib/tone-practice";
import { TonePractice } from "./TonePractice";

vi.mock("@/lib/audio", () => ({ audioUrlFor: vi.fn() }));
vi.mock("@/lib/clip", () => ({ playClip: vi.fn() }));

const n = (s: string) => s.normalize("NFC");
const vocab: VocabLevel[] = [
  {
    id: "getting-started", title: "t",
    topics: [{ id: "t1", level: "getting-started", title: "t", blurb: "b", sources: ["s"], words: [
      { id: "w-vehicle", yoruba: n("ọkọ̀"), english: "x", pos: "noun", confidence: "verified", sentence: { yoruba: n("Ọkọ̀ mi pupa."), english: "My car is red." } },
    ] }],
  },
];
const twins: ToneTwinEntry[] = [
  { vocabId: "w-vehicle", twins: [{ yoruba: n("ọkọ"), english: "husband" }, { yoruba: n("ọkọ́"), english: "hoe" }], source: "s", confidence: "needs-review", note: "n" },
];
const pairs: MinimalPair[] = [
  { id: "p-igba", contrast: "tone", explain: "x", confidence: "needs-review", note: "n", words: ["igba", "ìgbà", "igbá"].map((w) => ({ yoruba: n(w), english: "x" })) },
];
const sets: ConsonantSet[] = [
  { id: "cs-gb", focus: ["gb"], explain: "e", source: "s", confidence: "needs-review", note: "n", words: ["bà", "gà", "gbà"].map((w) => ({ yoruba: n(w), english: "meaning" })) },
];
const sources: ToneSources = { vocab, twins, pairs, sets };

function withClips(...texts: string[]) {
  const set = new Set(texts.map(n));
  vi.mocked(audioUrlFor).mockImplementation((t: string) => (set.has(n(t)) ? `/audio/${encodeURIComponent(t)}.mp3` : null));
}
// Answered choices get a leading check or cross mark, which is not part of the word.
const bare = (c: HTMLElement) => c.textContent!.replace(/^[✓✗] /, "");
const choiceTexts = () => screen.getAllByTestId("choice").map(bare);
const choice = (text: string) => screen.getAllByTestId("choice").find((c) => bare(c) === n(text))!;

beforeEach(() => {
  vi.mocked(audioUrlFor).mockReset();
  vi.mocked(playClip).mockReset();
  vi.stubGlobal("Audio", class { play = () => Promise.resolve(); pause = () => {}; addEventListener() {} });
});

describe("TonePractice", () => {
  it("starts in Words mode with a Play the word button and no English", () => {
    withClips("ọkọ̀");
    render(<TonePractice sources={sources} />);
    expect(screen.getByRole("button", { name: "Words" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Play the word" })).toBeInTheDocument();
    expect(screen.queryByText("My car is red.")).toBeNull();
  });

  it("Sentences mode shows the gapped sentence and its English, and no English on the choices", async () => {
    withClips("ọkọ̀", "Ọkọ̀ mi pupa.");
    render(<TonePractice sources={sources} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Sentences" }));
    expect(screen.getByText(n("___ mi pupa."))).toBeInTheDocument();
    expect(screen.getByText("My car is red.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play the sentence" })).toBeInTheDocument();
    expect(choiceTexts().sort()).toEqual(["ọkọ", "ọkọ̀", "ọkọ́"].map(n).sort());
    expect(screen.queryByText("husband")).toBeNull();
  });

  it("marks the correct choice and shows one pitch line for a right answer, two for a wrong one", async () => {
    withClips("ọkọ̀");
    const user = userEvent.setup();
    const { unmount } = render(<TonePractice sources={sources} />);
    await user.click(choice("ọkọ̀"));
    expect(choice("ọkọ̀")).toHaveAttribute("data-state", "correct");
    expect(screen.getAllByLabelText(/Pitch pattern for/)).toHaveLength(1);
    unmount();
    render(<TonePractice sources={sources} />);
    await user.click(choice("ọkọ"));
    expect(screen.getAllByLabelText(/Pitch pattern for/)).toHaveLength(2);
  });

  it("fills the gap with the correct word after answering in Sentences mode", async () => {
    withClips("ọkọ̀", "Ọkọ̀ mi pupa.");
    const user = userEvent.setup();
    render(<TonePractice sources={sources} />);
    await user.click(screen.getByRole("button", { name: "Sentences" }));
    await user.click(choice("ọkọ"));
    expect(screen.getByTestId("practice").textContent).not.toContain("___");
    expect(screen.getByText(n("Ọkọ̀ mi pupa."))).toBeInTheDocument(); // keeps the sentence-initial capital
  });

  it("runs through every question, shows the score, and Try again restarts at question 1", async () => {
    withClips("igba", "ìgbà", "igbá");
    const user = userEvent.setup();
    render(<TonePractice sources={sources} />);
    for (let i = 1; i <= 3; i++) {
      expect(screen.getByText(`Question ${i} of 3`)).toBeInTheDocument();
      await user.click(screen.getAllByTestId("choice")[0]!);
      await user.click(screen.getByRole("button", { name: i === 3 ? "See score" : "Next" }));
    }
    expect(screen.getByText(/You got \d of 3 right\./)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
  });

  it("resets to question 1 and score 0 when the mode changes mid-round", async () => {
    withClips("ọkọ̀", "Ọkọ̀ mi pupa.");
    const user = userEvent.setup();
    render(<TonePractice sources={sources} />);
    await user.click(choice("ọkọ̀")); // right answer, score 1
    await user.click(screen.getByRole("button", { name: "Sentences" }));
    await user.click(screen.getByRole("button", { name: "Words" }));
    expect(screen.getByText("Question 1 of 1")).toBeInTheDocument();
    await user.click(choice("ọkọ")); // wrong answer
    await user.click(screen.getByRole("button", { name: "See score" }));
    expect(screen.getByText("You got 0 of 1 right.")).toBeInTheDocument();
  });

  it("shows a friendly audio message for a mode with no playable question, and the switch still works", async () => {
    withClips("ọkọ̀");
    const user = userEvent.setup();
    render(<TonePractice sources={sources} />);
    await user.click(screen.getByRole("button", { name: "Sentences" }));
    expect(screen.getByText(/audio/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Words" }));
    expect(screen.getByRole("button", { name: "Play the word" })).toBeInTheDocument();
  });

  it("plays the clip again as soon as a question is answered", async () => {
    withClips("ọkọ̀");
    render(<TonePractice sources={sources} />);
    expect(playClip).not.toHaveBeenCalled();
    await userEvent.setup().click(choice("ọkọ"));
    expect(playClip).toHaveBeenCalledTimes(1);
    expect(playClip).toHaveBeenCalledWith(expect.stringContaining("/audio/"));
  });

  it("keeps the round going when the already active mode is tapped again", async () => {
    withClips("igba", "ìgbà", "igbá");
    const user = userEvent.setup();
    render(<TonePractice sources={sources} />);
    await user.click(screen.getAllByTestId("choice")[0]!);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Question 2 of 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Words" }));
    expect(screen.getByText("Question 2 of 3")).toBeInTheDocument();
  });

  it("Sounds mode plays a word, shows the set as choices with no English, and scores", async () => {
    withClips("bà", "gà", "gbà");
    const user = userEvent.setup();
    render(<TonePractice sources={sources} />);
    await user.click(screen.getByRole("button", { name: "Sounds" }));
    expect(screen.getByRole("button", { name: "Sounds" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play the word" })).toBeInTheDocument();
    expect(choiceTexts().sort()).toEqual(["bà", "gà", "gbà"].map(n).sort());
    expect(screen.queryByText("meaning")).toBeNull();
    await user.click(screen.getAllByTestId("choice")[0]!);
    expect(screen.getAllByTestId("choice").some((c) => c.getAttribute("data-state") === "correct")).toBe(true);
  });

  it("shows the audio message for Sounds when no set has two clips", async () => {
    withClips("ọkọ̀", "bà");
    const user = userEvent.setup();
    render(<TonePractice sources={sources} />);
    await user.click(screen.getByRole("button", { name: "Sounds" }));
    expect(screen.getByText(/audio/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Words" }));
    expect(screen.getByRole("button", { name: "Play the word" })).toBeInTheDocument();
  });

  it("adds a Listen button for the chosen word after a wrong answer, so the two can be compared", async () => {
    withClips("ọkọ̀", "ọkọ");
    const user = userEvent.setup();
    render(<TonePractice sources={sources} />);
    expect(screen.queryByRole("button", { name: n("Listen to ọkọ") })).toBeNull();
    await user.click(choice("ọkọ"));
    expect(screen.getByText(n("You chose ọkọ"))).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: n("Listen to ọkọ") }));
    expect(playClip).toHaveBeenCalledTimes(2); // once on answering, once for the chosen word
  });

  it("shows no Listen button for a wrong choice that has no clip", async () => {
    withClips("ọkọ̀");
    render(<TonePractice sources={sources} />);
    await userEvent.setup().click(choice("ọkọ́"));
    expect(screen.getByText(n("You chose ọkọ́"))).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: n("Listen to ọkọ́") })).toBeNull();
  });

  it("shows no chosen-word block after a right answer", async () => {
    withClips("ọkọ̀", "ọkọ");
    render(<TonePractice sources={sources} />);
    await userEvent.setup().click(choice("ọkọ̀"));
    expect(screen.queryByText(/You chose/)).toBeNull();
    expect(screen.queryByRole("button", { name: n("Listen to ọkọ") })).toBeNull();
  });
});

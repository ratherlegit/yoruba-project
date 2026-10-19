import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ToneCompareRow } from "@/content/sound-focus";
import type { Sound } from "@/content/sounds";

vi.mock("@/lib/audio", () => ({ audioUrlFor: (t: string) => `/audio/${t}.mp3` }));
const sequence = vi.fn(async (_words: string[]) => {});
vi.mock("@/lib/play-sequence", () => ({ playSequence: (words: string[]) => sequence(words) }));

import { ToneCompare } from "./ToneCompare";

const n = (s: string) => s.normalize("NFC");
const rows: ToneCompareRow[] = [
  { id: "tc-a", vowel: "a", source: "s", confidence: "needs-review", note: "n",
    words: [{ yoruba: n("wa"), english: "our", tone: "mid" }, { yoruba: n("wá"), english: "come", tone: "high" }, { yoruba: n("wà"), english: "be", tone: "low" }] },
  { id: "tc-ee", vowel: n("ẹ"), source: "s", confidence: "needs-review", note: "n",
    words: [{ yoruba: n("bẹ"), english: "peel", tone: "mid" }, { yoruba: n("bẹ́"), english: "hop", tone: "high" }, { yoruba: n("bẹ̀"), english: "beg", tone: "low" }] },
];
const sounds = [
  { id: "v-a", section: "vowels", letter: "a", compare: "close to 'a' in 'father'", examples: [], confidence: "needs-review", note: "n" },
] as unknown as Sound[];

beforeEach(() => sequence.mockClear());

describe("ToneCompare", () => {
  it("renders one row per row in mid, high, low order with English and a Play all that plays the words in order", async () => {
    render(<ToneCompare rows={rows} sounds={sounds} />);
    const row = screen.getByTestId("tc-a");
    const cells = within(row).getAllByTestId("tone-cell");
    expect(cells.map((c) => c.querySelector("strong")!.textContent)).toEqual(["wa", "wá", "wà"].map(n));
    expect(within(row).getByText("our")).toBeInTheDocument();
    expect(within(row).getByText("be")).toBeInTheDocument();
    await userEvent.click(within(row).getByRole("button", { name: "Play all" }));
    expect(sequence).toHaveBeenCalledWith(["wa", "wá", "wà"].map(n));
    expect(screen.getAllByTestId(/^tc-/)).toHaveLength(2);
  });
  it("shows the explanation card with the dot, the mark and the nasal note", () => {
    render(<ToneCompare rows={rows} sounds={sounds} />);
    const card = screen.getByTestId("tone-explain");
    expect(card.textContent).toContain("A dot under");
    expect(card.textContent).toContain("pitch");
    expect(card.textContent).toContain("nasal");
    for (const label of ["Mid", "High", "Low"]) expect(within(card).getByText(label)).toBeInTheDocument();
  });
  it("shows the vowel's English comparison from its vowel card, and none when there is no card", () => {
    render(<ToneCompare rows={rows} sounds={sounds} />);
    expect(within(screen.getByTestId("tc-a")).getByText("close to 'a' in 'father'")).toBeInTheDocument();
    expect(within(screen.getByTestId("tc-ee")).queryByText(/close to/)).toBeNull();
  });
});

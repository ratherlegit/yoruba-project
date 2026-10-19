import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ConsonantSet } from "@/content/sound-focus";
import type { Sound } from "@/content/sounds";

vi.mock("@/lib/audio", () => ({ audioUrlFor: (t: string) => `/audio/${t}.mp3` }));
const sequence = vi.fn(async (_words: string[]) => {});
vi.mock("@/lib/play-sequence", () => ({ playSequence: (words: string[]) => sequence(words) }));

import { KeyConsonants } from "./KeyConsonants";

const n = (s: string) => s.normalize("NFC");
const sound = (id: string, letter: string, compare: string) => ({ id, section: "consonants", letter, compare, examples: [], confidence: "needs-review", note: "n" }) as unknown as Sound;
const sounds = [sound("c-gb", "gb", "g and b together"), sound("c-p", "p", "said like kp"), sound("c-s", "s", "like s in sun"), sound("c-sh", n("ṣ"), "like sh in ship")];
const set = (id: string, focus: ConsonantSet["focus"], words: string[]): ConsonantSet => ({
  id, focus, explain: `Explain ${id}`, source: "s", confidence: "needs-review", note: "n",
  words: words.map((w, i) => ({ yoruba: n(w), english: `meaning ${id} ${i}` })),
});
const sets = [
  set("cs-gb", ["gb"], ["bà", "gà", "gbà"]),
  set("cs-both", ["gb", "p"], ["pọ́", "kọ́", "bọ́", "gbọ́"]),
  set("cs-sh", ["s-sh"], ["sé", "ṣé"]),
];

beforeEach(() => sequence.mockClear());

describe("KeyConsonants", () => {
  it("shows the three headings with the sound descriptions", () => {
    render(<KeyConsonants sounds={sounds} sets={sets} />);
    for (const name of ["gb", "p", n("s versus ṣ")]) expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    expect(within(screen.getByTestId("key-gb")).getByText(/g and b together/)).toBeInTheDocument();
    expect(within(screen.getByTestId("key-s-sh")).getByText(/like sh in ship/)).toBeInTheDocument();
  });
  it("shows a set under every card its focus names", () => {
    render(<KeyConsonants sounds={sounds} sets={sets} />);
    expect(within(screen.getByTestId("key-gb")).getByText(n("gbọ́"))).toBeInTheDocument();
    expect(within(screen.getByTestId("key-p")).getByText(n("gbọ́"))).toBeInTheDocument();
    expect(within(screen.getByTestId("key-p")).queryByText(n("gbà"))).toBeNull();
    expect(within(screen.getByTestId("key-s-sh")).queryByText(n("gbọ́"))).toBeNull();
  });
  it("Play all plays a set's words in order", async () => {
    render(<KeyConsonants sounds={sounds} sets={sets} />);
    const card = screen.getByTestId("key-s-sh");
    await userEvent.click(within(card).getByRole("button", { name: "Play all" }));
    expect(sequence).toHaveBeenCalledWith(["sé", "ṣé"].map(n));
  });
});

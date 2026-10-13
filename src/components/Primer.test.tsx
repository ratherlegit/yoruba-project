import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LEVELS } from "@/content/levels";
import { Primer } from "./Primer";

afterEach(() => vi.unstubAllGlobals());

const lesson = LEVELS[0]!.lessons[0]!;
const NOTE = "Audio is not available for Yoruba in this browser.";

describe("Primer audio note", () => {
  it("shows one plain note when speechSynthesis is absent", async () => {
    vi.stubGlobal("speechSynthesis", undefined);
    render(<Primer lesson={lesson} />);
    expect(await screen.findAllByText(NOTE)).toHaveLength(1);
  });

  it("shows no note when a Yoruba voice exists", async () => {
    vi.stubGlobal("speechSynthesis", {
      getVoices: () => [{ lang: "yo-NG", name: "Yoruba" }],
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    render(<Primer lesson={lesson} />);
    await screen.findAllByRole("button", { name: /listen/i });
    expect(screen.queryByText(NOTE)).not.toBeInTheDocument();
  });
});

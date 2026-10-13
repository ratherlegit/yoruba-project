import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PitchLine } from "./PitchLine";

describe("PitchLine", () => {
  it("renders one column per syllable with a text tone label", () => {
    render(<PitchLine word="káàárọ̀" />);
    expect(screen.getAllByTestId("pitch-col")).toHaveLength(4);
    expect(screen.getAllByText("high")).toHaveLength(2);
    expect(screen.getAllByText("low")).toHaveLength(2);
  });
  it("handles phrases with spaces", () => {
    render(<PitchLine word="ẹ káàárọ̀" />);
    expect(screen.getAllByTestId("pitch-col")).toHaveLength(5);
  });
  it("renders nothing for a word it cannot syllabify instead of crashing", () => {
    const { container } = render(<PitchLine word="kt" />);
    expect(container).toBeEmptyDOMElement();
  });

  const edges = (c: HTMLElement) => {
    const path = c.querySelector("path")!;
    return {
      l: Number(path.getAttribute("data-y-left")),
      r: Number(path.getAttribute("data-y-right")),
      dot: Number(c.querySelector("circle")!.getAttribute("cy")),
    };
  };
  it("joins adjacent columns: right edge of i equals left edge of i+1", () => {
    render(<PitchLine word="káàárọ̀" />);
    const cols = screen.getAllByTestId("pitch-col").map(edges);
    for (let i = 0; i < cols.length - 1; i++)
      expect(cols[i]!.r).toBe(cols[i + 1]!.l);
  });
  it("starts and ends the line at its own dot", () => {
    render(<PitchLine word="káàárọ̀" />);
    const cols = screen.getAllByTestId("pitch-col").map(edges);
    expect(cols[0]!.l).toBe(cols[0]!.dot);
    expect(cols[cols.length - 1]!.r).toBe(cols[cols.length - 1]!.dot);
  });
  it("draws a flat segment for a single-syllable word", () => {
    render(<PitchLine word="gbọ́" />);
    const c = screen.getAllByTestId("pitch-col").map(edges)[0]!;
    expect(c.l).toBe(c.dot);
    expect(c.r).toBe(c.dot);
  });
  it("puts a spacer (not a pitch-col) between words in a phrase", () => {
    render(<PitchLine word="ẹ káàárọ̀" />);
    const cols = screen.getAllByTestId("pitch-col");
    const gap = cols[0]!.nextElementSibling!;
    expect(gap.getAttribute("data-testid")).toBe("pitch-gap");
    expect(gap.nextElementSibling).toBe(cols[1]!);
  });
});

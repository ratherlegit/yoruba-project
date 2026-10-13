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
});

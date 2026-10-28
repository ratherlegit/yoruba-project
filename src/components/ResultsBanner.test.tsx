import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultsBanner } from "./ResultsBanner";

describe("ResultsBanner", () => {
  it("celebrates a perfect score with falling cowries", () => {
    render(<ResultsBanner correct={8} total={8} />);
    expect(screen.getByText(/Perfect score/)).toBeInTheDocument();
    expect(document.querySelectorAll(".results-confetti").length).toBeGreaterThan(0);
  });
  it("encourages a low score, with no confetti and no NaN", () => {
    render(<ResultsBanner correct={1} total={8} />);
    expect(screen.getByText("Every try teaches you something.")).toBeInTheDocument();
    expect(document.querySelectorAll(".results-confetti")).toHaveLength(0);
    expect(screen.getByTestId("results-banner").textContent).not.toContain("NaN");
  });
  it("handles an empty quiz", () => {
    render(<ResultsBanner correct={0} total={0} />);
    expect(screen.getByTestId("results-banner").textContent).not.toContain("NaN");
  });
});

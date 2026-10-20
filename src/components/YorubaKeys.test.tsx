import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { YorubaKeys } from "./YorubaKeys";

describe("YorubaKeys", () => {
  it("never shows the dotted-circle placeholder, so no key looks like a stray symbol", () => {
    render(<YorubaKeys onInsert={() => {}} />);
    for (const b of screen.getAllByRole("button")) {
      expect(b.textContent, b.getAttribute("aria-label") ?? "").not.toMatch(/[◌̀-ͯ]/);
    }
  });
  it("shows the tone keys as plain accent marks and keeps their accessible names", () => {
    render(<YorubaKeys onInsert={() => {}} />);
    expect(screen.getByRole("button", { name: "Acute accent" }).textContent).toBe("´");
    expect(screen.getByRole("button", { name: "Grave accent" }).textContent).toBe("`");
  });
  it("still inserts the combining marks and letters", async () => {
    const onInsert = vi.fn();
    render(<YorubaKeys onInsert={onInsert} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Acute accent" }));
    await user.click(screen.getByRole("button", { name: "Grave accent" }));
    await user.click(screen.getByRole("button", { name: "ọ" }));
    expect(onInsert.mock.calls.map((c) => c[0])).toEqual(["́", "̀", "ọ"]);
  });
});

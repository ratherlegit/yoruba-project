import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { YorubaKeys } from "./YorubaKeys";

describe("YorubaKeys", () => {
  it("never shows the dotted-circle placeholder or a loose combining mark, so no key looks like a stray symbol", () => {
    render(<YorubaKeys onInsert={() => {}} />);
    for (const b of screen.getAllByRole("button")) {
      expect(b.textContent, b.getAttribute("aria-label") ?? "").not.toMatch(/^[\u0300-\u036f]|\u25cc/);
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
  const ACCENTED = ["a", "e", "i", "o", "u", "\u1eb9", "\u1ecd", "n"].flatMap((b) =>
    ["\u0301", "\u0300"].map((m) => (b + m).normalize("NFC")),
  );
  it("has a key for every accented vowel (and ń, ǹ), so a tone letter is one tap", async () => {
    const onInsert = vi.fn();
    render(<YorubaKeys onInsert={onInsert} />);
    const user = userEvent.setup();
    for (const ch of ACCENTED) {
      await user.click(screen.getByRole("button", { name: ch }));
    }
    expect(onInsert.mock.calls.map((c) => c[0])).toEqual(ACCENTED);
  });
  it("explains how the tone marks work", () => {
    render(<YorubaKeys onInsert={() => {}} />);
    expect(screen.getByText(/tone mark after a letter/i)).toBeInTheDocument();
  });
  it("disables every key when asked", () => {
    render(<YorubaKeys onInsert={() => {}} disabled />);
    for (const b of screen.getAllByRole("button")) expect(b).toBeDisabled();
  });
});

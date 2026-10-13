import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AudioButton } from "./AudioButton";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AudioButton", () => {
  it("renders nothing when speechSynthesis is missing", () => {
    vi.stubGlobal("speechSynthesis", undefined);
    const { container } = render(<AudioButton text="ọmọ" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when no Yoruba voice exists", () => {
    vi.stubGlobal("speechSynthesis", {
      getVoices: () => [{ lang: "en-US", name: "English" }],
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    const { container } = render(<AudioButton text="ọmọ" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an approximate-pronunciation button when a Yoruba voice exists", () => {
    vi.stubGlobal("speechSynthesis", {
      getVoices: () => [{ lang: "yo-NG", name: "Yoruba" }],
      addEventListener: () => {},
      removeEventListener: () => {},
      speak: () => {},
      cancel: () => {},
    });
    render(<AudioButton text="ọmọ" />);
    expect(screen.getByRole("button", { name: /listen/i })).toBeInTheDocument();
    expect(screen.getByText(/approximate/i)).toBeInTheDocument();
  });
});

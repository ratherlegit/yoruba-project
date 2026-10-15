import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioButton } from "./AudioButton";

vi.mock("@/lib/audio", () => ({
  audioUrlFor: (text: string) => (text === "ọmọ" ? "/audio/abc123def456.mp3" : text === "oko" ? "/audio/zzz.mp3" : null),
}));

const instances: { url: string; play: ReturnType<typeof vi.fn>; pause: ReturnType<typeof vi.fn> }[] = [];

beforeEach(() => {
  instances.length = 0;
  vi.stubGlobal(
    "Audio",
    class {
      play = vi.fn(() => Promise.resolve());
      pause = vi.fn();
      constructor(public url: string) {
        instances.push(this as never);
      }
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("AudioButton", () => {
  it("renders a Listen button when the manifest has the clip", () => {
    render(<AudioButton text="ọmọ" />);
    expect(screen.getByRole("button", { name: "Listen to ọmọ" })).toBeInTheDocument();
  });

  it("uses a custom aria-label when label is given", () => {
    render(<AudioButton text="ọmọ" label="Play the word" />);
    expect(screen.getByRole("button", { name: "Play the word" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Listen to ọmọ" })).not.toBeInTheDocument();
  });

  it("renders nothing when there is no clip", () => {
    const { container } = render(<AudioButton text="no clip here" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("plays the right URL on click", async () => {
    render(<AudioButton text="ọmọ" />);
    await userEvent.setup().click(screen.getByRole("button", { name: /listen/i }));
    expect(instances).toHaveLength(1);
    expect(instances[0]!.url).toBe("/audio/abc123def456.mp3");
    expect(instances[0]!.play).toHaveBeenCalledOnce();
  });

  it("stops the previous clip when another starts", async () => {
    render(<><AudioButton text="ọmọ" /><AudioButton text="oko" /></>);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Listen to ọmọ" }));
    await user.click(screen.getByRole("button", { name: "Listen to oko" }));
    expect(instances[0]!.pause).toHaveBeenCalled();
    expect(instances[1]!.url).toBe("/audio/zzz.mp3");
  });

  it("does not throw when play() rejects", async () => {
    vi.stubGlobal(
      "Audio",
      class {
        play = () => Promise.reject(new Error("NotAllowedError"));
        pause = () => {};
      },
    );
    render(<AudioButton text="ọmọ" />);
    await userEvent.setup().click(screen.getByRole("button", { name: /listen/i }));
    expect(screen.getByRole("button", { name: /listen/i })).toBeInTheDocument();
  });

  it("does not throw when play() throws synchronously", async () => {
    vi.stubGlobal(
      "Audio",
      class {
        play = () => { throw new Error("boom"); };
        pause = () => {};
      },
    );
    render(<AudioButton text="ọmọ" />);
    await userEvent.setup().click(screen.getByRole("button", { name: /listen/i }));
    expect(screen.getByRole("button", { name: /listen/i })).toBeInTheDocument();
  });
  it("does not throw when Audio is undefined", async () => {
    vi.stubGlobal("Audio", undefined);
    render(<AudioButton text="ọmọ" />);
    await userEvent.setup().click(screen.getByRole("button", { name: /listen/i }));
    expect(screen.getByRole("button", { name: /listen/i })).toBeInTheDocument();
  });
});

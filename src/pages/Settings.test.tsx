import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Settings } from "./Settings";
import { soundsEnabled } from "@/lib/sfx";
import { loadProgress } from "@/lib/progress";

describe("Settings", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-motion");
  });

  it("turns answer sounds off and on, and remembers it", async () => {
    const user = userEvent.setup();
    render(<Settings />);
    const sw = screen.getByRole("switch", { name: "Answer sounds" });
    expect(sw).toHaveAttribute("aria-checked", "true");
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(soundsEnabled()).toBe(false);
    expect(loadProgress().sounds).toBe(false);
    await user.click(sw);
    expect(soundsEnabled()).toBe(true);
  });

  it("turns animations off by marking the page", async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await user.click(screen.getByRole("switch", { name: "Animations" }));
    expect(document.documentElement.getAttribute("data-motion")).toBe("off");
    await user.click(screen.getByRole("switch", { name: "Animations" }));
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
  });
});

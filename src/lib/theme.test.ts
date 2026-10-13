import { describe, expect, it } from "vitest";
import { applyTheme } from "./theme";

describe("applyTheme", () => {
  it("sets data-theme for light and dark", () => {
    const root = document.createElement("html");
    applyTheme("dark", root);
    expect(root.getAttribute("data-theme")).toBe("dark");
    applyTheme("light", root);
    expect(root.getAttribute("data-theme")).toBe("light");
  });
  it("removes data-theme for system", () => {
    const root = document.createElement("html");
    applyTheme("dark", root);
    applyTheme("system", root);
    expect(root.hasAttribute("data-theme")).toBe(false);
  });
});

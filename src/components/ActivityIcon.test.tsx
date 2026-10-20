import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LEVEL_IDS } from "@/content/types";
import { ACTIVITY_IDS, ActivityIcon } from "./ActivityIcon";
import { LevelIcon } from "./LevelIcon";

const markup = (node: React.ReactElement) => render(node).container.querySelector("svg")!.innerHTML;

describe("ActivityIcon", () => {
  it("has exactly the seven activity ids", () => {
    expect([...ACTIVITY_IDS]).toEqual(["grammar", "vocab", "numbers", "sounds", "proverbs", "transform", "songs"]);
  });
  it("renders a decorative svg for each activity", () => {
    for (const id of ACTIVITY_IDS) {
      const { container, unmount } = render(<ActivityIcon activity={id} />);
      const tile = container.querySelector("span.level-icon")!;
      expect(tile.getAttribute("aria-hidden"), id).toBe("true");
      expect(tile.querySelector("svg")!.getAttribute("viewBox"), id).toBe("0 0 64 64");
      expect(tile.querySelector("svg")!.innerHTML.length, id).toBeGreaterThan(50);
      unmount();
    }
  });
  it("draws seven different icons, none the same as a level icon", () => {
    const drawn = ACTIVITY_IDS.map((id) => markup(<ActivityIcon activity={id} />));
    const levels = LEVEL_IDS.map((id) => markup(<LevelIcon level={id} />));
    expect(new Set(drawn).size).toBe(7);
    for (const d of drawn) expect(levels).not.toContain(d);
  });
  it("uses the large size class when asked", () => {
    const { container } = render(<ActivityIcon activity="vocab" size="lg" />);
    expect(container.querySelector(".level-icon-lg")).not.toBeNull();
  });
  it("draws the sounds icon as a flute, not the old agogo bells", () => {
    const m = markup(<ActivityIcon activity="sounds" />);
    expect(m).not.toContain("M16 25h12l7 30H9Z");
    expect(m).toContain("rotate(");
  });
  it("draws the transform board without the move arrow", () => {
    const m = markup(<ActivityIcon activity="transform" />);
    expect(m).not.toContain("M38 18");
    expect(m).not.toContain("M21 19C26 9");
  });
});

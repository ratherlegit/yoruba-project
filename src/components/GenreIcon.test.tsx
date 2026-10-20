import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SONGS } from "@/content/songs";
import { GenreIcon } from "./GenreIcon";

const markup = (node: React.ReactElement) => render(node).container.querySelector("svg")!.innerHTML;

describe("GenreIcon", () => {
  it("is decorative and uses the shared 64 by 64 icon tile", () => {
    const { container } = render(<GenreIcon genre="Afrobeats" />);
    const tile = container.querySelector("span.level-icon")!;
    expect(tile.getAttribute("aria-hidden")).toBe("true");
    expect(tile.querySelector("svg")!.getAttribute("viewBox")).toBe("0 0 64 64");
  });
  it("draws a different icon for every genre that has songs", () => {
    const genres = [...new Set(SONGS.map((s) => s.genre))];
    expect(genres.length).toBeGreaterThanOrEqual(3);
    const drawn = genres.map((g) => markup(<GenreIcon genre={g} />));
    expect(new Set(drawn).size).toBe(genres.length);
  });
  it("falls back to a drawing for a genre with no songs yet", () => {
    expect(markup(<GenreIcon genre="Fuji" />).length).toBeGreaterThan(50);
  });
});

import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { GENRES, SONGS } from "@/content/songs";
import { routeTree } from "@/router";

async function renderAt(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  render(<RouterProvider router={router} />);
  await router.load();
}

describe("Songs list", () => {
  it("lists every song with its artist and genre, each linking to its page", async () => {
    await renderAt("/songs");
    const cards = await screen.findAllByTestId("song-card");
    expect(cards).toHaveLength(SONGS.length);
    expect(cards.map((c) => c.getAttribute("href"))).toEqual(SONGS.map((s) => `/songs/${s.id}`));
    expect(within(cards[0]!).getByText(SONGS[0]!.title)).toBeInTheDocument();
    expect(cards[0]!.textContent).toContain(SONGS[0]!.artist);
    expect(cards[0]!.textContent).toContain(SONGS[0]!.genre);
  });

  it("puts the music icon first in every song row", async () => {
    await renderAt("/songs");
    const cards = await screen.findAllByTestId("song-card");
    for (const c of cards) {
      const first = c.firstElementChild!;
      expect(first.classList.contains("level-icon")).toBe(true);
      expect(first.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("offers All plus only the genres in use, and filters by genre", async () => {
    await renderAt("/songs");
    await screen.findAllByTestId("song-card");
    const filter = screen.getByRole("group", { name: "Filter by genre" });
    const names = within(filter).getAllByRole("button").map((b) => b.textContent);
    expect(names).toEqual(["All", ...GENRES.filter((g) => SONGS.some((s) => s.genre === g))]);
    expect(within(filter).getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(within(filter).getByRole("button", { name: "Children's" }));
    const kids = screen.getAllByTestId("song-card");
    expect(kids).toHaveLength(SONGS.filter((s) => s.genre === "Children's").length);
    expect(within(filter).getByRole("button", { name: "Children's" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(within(filter).getByRole("button", { name: "All" }));
    expect(screen.getAllByTestId("song-card")).toHaveLength(SONGS.length);
  });

  it("is in the top nav", async () => {
    await renderAt("/songs");
    await screen.findAllByTestId("song-card");
    const nav = document.querySelector(".header-nav")!;
    expect(within(nav as HTMLElement).getByRole("link", { name: "Songs" })).toHaveAttribute("href", "/songs");
  });
});

describe("Song page", () => {
  const song = SONGS.find((s) => s.id === "okunkun")!;

  it("embeds the video privately, with a plain link to YouTube", async () => {
    await renderAt(`/songs/${song.id}`);
    const frame = (await screen.findByTitle(new RegExp(song.title))) as HTMLIFrameElement;
    expect(frame.src).toMatch(new RegExp(`^https://www\\.youtube-nocookie\\.com/embed/${song.videoId}`));
    expect(frame.getAttribute("referrerpolicy")).toBe("strict-origin-when-cross-origin");
    const watch = screen.getByRole("link", { name: /Watch on YouTube/ });
    expect(watch).toHaveAttribute("href", `https://www.youtube.com/watch?v=${song.videoId}`);
    expect(watch).toHaveAttribute("target", "_blank");
    expect(watch.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("shows each excerpted line with its English meaning, and links to the full lyrics", async () => {
    await renderAt(`/songs/${song.id}`);
    const lines = await screen.findAllByTestId("song-line");
    expect(lines).toHaveLength(song.lines.length);
    expect(lines[0]!.textContent).toContain(song.lines[0]!.yoruba);
    expect(lines[0]!.textContent).toContain(song.lines[0]!.english);
    const full = screen.getByRole("link", { name: new RegExp(`full lyrics on ${song.lyricsSite}`, "i") });
    expect(full).toHaveAttribute("href", song.lyricsUrl);
    expect(full).toHaveAttribute("target", "_blank");
    expect(full.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("says the Yoruba is shown as published, without the tone mark and native speaker caveats", async () => {
    await renderAt(`/songs/${song.id}`);
    await screen.findAllByTestId("song-line");
    expect(document.body.textContent).toContain("The Yoruba is shown as published.");
    expect(document.body.textContent).not.toMatch(/tone marks and dots/i);
    expect(document.body.textContent).not.toMatch(/native speaker/i);
  });

  it("prints the published note under the lyrics card, not inside it", async () => {
    await renderAt(`/songs/${song.id}`);
    const card = (await screen.findAllByTestId("song-line"))[0]!.closest("section")!;
    expect(card.textContent).not.toContain("The Yoruba is shown as published.");
    expect(card.nextElementSibling?.textContent).toBe("The Yoruba is shown as published.");
  });

  it("shows a not-found card with a way back for an unknown song", async () => {
    await renderAt("/songs/nope");
    expect(await screen.findByText("We couldn't find that song")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Songs" })).toHaveAttribute("href", "/songs");
  });
});

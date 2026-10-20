import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ActivityIcon } from "@/components/ActivityIcon";
import { Hero } from "@/components/Hero";
import { GENRES, SONGS, type Genre } from "@/content/songs";

export function Songs() {
  const [genre, setGenre] = useState<Genre | null>(null);
  const inUse = GENRES.filter((g) => SONGS.some((s) => s.genre === g));
  const shown = genre ? SONGS.filter((s) => s.genre === genre) : SONGS;
  return (
    <>
      <Hero first="Learn from songs," second="line by line" />
      <main className="page" style={{ display: "grid", gap: "1rem" }}>
        <p className="muted" style={{ margin: 0 }}>
          Songs are real speech. Watch the video, read a few lines in Yoruba with their English meaning, then follow the link to the full lyrics.
        </p>
        <div className="genre-filter" role="group" aria-label="Filter by genre">
          <button className="btn" aria-pressed={genre === null} onClick={() => setGenre(null)}>All</button>
          {inUse.map((g) => (
            <button key={g} className="btn" aria-pressed={genre === g} onClick={() => setGenre(g)}>{g}</button>
          ))}
        </div>
        <div className="rise-in" style={{ display: "grid", gap: "0.75rem" }}>
          {shown.map((s) => (
            <Link
              key={s.id}
              to="/songs/$songId"
              params={{ songId: s.id }}
              className="card row-card song-row"
              data-testid="song-card"
              style={{ textDecoration: "none", color: "var(--text)" }}
            >
              <ActivityIcon activity="songs" />
              <span className="row-main" style={{ display: "grid", gap: "0.2rem" }}>
                <strong>{s.title}</strong>
                <span className="muted">{s.artist}</span>
              </span>
              <span className="status-cell"><span className="genre-chip">{s.genre}</span></span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

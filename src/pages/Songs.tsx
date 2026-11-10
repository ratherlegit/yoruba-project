import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GenreIcon } from "@/components/GenreIcon";
import { Hero } from "@/components/Hero";
import { DIFFICULTIES, GENRES, SONGS, type Difficulty, type Genre } from "@/content/songs";

export function Songs() {
  const [genre, setGenre] = useState<Genre | null>(null);
  const [level, setLevel] = useState<Difficulty | null>(null);
  const inUse = GENRES.filter((g) => SONGS.some((s) => s.genre === g));
  const shown = SONGS.filter((s) => (!genre || s.genre === genre) && (!level || s.difficulty === level));
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
        <div className="genre-filter" role="group" aria-label="Filter by difficulty">
          <button className="btn" aria-pressed={level === null} onClick={() => setLevel(null)}>Any difficulty</button>
          {DIFFICULTIES.map((d) => (
            <button key={d} className="btn" aria-pressed={level === d} onClick={() => setLevel(d)}>{d}</button>
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
              <GenreIcon genre={s.genre} />
              <span className="row-main" style={{ display: "grid", gap: "0.2rem" }}>
                <strong>{s.title}</strong>
                <span className="muted">{s.artist}</span>
              </span>
              <span className="status-cell" style={{ display: "grid", gap: "0.3rem", justifyItems: "end" }}>
                <span className="genre-chip">{s.genre}</span>
                <span className="level-chip" data-level={s.difficulty}>{s.difficulty}</span>
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

import { Link, useParams } from "@tanstack/react-router";
import { VideoEmbed } from "@/components/VideoEmbed";
import { SONGS } from "@/content/songs";

export function Song() {
  const { songId } = useParams({ strict: false }) as { songId: string };
  const song = SONGS.find((s) => s.id === songId);
  if (!song) {
    return (
      <main className="page">
        <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
          <h1 style={{ margin: 0 }}>We couldn't find that song</h1>
          <p className="muted" style={{ margin: 0 }}>The link may be old or mistyped.</p>
          <Link className="btn btn-primary" to="/songs">Back to Songs</Link>
        </div>
      </main>
    );
  }
  const watch = `https://www.youtube.com/watch?v=${song.videoId}`;
  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <Link to="/songs" className="muted">Back to Songs</Link>
      <div style={{ display: "grid", gap: "0.3rem" }}>
        <h1 style={{ margin: 0 }}>{song.title}</h1>
        <p className="muted" style={{ margin: 0 }}>{song.artist} <span className="genre-chip">{song.genre}</span></p>
      </div>
      <VideoEmbed videoId={song.videoId} title={`${song.title} by ${song.artist}`} />
      <p className="muted" style={{ margin: 0 }}>
        {song.videoLabel}. <a href={watch} target="_blank" rel="noopener noreferrer">Watch on YouTube</a> if the video does not play here.
      </p>
      <p style={{ margin: 0 }}>{song.about}</p>
      <section className="card" style={{ display: "grid", gap: "0.9rem" }}>
        <h2 style={{ margin: 0 }}>A few lines</h2>
        <ol className="song-lines">
          {song.lines.map((l, i) => (
            <li key={i} data-testid="song-line">
              <span className="yo song-yoruba">{l.yoruba}</span>
              <span className="muted">{l.english}</span>
            </li>
          ))}
        </ol>
        <p className="muted" style={{ margin: 0 }}>
          The Yoruba is shown as published, and published lyrics often leave out tone marks and dots. The English meanings have not been checked by a native speaker.
        </p>
        <a className="btn" href={song.lyricsUrl} target="_blank" rel="noopener noreferrer">Read the full lyrics on {song.lyricsSite}</a>
      </section>
    </main>
  );
}

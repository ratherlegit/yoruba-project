import { strings } from "./validate";
import { MAX_LINES, type Song } from "./songs";

const EM_DASH = String.fromCharCode(0x2014);
const STRAY_G = String.fromCharCode(0x0261);
const YOUTUBE_ID = /^[\w-]{11}$/;

export function validateSongs(songs: Song[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const videos = new Set<string>();
  for (const s of songs) {
    const err = (m: string) => errors.push(`${s.id}: ${m}`);
    for (const t of strings(s)) {
      if (t !== t.normalize("NFC")) err(`string is not NFC: "${t}"`);
      if (t.includes(EM_DASH)) err(`string contains an em dash: "${t}"`);
      if (t.includes(STRAY_G)) err(`string contains the stray U+0261 g: "${t}"`);
    }
    if (ids.has(s.id)) err("duplicate id");
    ids.add(s.id);
    if (videos.has(s.videoId)) err("duplicate video id");
    videos.add(s.videoId);
    if (!YOUTUBE_ID.test(s.videoId)) err(`videoId is not an 11 character YouTube id: "${s.videoId}"`);
    if (!s.lyricsUrl.startsWith("https://")) err(`lyricsUrl must be https: "${s.lyricsUrl}"`);
    for (const f of ["title", "artist", "videoLabel", "lyricsSite", "about"] as const) {
      if (!s[f].trim()) err(`empty field: ${f}`);
    }
    if (s.lines.length < 1 || s.lines.length > MAX_LINES) err(`lines must be 1 to ${MAX_LINES}, got ${s.lines.length}`);
    s.lines.forEach((l, i) => {
      if (!l.yoruba.trim() || !l.english.trim()) err(`line ${i + 1} is empty`);
    });
    if (!s.source.trim()) err("needs a source");
    if (s.confidence === "needs-review" && !s.note.trim()) err("needs-review needs a note naming the doubt");
  }
  return errors;
}

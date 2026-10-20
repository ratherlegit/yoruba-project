import type { Genre } from "@/content/songs";
import { ActivityIcon } from "./ActivityIcon";

// One simple line icon per song genre, in the same style as the activity icons, drawn from the
// agreed pool of instruments: a dùndún talking drum (Afrobeats), an agogo double bell (Pop) and a
// hand drum (Children's). Juju and Fuji have no songs yet, so they use the Songs icon until
// they are drawn. Decorative: the genre is always written beside the icon.
const SHAPES: Partial<Record<Genre, React.ReactNode>> = {
  Afrobeats: (
    <>
      <ellipse cx="32" cy="14" rx="17" ry="5" />
      <ellipse cx="32" cy="50" rx="17" ry="5" />
      <path d="M15 16c5 10 10 12 10 16s-5 6-10 16M49 16c-5 10-10 12-10 16s5 6 10 16" />
      <path d="M22 18l8 28M42 18l-8 28M26 17l4 29M38 17l-4 29" strokeWidth="1.8" />
      <path d="M50 6c7 3 9 11 5 17" strokeWidth="1.8" />
      <circle cx="55" cy="24" r="2" fill="currentColor" />
    </>
  ),
  Pop: (
    <>
      <path d="M10 24h14l6 28H4Z" />
      <path d="M36 12h12l5 24H31Z" />
      <path d="M24 24c3-10 6-12 12-12" />
      <circle cx="17" cy="52" r="2.2" fill="currentColor" />
      <circle cx="42" cy="36" r="2.2" fill="currentColor" />
      <path d="M52 8l3-4M57 14l4-2M45 6l1-5" strokeWidth="1.8" />
    </>
  ),
  "Children's": (
    <>
      <circle cx="29" cy="38" r="21" />
      <circle cx="29" cy="38" r="16" strokeWidth="1.8" fill="currentColor" fillOpacity=".15" />
      <circle cx="29" cy="17" r="2.6" fill="currentColor" />
      <circle cx="8" cy="38" r="2.6" fill="currentColor" />
      <circle cx="50" cy="38" r="2.6" fill="currentColor" />
      <circle cx="29" cy="59" r="2.6" fill="currentColor" />
      <circle cx="29" cy="38" r="3" fill="currentColor" fillOpacity=".35" />
      <path d="M54 6 40 24" />
      <circle cx="55" cy="5" r="3.2" fill="currentColor" />
    </>
  ),
};

export function GenreIcon({ genre, size = "md" }: { genre: Genre; size?: "md" | "lg" }) {
  const shape = SHAPES[genre];
  if (!shape) return <ActivityIcon activity="songs" size={size} />;
  return (
    <span className={`level-icon level-icon-${size}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        {shape}
      </svg>
    </span>
  );
}

import { useState } from "react";
import { audioUrlFor } from "@/lib/audio";
import { playClip } from "@/lib/clip";

export function AudioButton({ text, label }: { text: string; label?: string }) {
  const url = audioUrlFor(text);
  const [playing, setPlaying] = useState(false);
  if (!url) return null;

  function play() {
    setPlaying(false);
    requestAnimationFrame(() => setPlaying(true));
    playClip(url!);
  }

  return (
    <button className={`btn btn-icon${playing ? " playing" : ""}`} onAnimationEnd={(e) => { if (e.animationName === "wave" && e.target !== e.currentTarget) setPlaying(false); }} onClick={play} aria-label={label ?? `Listen to ${text}`}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
        <path className="wave wave-1" d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path className="wave wave-2" d="M18.5 5.5a9 9 0 0 1 0 13" />
      </svg>
    </button>
  );
}

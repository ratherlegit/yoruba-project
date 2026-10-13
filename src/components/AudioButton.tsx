import { audioUrlFor } from "@/lib/audio";

// One clip at a time: starting a new one stops the previous.
let current: HTMLAudioElement | null = null;

export function AudioButton({ text }: { text: string }) {
  const url = audioUrlFor(text);
  if (!url) return null;

  function play() {
    try {
      current?.pause();
      const clip = new Audio(url!);
      current = clip;
      const started = clip.play();
      // Autoplay rules or a missing file reject the promise. Audio is optional, so stay quiet.
      if (started && typeof started.catch === "function") started.catch(() => {});
    } catch {
      // Some environments throw on construction or play. Stay quiet.
    }
  }

  return (
    <button className="btn" onClick={play} aria-label={`Listen to ${text}`}>Listen</button>
  );
}

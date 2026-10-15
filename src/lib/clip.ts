// One clip at a time across the whole app: starting a new one stops the previous.
let current: HTMLAudioElement | null = null;

export function stopClip(): void {
  try {
    current?.pause();
  } catch {
    // Some environments throw on pause. Stay quiet.
  }
  current = null;
}

export function isCurrentClip(clip: HTMLAudioElement): boolean {
  return current === clip;
}

export function playClip(url: string, onRejected?: () => void): HTMLAudioElement | null {
  stopClip();
  try {
    const clip = new Audio(url);
    current = clip;
    const started = clip.play();
    // Autoplay rules or a missing file reject the promise. Audio is optional, so stay quiet.
    if (started && typeof started.catch === "function") started.catch(() => onRejected?.());
    return clip;
  } catch {
    current = null;
    return null;
  }
}

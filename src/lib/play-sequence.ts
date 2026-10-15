import { audioUrlFor } from "./audio";
import { isCurrentClip, playClip } from "./clip";

let run = 0;

// Resolves true when the clip ended on its own, false when something else took over the player.
function playUntilEnded(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const clip = playClip(url, () => resolve(true));
    if (!clip) return resolve(true); // could not play: skip it and carry on
    const done = () => resolve(isCurrentClip(clip));
    clip.addEventListener("ended", done, { once: true });
    clip.addEventListener("error", done, { once: true });
    clip.addEventListener("pause", done, { once: true });
  });
}

export async function playSequence(
  texts: string[],
  opts: { lookup?: (text: string) => string | null; play?: (url: string) => Promise<boolean> } = {},
): Promise<void> {
  const id = ++run;
  const lookup = opts.lookup ?? audioUrlFor;
  const play = opts.play ?? playUntilEnded;
  for (const text of texts) {
    if (id !== run) return;
    const url = lookup(text);
    if (!url) continue;
    if (!(await play(url))) return;
  }
}

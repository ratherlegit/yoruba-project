import { useEffect } from "react";
import { playSfx } from "@/lib/sfx";

// Renders nothing. Plays the end-of-lesson sound once when a results screen appears.
export function EndSound({ correct, total }: { correct: number; total: number }) {
  useEffect(() => {
    playSfx(total > 0 && correct === total ? "perfect" : "complete");
    // Once per results screen, not every time the score prop is re-read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

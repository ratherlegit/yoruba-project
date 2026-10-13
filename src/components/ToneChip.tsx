import type { Tone } from "@/content/types";

const META: Record<Tone, { symbol: string; label: string }> = {
  high: { symbol: "▲", label: "High" },
  mid: { symbol: "■", label: "Mid" },
  low: { symbol: "▼", label: "Low" },
};

export function ToneChip({ tone }: { tone: Tone }) {
  const { symbol, label } = META[tone];
  return (
    <span className="tone-chip">
      <span aria-hidden="true">{symbol}</span>
      {label}
    </span>
  );
}

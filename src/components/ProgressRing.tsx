export function ProgressRing({ done, total, unit = "lessons" }: { done: number; total: number; unit?: string }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const frac = total === 0 ? 0 : done / total;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" role="img" aria-label={`${done} of ${total} ${unit} complete`}>
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="6" />
      <circle
        cx="24" cy="24" r={r} fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - frac)} transform="rotate(-90 24 24)"
      />
      <text x="24" y="28" textAnchor="middle" fontSize="12" fill="var(--text)">{done}/{total}</text>
    </svg>
  );
}

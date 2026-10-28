function message(correct: number, total: number): string {
  const share = total === 0 ? 0 : correct / total;
  if (share === 1) return "Perfect score. Ẹ ṣé!";
  if (share >= 0.75) return "Ó dára! Well done.";
  if (share >= 0.5) return "Good work. Keep going.";
  return "Every try teaches you something.";
}

const RAYS = Array.from({ length: 16 }, (_, i) => i * 22.5);
const DOTS = Array.from({ length: 24 }, (_, i) => i * 15);
const COWRIES = [
  { x: 24, y: 24, r: 20 }, { x: 52, y: 8, r: -30 }, { x: 188, y: 12, r: 35 },
  { x: 218, y: 38, r: -15 }, { x: 22, y: 126, r: 50 }, { x: 212, y: 130, r: -40 },
];
const ZIGZAG = Array.from({ length: 13 }, (_, i) => `${i * 20},${i % 2 === 0 ? 4 : 12}`).join(" ");
// Adire-style diamonds, offset on alternate rows.
const DIAMONDS = [0, 1, 2, 3].flatMap((r) => Array.from({ length: 12 }, (_, c) => ({ x: 10 + c * 20 + (r % 2) * 10, y: 30 + r * 30 })));

export function ResultsBanner({ correct, total }: { correct: number; total: number }) {
  const perfect = total > 0 && correct === total;
  return (
    <div className="results-banner" data-testid="results-banner">
      <svg className="results-art" viewBox="0 0 240 150" role="img" aria-label="A dùndún talking drum in a gold sun, on an indigo adire pattern">
        <rect x="0" y="0" width="240" height="150" rx="14" fill="#14307a" />
        {DIAMONDS.map((d, i) => (
          <path key={i} d="M0 -4 L4 0 L0 4 L-4 0 Z" fill="#3652a6" transform={`translate(${d.x} ${d.y})`} />
        ))}
        <polyline points={ZIGZAG} fill="none" stroke="#e3b84f" strokeWidth="2" strokeLinejoin="round" />
        <polyline points={ZIGZAG} fill="none" stroke="#e3b84f" strokeWidth="2" strokeLinejoin="round" transform="translate(0 134)" />
        <g transform="translate(120 75)">
          <g className="results-spin">
            {RAYS.map((a) => (
              <path key={a} d="M-3 -52 L0 -66 L3 -52 Z" fill="#e3b84f" transform={`rotate(${a})`} />
            ))}
          </g>
          {DOTS.map((a) => (
            <circle key={a} cx="0" cy="-45" r="2.4" fill="#f6f0e0" transform={`rotate(${a})`} />
          ))}
          <circle r="38" fill="#0b1a4a" stroke="#e3b84f" strokeWidth="3" />
          <circle r="30" fill="none" stroke="#3652a6" strokeWidth="2" strokeDasharray="3 4" />
          <g aria-hidden="true">
            <path d="M-13 -19 C-4 -6 -4 6 -13 19 L13 19 C4 6 4 -6 13 -19 Z" fill="#a8581c" stroke="#f6f0e0" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M-9 -18 L-2 0 L-9 18 M9 -18 L2 0 L9 18 M-4 -18 L0 -6 L4 -18 M-4 18 L0 6 L4 18" fill="none" stroke="#e3b84f" strokeWidth="1.2" strokeLinejoin="round" />
            <ellipse cy="-19" rx="13" ry="4" fill="#f6f0e0" stroke="#c99a2e" strokeWidth="1.2" />
            <ellipse cy="19" rx="13" ry="4" fill="#f6f0e0" stroke="#c99a2e" strokeWidth="1.2" />
            <path d="M15 -16 Q27 -22 27 -6" fill="none" stroke="#e3b84f" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="27" cy="-5" r="3" fill="#e3b84f" />
          </g>
        </g>
        {perfect && COWRIES.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
            <g className="results-confetti" style={{ animationDelay: `${i * 0.12}s` }}>
              <ellipse rx="5" ry="7.5" fill="#f6f0e0" stroke="#c99a2e" strokeWidth="1" />
              <path d="M0 -5 Q-1.5 0 0 5" fill="none" stroke="#8a6a1c" strokeWidth="1.3" strokeLinecap="round" />
            </g>
          </g>
        ))}
      </svg>
      <p className="results-message">{message(correct, total)}</p>
    </div>
  );
}

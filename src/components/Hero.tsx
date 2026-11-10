import type { ReactNode } from "react";

// A pitch line that draws itself, rising and falling like Yoruba tones, with a gold dot riding it.
// Decorative only, and hidden on small screens where the headline needs the room.
function ToneWave() {
  const d = "M0 120 C40 120 50 40 100 40 S160 150 210 150 S270 70 320 70 S380 110 430 90 S480 30 540 30";
  return (
    <svg className="tone-wave" viewBox="0 0 540 180" aria-hidden="true" focusable="false">
      <path className="tone-wave-ghost" d={d} pathLength={1} />
      <path className="tone-wave-line" d={d} pathLength={1} />
      <circle className="tone-wave-dot" r="7" style={{ offsetPath: `path("${d}")` }} />
      {[[100, 40], [210, 150], [320, 70], [430, 90], [540, 30]].map(([x, y], i) => (
        <circle key={i} className="tone-wave-node" cx={x} cy={y} r="5" style={{ animationDelay: `${0.5 + i * 0.35}s` }} />
      ))}
    </svg>
  );
}

// Adire banner. The second line goes in gold on its own line.
export function Hero({ first, second, wide = false, decor = false }: { first: ReactNode; second?: ReactNode; wide?: boolean; decor?: boolean }) {
  return (
    <div className={decor ? "hero hero-live" : "hero"}>
      {decor && <ToneWave />}
      <div className={wide ? "hero-inner page-wide" : "hero-inner"}>
        <h1>
          {first}
          {second && <>{" "}<em>{second}</em></>}
        </h1>
      </div>
    </div>
  );
}

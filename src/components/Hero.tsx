import type { ReactNode } from "react";

// Adire banner. The second line goes in gold on its own line.
export function Hero({ first, second, wide = false }: { first: ReactNode; second?: ReactNode; wide?: boolean }) {
  return (
    <div className="hero">
      <div className={wide ? "hero-inner page-wide" : "hero-inner"}>
        <h1>
          {first}
          {second && <>{" "}<em>{second}</em></>}
        </h1>
      </div>
    </div>
  );
}

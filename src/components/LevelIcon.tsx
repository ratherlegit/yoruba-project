import type { LevelId } from "@/content/types";

// One simple line icon per level, drawn from Yoruba objects: cowrie shell (ẹyọ), calabash (igbá),
// talking drum (dùndún), handwoven cloth (aṣọ òkè), and the palm tree (ọpẹ). Sacred objects such as Opón Ifá and the adé crown are deliberately not used. Decorative: the level title is
// always shown beside the icon.
const SHAPES: Record<LevelId, React.ReactNode> = {
  "getting-started": (
    <>
      <path d="M32 7C18 7 11 20 11 33s8 24 21 24 21-11 21-24S46 7 32 7Z" />
      <path d="M32 15c-4.5 9-4.5 25 0 34 4.5-9 4.5-25 0-34Z" fill="currentColor" fillOpacity=".25" />
      <path d="M27 21h-4M27 28h-5M27 35h-5M27 42h-4M37 21h4M37 28h5M37 35h5M37 42h4" />
    </>
  ),
  beginner: (
    <>
      <path d="M28 6c-1 3 0 5 2 6M26 14c0-4 3-4 6-4s6 0 6 4c0 6 7 9 9 19 2 12-6 24-15 24S15 45 17 33c2-10 9-13 9-19Z" />
      <circle cx="32" cy="40" r="6" />
      <circle cx="32" cy="40" r="1.6" fill="currentColor" />
      <path d="M22 32l2 2M42 32l-2 2M23 50l2-1.5M41 50l-2-1.5" />
      <circle cx="32" cy="28" r="1.4" fill="currentColor" />
    </>
  ),
  intermediate: (
    <>
      <ellipse cx="29" cy="13" rx="15" ry="5" />
      <ellipse cx="29" cy="51" rx="15" ry="5" />
      <path d="M14 13c6 10 6 28 0 38M44 13c-6 10-6 28 0 38" />
      <path d="M18 19l8 30M26 17l-4 32M34 17l4 32M40 19l-8 30" strokeWidth="1.8" />
      <path d="M50 8c5 4 8 10 8 17" />
      <circle cx="58" cy="27" r="3" fill="currentColor" />
    </>
  ),
  advanced: (
    <>
      <path d="M12 12h40v34H12Z" />
      <path d="M12 21h40M12 37h40" strokeWidth="1.8" />
      <path d="M32 23l7 7-7 7-7-7Z" fill="currentColor" fillOpacity=".25" />
      <path d="M18 27l3 3-3 3-3-3ZM46 27l3 3-3 3-3-3Z" strokeWidth="1.8" />
      <path d="M16 46v9M22 46v9M28 46v9M34 46v9M40 46v9M46 46v9" strokeWidth="2" />
    </>
  ),
  mastery: (
    <>
      <path d="M30 57c1-11 1-21 2-31M34 57c-1-11-1-21-2-31" />
      <path d="M30 36h4M30 44h4M30 51h4" strokeWidth="1.8" />
      <path d="M32 26C26 13 16 13 9 20M32 26C24 21 16 25 12 33M32 26C38 13 48 13 55 20M32 26C40 21 48 25 52 33M32 26C32 17 32 12 32 7" />
      <circle cx="29" cy="29" r="2" fill="currentColor" />
      <circle cx="35" cy="29" r="2" fill="currentColor" />
    </>
  ),
};

export function LevelIcon({ level, size = "md" }: { level: LevelId; size?: "md" | "lg" }) {
  return (
    <span className={`level-icon level-icon-${size}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        {SHAPES[level]}
      </svg>
    </span>
  );
}

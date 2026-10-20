// One simple line icon per activity, in the same style as the level icons and drawn from
// everyday Yoruba objects the level icons do not use: adire cloth (grammar), a woven basket,
// apẹ̀rẹ̀ (vocab), a fèrè flute (sounds), a horse, since "òwe lẹ́ṣin ọ̀rọ̀", a proverb is
// the horse of speech (proverbs), and an ayò board (transform). Sacred objects are deliberately
// not used. Decorative: the activity title is always shown beside the icon.
export type ActivityId = "grammar" | "vocab" | "sounds" | "proverbs" | "transform";
export const ACTIVITY_IDS: readonly ActivityId[] = ["grammar", "vocab", "sounds", "proverbs", "transform"];

const SHAPES: Record<ActivityId, React.ReactNode> = {
  grammar: (
    <>
      <path d="M10 10h44v44H10Z" />
      <path d="M32 10v44M10 32h44" strokeWidth="1.8" />
      <circle cx="21" cy="21" r="7" />
      <circle cx="21" cy="21" r="2.6" fill="currentColor" fillOpacity=".25" />
      <circle cx="43" cy="43" r="7" />
      <circle cx="43" cy="43" r="2.6" fill="currentColor" fillOpacity=".25" />
      <path d="M43 14.5 49.5 21 43 27.5 36.5 21Z" fill="currentColor" fillOpacity=".25" />
      <path d="M21 36.5 27.5 43 21 49.5 14.5 43Z" fill="currentColor" fillOpacity=".25" />
    </>
  ),
  vocab: (
    <>
      <path d="M16 22C16 7 48 7 48 22" />
      <ellipse cx="32" cy="23" rx="20" ry="5" />
      <path d="M12 23c1 18 6 31 20 31s19-13 20-31" />
      <path d="M22 28c-1 8 0 15 3 22M32 28v24M42 28c1 8 0 15-3 22" strokeWidth="1.8" />
      <path d="M14 34c12 5 24 5 36 0M17 43c10 4 20 4 30 0" strokeWidth="1.8" />
    </>
  ),
  sounds: (
    <g transform="rotate(-35 32 32)">
      <rect x="4" y="26.5" width="56" height="11" rx="5.5" />
      <ellipse cx="14" cy="32" rx="2.2" ry="1.6" fill="currentColor" fillOpacity=".25" />
      <circle cx="26" cy="32" r="2" fill="currentColor" />
      <circle cx="33" cy="32" r="2" fill="currentColor" />
      <circle cx="40" cy="32" r="2" fill="currentColor" />
      <circle cx="47" cy="32" r="2" fill="currentColor" />
      <path d="M20 26.5v11M54 26.5v11" strokeWidth="1.8" />
    </g>
  ),
  proverbs: (
    <>
      <path d="M12 43C10 38 13 32 18 28L21 14 27 22C31 20 36 20 40 23C48 28 52 38 54 56H40C40 47 38 41 32 39C29 42 25 47 20 47C16 47 13 46 12 43Z" />
      <circle cx="25" cy="30" r="1.6" fill="currentColor" />
      <path d="M14.5 41.5h1.5" />
      <path d="M36 21c4-4 9-3 12 2M41 29c4-3 8-2 10 2M44 37c3-2 6-1 8 2" strokeWidth="1.8" />
    </>
  ),
  transform: (
    <g transform="translate(0 -3)">
      <path d="M10 22h44a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4Z" />
      <circle cx="13" cy="30" r="3.2" />
      <circle cx="21" cy="30" r="3.2" fill="currentColor" fillOpacity=".25" />
      <circle cx="29" cy="30" r="3.2" />
      <circle cx="37" cy="30" r="3.2" />
      <circle cx="45" cy="30" r="3.2" />
      <circle cx="53" cy="30" r="3.2" fill="currentColor" fillOpacity=".25" />
      <circle cx="13" cy="40" r="3.2" fill="currentColor" fillOpacity=".25" />
      <circle cx="21" cy="40" r="3.2" />
      <circle cx="29" cy="40" r="3.2" />
      <circle cx="37" cy="40" r="3.2" fill="currentColor" fillOpacity=".25" />
      <circle cx="45" cy="40" r="3.2" />
      <circle cx="53" cy="40" r="3.2" />
      <path d="M14 48v8M50 48v8" />
    </g>
  ),
};

export function ActivityIcon({ activity, size = "md" }: { activity: ActivityId; size?: "md" | "lg" }) {
  return (
    <span className={`level-icon level-icon-${size}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        {SHAPES[activity]}
      </svg>
    </span>
  );
}

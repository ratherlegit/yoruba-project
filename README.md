# Yoruba Project

A web app for learning Yoruba from zero, with full tone marks and audio throughout. Grammar lessons across five levels (Getting Started, Beginner, Intermediate, Advanced, Mastery), vocabulary by topic, Numbers (counting and naira), a Sound Bank with tone practice, Proverbs, Transform sentence practice, Songs with embedded videos and a few lyric lines, and two-voice Dialogues with comprehension questions. Progress and stats stay in your browser.

## Stack

TypeScript, React, Vite, TanStack Router, Tailwind, deployed to Cloudflare Workers. Progress and stats are stored in `localStorage`; there are no accounts.

## Development

```
npm install
npm run dev      # local dev server
npm test         # unit tests (vitest)
npm run e2e      # end-to-end tests (playwright)
npm run build    # typecheck + production build
```

## Content and audio

Lesson and vocabulary content lives in `content/`. Unverified items are tracked in `content/REVIEW.md`; corrections from Yoruba speakers are welcome via issues. Audio clips in `public/audio/` are generated with ElevenLabs using `tools/audio/` (see its README). Generating new clips needs your own `ELEVENLABS_API_KEY` in `tools/audio/.env`.

## License

MIT. See [LICENSE](LICENSE).

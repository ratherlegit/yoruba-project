# Yoruba Project

A web app that teaches Yoruba to English speakers starting from zero. Five levels (Getting Started, Beginner, Intermediate, Advanced, Mastery), each with grammar lessons, vocabulary, and a Sound Bank of audio clips. Yoruba is always shown with full tone marks and diacritics.

## Stack

TypeScript, React, Vite, TanStack Router, Tailwind, deployed to Cloudflare Workers. Progress is stored in `localStorage`; there are no accounts.

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

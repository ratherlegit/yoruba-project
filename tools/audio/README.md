# Audio pipeline

Clips are pre-generated offline with ElevenLabs text-to-speech and shipped as static files. The app makes no model or network calls for speech. The old Meta MMS-TTS scripts are unused and kept in `legacy-mms/`.

Setup (once):

    python3 -m venv tools/audio/.venv
    tools/audio/.venv/bin/pip install -r tools/audio/requirements.txt
    cp tools/audio/.env.example tools/audio/.env

Then edit `tools/audio/.env` with your API key, voice id and model id. That file is git-ignored; never commit it.

Steps:

    # 1. Write tools/audio/strings.json from the lesson content
    npm run audio:list

    # 2. Dry run: no network, prints string count and total characters, flags strings over 200 characters
    tools/audio/.venv/bin/python tools/audio/generate_elevenlabs.py --dry-run

    # 3. Audition a few clips into a scratch folder (manifest is not touched)
    tools/audio/.venv/bin/python tools/audio/generate_elevenlabs.py --only "ọmọ" "ọkọ̀" --out-dir /tmp/yo-audition

    # 4. Full run (lists strings, then generates into public/audio and merges the manifest)
    npm run audio:generate

    # 5. Check that manifest and files match the lessons
    npm run validate && npx vitest run

Every full run REPLACES the existing clips when you pass `--force` (the default skips files that already exist, so an interrupted run resumes). The first real run must use `--force`, because the current files are old MMS clips:

    tools/audio/.venv/bin/python tools/audio/generate_elevenlabs.py --force

Other options: `--limit N`, `--sleep SECONDS` (default 0.3). Keys are NFC lowercase from `audioKey()` in `src/lib/audio.ts`. Text is sent as NFC so tone marks and dot-below letters survive.

## Free-plan workflow (ElevenLabs web tool, no API)

Use this when the API is not available on your plan. You paste prepared text into the ElevenLabs website, download the audio, and a script cuts it into one clip per word or phrase. About 15 minutes of work.

Before you start: open the ElevenLabs site and check your remaining credits. The whole set is about 1,150 characters including periods (the file sizes printed in step 2 are a little larger because they count line breaks), and every generation counts against the free monthly allowance, retries included. Keep a spare, and do the short test first.

1. `npm run audio:list`
2. `python tools/audio/prepare_paste.py` (use `tools/audio/.venv/bin/python` if plain `python` is missing). This writes `tools/audio/paste/` (test.txt, part-1.txt, part-2.txt, ..., order.json) and prints the character counts. Each item is its own paragraph: the text, a period, a blank line. That folder is git-ignored, so run this command again any time to regenerate it.
3. Open the ElevenLabs text-to-speech web tool. Choose the voice "Olufunmilola - Classy, Poised and Clear" and the model Multilingual v2. Paste all of `tools/audio/paste/test.txt`, generate, and listen. Check the voice sounds right and there is a clear, short pause between items. Download it as `test.mp3` into a folder such as `~/Downloads/yo-audio/`.
4. Split the test file: `python tools/audio/split_clips.py --parts-dir ~/Downloads/yo-audio`. The test clips go to `tools/audio/paste/test-clips/` (never into the app). Listen to them.
5. If they sound good, repeat step 3 for each `part-N.txt` (same voice and model), saving as `part-1.mp3`, `part-2.mp3`, ... in the same folder.
6. Run the splitter on the folder again: `python tools/audio/split_clips.py --parts-dir ~/Downloads/yo-audio`. This writes the final clips to `public/audio/` and merges `src/content/audio-manifest.json`. Add `--dry-run` to preview, or `--out-dir DIR` to write somewhere else without touching the manifest.
7. `npm run validate`, `npx vitest run`, then rebuild (`npm run build`).

How the splitting works: the script knows how many items each file holds (from order.json), finds every silence, and treats the longest ones (one fewer than the number of items) as the gaps between items. It prints a separation margin: the shortest chosen gap divided by the longest gap it did not choose. If the margin is below 1.5, the pauses between items are not clearly longer than pauses inside items; it prints a warning and the list of segments, and writes nothing for that file. Listen to the download, then either regenerate it, try `--noise -40dB` or `-30dB`, or pass `--accept-low-margin` to write the clips anyway (check them by ear). If there are too few pauses, it lists what it found and writes nothing. An optional `--min-gap SECONDS` switches to a fixed pause length instead. Offline self-test: `npm run audio:test`.

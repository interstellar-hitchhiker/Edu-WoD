# The Daily Lexical Biscuit

A vanilla JavaScript, offline-first word-of-the-day PWA with a 365-word archive, local favourites, archive search, copy-card support, and optional local BBC ambience MP3 files.

This package was refactored from the original single-file HTML prototype. The original is preserved in `legacy/daily-lexical-biscuit-single-file-original.html`.

## Run locally

Because the word archive and audio library are loaded from JSON files, run the app from a local server rather than opening `index.html` directly.

```bash
cd daily-lexical-biscuit-pwa
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

## Add the three BBC MP3 files

The generated zip does **not** include the audio files. Put your downloaded MP3s in this exact folder:

```text
assets/audio/bbc/
```

Use these exact filenames:

```text
assets/audio/bbc/bbc_song-thrus_nhu0508018.mp3
assets/audio/bbc/bbc_fire---clo_nhu0500210.mp3
assets/audio/bbc/bbc_rain---hea_nhu0503213.mp3
```

The app displays them with friendly labels:

| App label | Required filename | Source lookup link |
| --- | --- | --- |
| Song thrush birdsong | `bbc_song-thrus_nhu0508018.mp3` | https://sound-effects.bbcrewind.co.uk/search?q=NHU05080188 |
| Close fire / fireplace | `bbc_fire---clo_nhu0500210.mp3` | https://sound-effects.bbcrewind.co.uk/search?q=NHU05002102 |
| Heavy rain | `bbc_rain---hea_nhu0503213.mp3` | https://sound-effects.bbcrewind.co.uk/search?q=NHU05032133 |

The app reads this mapping from `assets/data/audio-library.json`. Change that file if you later rename the MP3s or add more ambience tracks.

## Audio behaviour

- No sound autoplays.
- Select a soundscape, then press **Play ambience**.
- Changing the selected ambience refreshes the audio source. If audio was already playing, the new selection starts playing after the change.
- The audio loops quietly and uses the app volume slider.
- If a file is missing, the app shows which filename needs to be placed in `assets/audio/bbc/`.

## BBC Sound Effects acknowledgement

The optional ambience filenames and source links are for BBC Sound Effects downloads supplied by the project owner. The MP3 files themselves are not included in this generated package.

If you add and publish the BBC files in a GitHub repository, make sure your use matches the BBC Sound Effects terms for your context. Keep the source links above in the README and notices.

## Project structure

```text
index.html
manifest.webmanifest
service-worker.js
.nojekyll
README.md
LICENSE
THIRD-PARTY-AUDIO-NOTICES.md
assets/
  css/styles.css
  js/app.js
  js/audio-player.js
  js/pwa-register.js
  js/storage.js
  js/word-engine.js
  data/words.json
  data/audio-library.json
  audio/bbc/
  icons/
docs/
  audio-guide.md
  deployment-guide.md
  validation-report.md
  word-data-guide.md
legacy/
  daily-lexical-biscuit-single-file-original.html
tools/
  validate-words.mjs
```

## Validate

```bash
npm run check:js
npm run validate:words
```

## Deploy on GitHub Pages

1. Upload the project to a GitHub repository.
2. Add the three MP3 files to `assets/audio/bbc/`.
3. Keep `.nojekyll` in the repository root.
4. Enable GitHub Pages from the repository settings.
5. Use the root folder as the Pages source.

## Licence

The app code and original word archive are provided under the included MIT licence. Optional BBC audio files are not covered by this licence and remain subject to their own terms.

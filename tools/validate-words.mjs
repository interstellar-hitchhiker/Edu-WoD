import fs from 'node:fs';

const words = JSON.parse(fs.readFileSync(new URL('../assets/data/words.json', import.meta.url), 'utf8'));
const audio = JSON.parse(fs.readFileSync(new URL('../assets/data/audio-library.json', import.meta.url), 'utf8'));
const errors = [];
const required = ['id', 'word', 'pos', 'meaning', 'register', 'category', 'note', 'example'];

if (!Array.isArray(words)) errors.push('words.json is not an array.');
if (words.length !== 365) errors.push(`Expected 365 words, found ${words.length}.`);
const ids = new Set();
for (const [index, entry] of words.entries()) {
  for (const key of required) if (!entry[key]) errors.push(`Entry ${index + 1} missing ${key}.`);
  if (ids.has(entry.id)) errors.push(`Duplicate id ${entry.id}.`);
  ids.add(entry.id);
}

for (const track of audio) {
  for (const key of ['id', 'label', 'src', 'filename', 'credit', 'source']) {
    if (!track[key]) errors.push(`Audio track ${track.id || '(unknown)'} missing ${key}.`);
  }
  if (!track.src.endsWith(track.filename)) errors.push(`Audio src/filename mismatch for ${track.id}.`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`OK: ${words.length} words, ${new Set(words.map(w => w.category)).size} categories, ${audio.length} ambience tracks.`);

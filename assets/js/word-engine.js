export function pad(value) {
  return String(value).padStart(2, '0');
}

export function localDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function dayNumber(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

export function dailyPick(words, date) {
  const n = dayNumber(date);
  const slot = ((n % words.length) + words.length) % words.length;
  const index = (slot * 97 + 41) % words.length;
  return { index, slot: slot + 1 };
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightWord(sentence, word) {
  const escaped = escapeRegExp(word);
  const pattern = new RegExp(`(${escaped})`, 'ig');
  return sentence.replace(pattern, '<mark>$1</mark>');
}

export function normalise(text) {
  return String(text).toLowerCase().replace(/[’]/g, "'");
}

export function validateWords(words) {
  const errors = [];
  if (!Array.isArray(words)) {
    return ['Word data is not an array.'];
  }
  if (words.length !== 365) {
    errors.push(`Expected 365 entries, found ${words.length}.`);
  }
  const required = ['id', 'word', 'pos', 'meaning', 'register', 'category', 'note', 'example'];
  const ids = new Set();
  const wordsSeen = new Set();
  for (const [index, entry] of words.entries()) {
    for (const key of required) {
      if (!entry[key]) errors.push(`Entry ${index + 1} is missing ${key}.`);
    }
    if (ids.has(entry.id)) errors.push(`Duplicate id: ${entry.id}.`);
    ids.add(entry.id);
    const w = normalise(entry.word || '');
    if (w && wordsSeen.has(w)) errors.push(`Duplicate word: ${entry.word}.`);
    wordsSeen.add(w);
  }
  return errors;
}

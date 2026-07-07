export function loadSet(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export function saveSet(key, setValue) {
  localStorage.setItem(key, JSON.stringify([...setValue]));
}

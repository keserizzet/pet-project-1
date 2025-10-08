const KEY = "favorites:nannies";
const SNAP_KEY = "favorites:nannies:snapshots";

export function readFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFav(id) {
  return readFavorites().includes(id);
}

export function toggleFav(id) {
  const list = new Set(readFavorites());
  if (list.has(id)) list.delete(id); else list.add(id);
  const arr = Array.from(list);
  localStorage.setItem(KEY, JSON.stringify(arr));
  return arr;
}

export function setFavorites(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids || []));
}

export function saveSnapshot(nanny) {
  try {
    const map = JSON.parse(localStorage.getItem(SNAP_KEY) || '{}');
    map[nanny.id] = nanny;
    localStorage.setItem(SNAP_KEY, JSON.stringify(map));
  } catch {}
}

export function readSnapshot(id) {
  try {
    const map = JSON.parse(localStorage.getItem(SNAP_KEY) || '{}');
    return map[id];
  } catch { return undefined }
}

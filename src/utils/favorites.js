const KEY = "favorites:nannies";

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

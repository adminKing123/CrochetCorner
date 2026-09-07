export function parseIdList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function toggleIdList(ids, id) {
  const set = new Set(ids);

  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
  }

  return Array.from(set);
}

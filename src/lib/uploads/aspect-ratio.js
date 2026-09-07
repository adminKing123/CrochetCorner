import {
  UPLOAD_ASPECT_RATIO_CUSTOM,
  UPLOAD_ASPECT_RATIO_LABELS,
  UPLOAD_DEFAULT_ASPECT_RATIO,
  UPLOAD_FIXED_ASPECT_RATIOS,
} from "@/lib/uploads/defaults";

const STORED_ASPECT_RATIO_PATTERN = /^(\d+)\/(\d+)$/;

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }

  return x || 1;
}

export function simplifyAspectRatio(width, height) {
  const safeWidth = Math.max(1, Math.round(Number(width) || 1));
  const safeHeight = Math.max(1, Math.round(Number(height) || 1));
  const divisor = gcd(safeWidth, safeHeight);

  return `${safeWidth / divisor}/${safeHeight / divisor}`;
}

export function parseAspectRatio(value) {
  const match = String(value).trim().match(STORED_ASPECT_RATIO_PATTERN);

  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!width || !height) {
    return null;
  }

  return width / height;
}

export function isStoredAspectRatio(value) {
  return STORED_ASPECT_RATIO_PATTERN.test(String(value).trim());
}

export function isAspectRatioSelectorValue(value) {
  return (
    UPLOAD_FIXED_ASPECT_RATIOS.includes(value) || value === UPLOAD_ASPECT_RATIO_CUSTOM
  );
}

export function normalizeStoredAspectRatio(value) {
  const normalized = typeof value === "string" ? value.trim() : "";

  if (UPLOAD_FIXED_ASPECT_RATIOS.includes(normalized)) {
    return normalized;
  }

  if (isStoredAspectRatio(normalized)) {
    const [width, height] = normalized.split("/").map(Number);
    return simplifyAspectRatio(width, height);
  }

  return UPLOAD_DEFAULT_ASPECT_RATIO;
}

export function formatAspectRatioLabel(value) {
  if (value === UPLOAD_ASPECT_RATIO_CUSTOM) {
    return UPLOAD_ASPECT_RATIO_LABELS.custom;
  }

  if (UPLOAD_ASPECT_RATIO_LABELS[value]) {
    return UPLOAD_ASPECT_RATIO_LABELS[value];
  }

  if (isStoredAspectRatio(value)) {
    return value.replace("/", ":");
  }

  return value;
}

export function getAspectRatioSelectorValue(storedRatio) {
  if (UPLOAD_FIXED_ASPECT_RATIOS.includes(storedRatio)) {
    return storedRatio;
  }

  if (isStoredAspectRatio(storedRatio)) {
    return UPLOAD_ASPECT_RATIO_CUSTOM;
  }

  return UPLOAD_DEFAULT_ASPECT_RATIO;
}

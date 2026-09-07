export function getSafeRedirectPath(path) {
  if (!path || typeof path !== "string") {
    return null;
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return null;
  }

  if (
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/verify-email") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password")
  ) {
    return null;
  }

  return path;
}

export function buildAuthRedirectUrl(basePath, redirect) {
  const safeRedirect = getSafeRedirectPath(redirect);

  if (!safeRedirect) {
    return basePath;
  }

  return `${basePath}?redirect=${encodeURIComponent(safeRedirect)}`;
}

export function getRedirectFromSearchParams(searchParams) {
  const redirect = searchParams?.get?.("redirect") || "";
  return getSafeRedirectPath(redirect);
}

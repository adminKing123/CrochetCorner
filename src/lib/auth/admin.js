export function normalizeEmail(email) {
  return email?.toLowerCase().trim() || "";
}

export function getAdminEmail() {
  return normalizeEmail(process.env.ADMIN_EMAIL);
}

export function isAdminEmailConfigured() {
  return Boolean(getAdminEmail());
}

export function isAdminEmail(email) {
  const adminEmail = getAdminEmail();
  if (!adminEmail || !email) return false;
  return normalizeEmail(email) === adminEmail;
}

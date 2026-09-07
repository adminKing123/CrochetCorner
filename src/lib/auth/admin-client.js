export function isAdminUser(user) {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
  if (!adminEmail || !user?.email) return false;
  return user.email.toLowerCase().trim() === adminEmail;
}

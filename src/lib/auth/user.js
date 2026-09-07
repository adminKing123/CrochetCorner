export function getUserInitial(user) {
  const name = user?.displayName || user?.email || "?";
  return name.charAt(0).toUpperCase();
}

export function getContactEmail() {
  return process.env.CONTACT_EMAIL?.trim() || "";
}

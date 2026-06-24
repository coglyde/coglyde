import type { User } from "@clerk/nextjs/server";

// Coglyde team accounts that may view + edit every client's content. Defaults to
// info@coglyde.com; override/extend with COGLYDE_ADMIN_EMAILS (comma-separated).
// No DB: admin status is just the signed-in email.
const ADMIN_EMAILS = new Set(
  (process.env.COGLYDE_ADMIN_EMAILS ?? "info@coglyde.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.emailAddresses.some((e) => ADMIN_EMAILS.has(e.emailAddress.toLowerCase()));
}

import type { User } from "@clerk/nextjs/server";

// Resolves which site repo a client's content requests go to, without a
// database. Mirrors the Stripe-customer-id pattern: the repo is stored on the
// Clerk user's private metadata (`contentRepo`, e.g. "coglyde/nopointmusic").
// Falls back to DEFAULT_CONTENT_REPO so the first client works before any
// per-user setup. Returns null when no site is linked.

const CONTENT_REPO_KEY = "contentRepo";

export function getClientRepo(user: User | null): string | null {
  const meta = user?.privateMetadata as { contentRepo?: string } | undefined;
  return meta?.[CONTENT_REPO_KEY] ?? process.env.DEFAULT_CONTENT_REPO ?? null;
}

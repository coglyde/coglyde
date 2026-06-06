import type { User } from "@clerk/nextjs/server";

// Resolves which site repo a client's content requests go to, without a
// database. Mirrors the Stripe-customer-id pattern: the repo is stored on the
// client's Clerk user private metadata (`contentRepo`, e.g.
// "coglyde/nopointmusic"). Strictly per-client, no global default, so an
// unconfigured account is never tied to someone else's site. Returns null when
// no repo is linked.

const CONTENT_REPO_KEY = "contentRepo";

export function getClientRepo(user: User | null): string | null {
  const meta = user?.privateMetadata as { contentRepo?: string } | undefined;
  return meta?.[CONTENT_REPO_KEY] ?? null;
}

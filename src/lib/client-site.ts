import type { User } from "@clerk/nextjs/server";

// The client's live site, for the Overview hero (preview + Visit link). Stored
// strictly on the client's Clerk privateMetadata (siteUrl / siteName), no global
// default, so an unconfigured account shows no site rather than someone else's.
// url is null when no site is linked.
export type ClientSite = { url: string | null; name: string };

export function getClientSite(user: User | null): ClientSite {
  const meta = user?.privateMetadata as { siteUrl?: string; siteName?: string } | undefined;
  const url = meta?.siteUrl ?? null;
  const name =
    meta?.siteName ??
    (url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "Your site");
  return { url, name };
}

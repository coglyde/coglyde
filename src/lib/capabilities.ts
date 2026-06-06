import type { User } from "@clerk/nextjs/server";
import { getClientRepo } from "./client-repo";

// Per-client feature gating, stored on the Clerk user's privateMetadata (no DB),
// the same place we keep the Stripe customer id and the content repo. The
// dashboard renders only the sections a client is entitled to. Toggle a client's
// access by editing their metadata (in the Clerk dashboard now; an internal
// Coglyde admin view later):
//
//   privateMetadata: {
//     contentRepo: "coglyde/nopointmusic",   // enables Site updates
//     features: { analytics: true },          // enables Analytics
//   }
//
// So a client with no linked site repo simply cannot file content requests: the
// Site updates section is hidden for them.

export type Capabilities = {
  siteUpdates: boolean;
  analytics: boolean;
};

export function getCapabilities(user: User | null): Capabilities {
  const meta = user?.privateMetadata as { features?: { analytics?: boolean } } | undefined;
  return {
    // A linked site repo (per-user metadata, or the DEFAULT_CONTENT_REPO fallback
    // while there is a single client). Drop the env fallback in client-repo.ts
    // for strict per-client gating once there is more than one client.
    siteUpdates: getClientRepo(user) !== null,
    // Analytics is off until a client's analytics collection is connected
    // (the analytics phase wires this on).
    analytics: meta?.features?.analytics === true,
  };
}

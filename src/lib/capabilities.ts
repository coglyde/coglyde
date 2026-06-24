import type { User } from "@clerk/nextjs/server";
import { getClientRepo } from "./client-repo";
import type { PlanSummary } from "./stripe-customer";

// Per-client feature gating. The marquee rule: "Request changes" (the AI-agent
// change-request flow, capability key `siteUpdates`) is a perk of the Hosting +
// Maintenance retainer, so it only lights up for clients on an active
// `hosting-maintenance` subscription. The direct "Site updates" form editors a
// client may use live under `editableContent` (you enable specific ones per
// client). Everything stays in Clerk privateMetadata (no DB); manual overrides
// live under `features`:
//
//   privateMetadata: {
//     contentRepo: "coglyde/talaba-racing",            // where edits commit
//     features: { siteUpdates: true, analytics: true },// manual overrides
//     editableContent: ["stats"],                      // direct form editors
//   }

const SITE_UPDATES_PLAN = "hosting-maintenance";
const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function hasSiteUpdatesPlan(subscriptions: PlanSummary[]): boolean {
  return subscriptions.some(
    (sub) => sub.planKey === SITE_UPDATES_PLAN && ACTIVE_STATUSES.has(sub.status),
  );
}

export type Capabilities = {
  siteUpdates: boolean;
  analytics: boolean;
  /** Content types this client may edit directly via dashboard forms. */
  editableContent: string[];
};

// Content-type keys a client may self-edit, from privateMetadata.editableContent
// (only when a repo is linked). These are intersected with the repo's own
// _schema.json at the API, so an unknown key here is simply ignored there.
export function getEditableContentTypes(user: User | null): string[] {
  if (getClientRepo(user) === null) return [];
  const meta = user?.privateMetadata as { editableContent?: unknown } | undefined;
  const list = Array.isArray(meta?.editableContent) ? meta.editableContent : [];
  return list.filter((type): type is string => typeof type === "string");
}

export function getCapabilities(
  user: User | null,
  subscriptions: PlanSummary[],
): Capabilities {
  const meta = user?.privateMetadata as
    | { features?: { siteUpdates?: boolean; analytics?: boolean } }
    | undefined;

  // Entitled by the Hosting + Maintenance plan, or a manual override flag, and
  // only actionable once a site repo is linked (the agent needs somewhere to
  // file requests).
  const entitled = meta?.features?.siteUpdates === true || hasSiteUpdatesPlan(subscriptions);

  return {
    siteUpdates: entitled && getClientRepo(user) !== null,
    analytics: meta?.features?.analytics === true,
    editableContent: getEditableContentTypes(user),
  };
}

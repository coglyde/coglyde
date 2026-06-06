import type { User } from "@clerk/nextjs/server";
import { getClientRepo } from "./client-repo";
import type { PlanSummary } from "./stripe-customer";

// Per-client feature gating. The marquee rule: "Site updates" (the AI-agent
// change-request flow) is a perk of the Hosting + Maintenance retainer, so it
// only lights up for clients on an active `hosting-maintenance` subscription.
// Everything stays in Clerk privateMetadata (no DB). Manual overrides live under
// `features` for testing or comped clients:
//
//   privateMetadata: {
//     contentRepo: "coglyde/nopointmusic",          // where requests are filed
//     features: { siteUpdates: true, analytics: true }, // manual overrides
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
};

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
  };
}

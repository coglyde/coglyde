"use client";

import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  SquarePen,
  BarChart3,
  CreditCard,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { SitePreview } from "./SitePreview";
import type { Capabilities } from "@/lib/capabilities";
import type { ClientSite } from "@/lib/client-site";
import type { SectionId } from "./AccountDashboard";

type Props = {
  userName: string;
  site: ClientSite;
  capabilities: Capabilities;
  hasSubscriptions: boolean;
  onNavigate: (id: SectionId) => void;
};

// A card that jumps into another dashboard section, with a Vercel-style
// top-right arrow affordance.
function NavCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="group w-full text-left">
      <Card className="border-transparent bg-white/[0.02] transition-colors group-hover:bg-white/[0.05]">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <Icon className="h-5 w-5 text-white/70" />
            <ArrowUpRight className="h-4 w-4 text-white/30 transition-colors group-hover:text-white/70" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </button>
  );
}

export function OverviewSection({
  userName,
  site,
  capabilities,
  hasSubscriptions,
  onNavigate,
}: Props) {
  const domain = site.url ? site.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome back{userName ? `, ${userName}` : ""}
        </h2>
        <p className="text-muted-foreground">Here is your Coglyde workspace.</p>
      </div>

      {site.url ? (
        // Connected: live preview + status + visit.
        <Card className="overflow-hidden border-transparent bg-white/[0.02] p-0">
          <div className="grid md:grid-cols-[1.5fr_1fr]">
            <div className="border-b border-white/[0.06] bg-black md:border-b-0 md:border-r">
              <SitePreview url={site.url} name={site.name} />
            </div>

            <div className="flex flex-col justify-center gap-5 p-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-sm font-medium text-white/80">Live</span>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Your website</p>
                <h3 className="text-xl font-semibold text-white">{site.name}</h3>
                {domain && <p className="truncate text-sm text-white/45">{domain}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
                >
                  Visit site <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {capabilities.siteUpdates && (
                  <button
                    type="button"
                    onClick={() => onNavigate("content")}
                    className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white/55 transition-colors hover:text-white"
                  >
                    Request a change
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        // No site connected: say so, and point them to the team.
        <Card className="border-transparent bg-white/[0.02]">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Globe className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">No website connected yet</p>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                If your site is already live, reach out and our team will connect it
                to your dashboard.
              </p>
            </div>
            <GlowingButton type="button" onClick={() => onNavigate("support")}>
              Contact our team
            </GlowingButton>
          </CardContent>
        </Card>
      )}

      {/* Entry cards into the other sections. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.editableContent.length > 0 && (
          <NavCard
            icon={SquarePen}
            title="Site updates"
            description="Edit your site content"
            onClick={() => onNavigate("edit")}
          />
        )}
        {capabilities.siteUpdates && (
          <NavCard
            icon={Sparkles}
            title="Request changes"
            description="Ask our team for anything else"
            onClick={() => onNavigate("content")}
          />
        )}
        <NavCard
          icon={BarChart3}
          title="Analytics"
          description="Visitors and top pages"
          onClick={() => onNavigate("analytics")}
        />
        <NavCard
          icon={CreditCard}
          title="Billing"
          description={hasSubscriptions ? "Manage your subscription" : "View plans"}
          onClick={() => onNavigate("billing")}
        />
      </div>
    </div>
  );
}

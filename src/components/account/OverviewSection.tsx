"use client";

import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  BarChart3,
  CreditCard,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

      {/* Hero: live site preview + status + visit. */}
      <Card className="overflow-hidden border-transparent bg-white/[0.02] p-0">
        <div className="grid md:grid-cols-[1.5fr_1fr]">
          <div className="border-b border-white/[0.06] bg-black md:border-b-0 md:border-r">
            {site.url ? (
              <SitePreview url={site.url} name={site.name} />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center text-white/25">
                <Globe className="h-8 w-8" />
              </div>
            )}
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
              {site.url && (
                <a
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
                >
                  Visit site <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {capabilities.siteUpdates && (
                <button
                  type="button"
                  onClick={() => onNavigate("content")}
                  className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white/55 transition-colors hover:text-white"
                >
                  Request an update
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Entry cards into the other sections. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.siteUpdates && (
          <NavCard
            icon={Sparkles}
            title="Site updates"
            description="Request and track changes"
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

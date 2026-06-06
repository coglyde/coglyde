import { Sparkles, BarChart3, CreditCard } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Capabilities } from "@/lib/capabilities";

type Props = {
  userName: string;
  capabilities: Capabilities;
  hasSubscriptions: boolean;
};

// Light landing view: a greeting and a few status cards. Kept simple on purpose.
export function OverviewSection({ userName, capabilities, hasSubscriptions }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome back{userName ? `, ${userName}` : ""}
        </h2>
        <p className="text-muted-foreground">Here is your Coglyde workspace.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Sparkles className="mb-2 h-5 w-5 text-primary" />
            <CardTitle className="text-base">Site updates</CardTitle>
            <CardDescription>
              {capabilities.siteUpdates
                ? "Request changes to your site and track them."
                : "No site connected yet."}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <BarChart3 className="mb-2 h-5 w-5 text-primary" />
            <CardTitle className="text-base">Analytics</CardTitle>
            <CardDescription>
              {capabilities.analytics ? "Your latest traffic at a glance." : "Coming soon."}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CreditCard className="mb-2 h-5 w-5 text-primary" />
            <CardTitle className="text-base">Billing</CardTitle>
            <CardDescription>
              {hasSubscriptions ? "Your subscription is active." : "No active subscription."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

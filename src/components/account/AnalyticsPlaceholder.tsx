import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Gated Analytics section. Shown until a client's analytics collection is wired
// (the analytics phase replaces this with real charts).
export function AnalyticsPlaceholder() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">Analytics coming soon</p>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Once your site analytics are connected, you will see visitors, top
            pages, and trends right here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

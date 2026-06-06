"use client";

import { useState } from "react";
import { GlowingButton } from "@/components/ui/GlowingButton";

// Opens the Stripe billing portal for the signed-in user. Used on /account and
// the post-checkout success page. No props: the portal route resolves the
// customer from the authenticated session.
export function ManageBillingButton({
  label = "Manage billing",
  variant = "outline",
}: {
  label?: string;
  variant?: "primary" | "outline";
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      if (res.status === 401) {
        window.location.href = "/sign-in?redirect_url=/account";
        return;
      }
      const data = (await res.json().catch(() => null)) as
        | { url?: string; message?: string }
        | null;

      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(data?.message ?? "The billing portal is not available right now.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const content = loading ? "Opening..." : label;

  return (
    <div>
      {variant === "primary" ? (
        <GlowingButton type="button" onClick={openPortal} disabled={loading}>
          {content}
        </GlowingButton>
      ) : (
        <button
          type="button"
          onClick={openPortal}
          disabled={loading}
          className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06] disabled:opacity-60"
        >
          {content}
        </button>
      )}
      {message ? <p className="mt-2 text-xs text-white/50">{message}</p> : null}
    </div>
  );
}

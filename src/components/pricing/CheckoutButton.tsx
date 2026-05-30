"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { BillingPeriod } from "@/lib/pricing";

type CheckoutButtonProps = {
  planKey: string;
  period: BillingPeriod;
  children: ReactNode;
  variant?: "primary" | "outline";
};

const VARIANTS: Record<NonNullable<CheckoutButtonProps["variant"]>, string> = {
  primary:
    "bg-white text-black hover:bg-white/90 disabled:bg-white/70",
  outline:
    "border border-white/15 bg-white/[0.03] text-white hover:border-white/30 hover:bg-white/[0.06] disabled:opacity-60",
};

export function CheckoutButton({
  planKey,
  period,
  children,
  variant = "outline",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey, period }),
      });

      // Not signed in: send them to sign-in, then back to pricing to continue.
      if (res.status === 401) {
        window.location.href = "/sign-in?redirect_url=/pricing";
        return;
      }

      const data = (await res.json().catch(() => null)) as
        | { url?: string; message?: string }
        | null;

      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(data?.message ?? "Checkout is not available right now.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={`w-full rounded-2xl px-5 py-3 text-sm font-medium transition-colors ${VARIANTS[variant]}`}
      >
        {loading ? "Starting checkout..." : children}
      </button>
      {message ? (
        <p className="mt-2 text-center text-xs text-white/50">{message}</p>
      ) : null}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { GlowingButton } from "@/components/ui/GlowingButton";

type Request = {
  number: number;
  title: string;
  url: string;
  state: "open" | "closed";
  createdAt: string;
};

type Status = "idle" | "success" | "error";

function statusBadge(state: Request["state"]) {
  // open = the agent is on it (or it is queued); closed = shipped or resolved.
  return state === "open"
    ? { label: "In progress", className: "bg-amber-500/10 text-amber-300 border-amber-500/30" }
    : { label: "Completed", className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ContentRequests({ clientId }: { clientId?: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const apiUrl = `/api/content-request${clientId ? `?clientId=${clientId}` : ""}`;

  const loadRequests = useCallback(async () => {
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = (await res.json()) as { requests?: Request[] };
        setRequests(data.requests ?? []);
      }
    } catch {
      // a failed list load is non-fatal; the form still works
    } finally {
      setLoadingList(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    void (async () => {
      await loadRequests();
    })();
  }, [loadRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        // GitHub's label-filtered list is briefly eventually-consistent after a
        // create, so prepend the new request optimistically instead of re-fetching.
        const data = (await res.json()) as { number: number; url: string; title: string };
        setRequests((prev) => [
          {
            number: data.number,
            title: data.title,
            url: data.url,
            state: "open",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setStatus("success");
        setMessage("");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-white">Request changes</h2>
        <p className="text-white/60">
          Need something we don&apos;t yet have a form for? Describe any change to
          your site in plain English. Our team ships it and you can track it below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Update the homepage headline to read 'Now booking 2026'. Or: swap the hero photo for the one I'll email you."
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-white/15 bg-white/[0.05] px-4 py-2.5 text-white placeholder:text-white/40 transition-colors focus:border-primary/60 focus:outline-none"
        />
        <div className="flex items-center justify-end">
          <GlowingButton type="submit" disabled={loading || !message.trim()}>
            {loading ? "Sending..." : "Request a change"}
          </GlowingButton>
        </div>

        {status === "success" && (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-sm text-blue-300">
              Request received. We are on it, watch its status below.
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">
              Something went wrong. Please try again or email info@coglyde.com.
            </p>
          </div>
        )}
      </form>

      <div className="border-t border-white/10 pt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
          Your requests
        </h3>

        {loadingList ? (
          <p className="text-sm text-white/40">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-white/40">
            No requests yet. Your first update will appear here.
          </p>
        ) : (
          <ul className="space-y-2">
            {requests.map((request) => {
              const badge = statusBadge(request.state);
              return (
                <li
                  key={request.number}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{request.title}</p>
                    <p className="text-xs text-white/40">{formatDate(request.createdAt)}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

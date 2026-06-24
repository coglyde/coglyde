"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Site = {
  id: string;
  name: string;
  email: string;
  repo: string;
  siteUrl: string | null;
  siteName: string;
  editableContent: string[];
};

/**
 * Admin-only "All sites": every client with a linked site. Opening one loads
 * the full dashboard as that client (via ?viewAs), so the team can see and edit
 * exactly what the client sees without signing in as them.
 */
export function AdminSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/clients");
        if (res.ok) {
          const data = (await res.json()) as { sites?: Site[] };
          setSites(data.sites ?? []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-white">All sites</h2>
        <p className="text-white/60">
          Every client site. Open one to view and edit its dashboard exactly as
          the client sees it.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading...</p>
      ) : sites.length === 0 ? (
        <p className="text-sm text-white/40">
          No client sites yet. A site appears here once a client has a linked repo.
        </p>
      ) : (
        <ul className="space-y-2">
          {sites.map((site) => (
            <li key={site.id}>
              <Link
                href={`/account?viewAs=${site.id}`}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-white/25 hover:bg-white/[0.06]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{site.name}</p>
                  <p className="truncate text-xs text-white/40">{site.repo}</p>
                </div>
                <span className="shrink-0 text-xs text-white/45">Open →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { ContentEditor } from "./ContentEditor";

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
 * Admin-only "All sites": every client with a linked site. Open one to edit its
 * content directly (any content type), so the team can manage or test without
 * signing in as the client.
 */
export function AdminSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Site | null>(null);

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

  if (selected) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="text-sm text-white/55 transition-colors hover:text-white"
        >
          ← All sites
        </button>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">{selected.name}</h2>
              <p className="text-sm text-white/50">
                {selected.repo}
                {selected.email ? ` · ${selected.email}` : ""}
              </p>
            </div>
            {selected.siteUrl && (
              <a
                href={selected.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
              >
                Visit site <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        <ContentEditor clientId={selected.id} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-white">All sites</h2>
        <p className="text-white/60">
          Every client site. Open one to edit its content directly, no need to
          sign in as the client.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading...</p>
      ) : sites.length === 0 ? (
        <p className="text-sm text-white/40">
          No client sites yet. A site appears here once a client has a linked
          repo.
        </p>
      ) : (
        <ul className="space-y-2">
          {sites.map((site) => (
            <li key={site.id}>
              <button
                type="button"
                onClick={() => setSelected(site)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-white/25 hover:bg-white/[0.06]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{site.name}</p>
                  <p className="truncate text-xs text-white/40">{site.repo}</p>
                </div>
                <span className="shrink-0 text-xs text-white/45">Manage →</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

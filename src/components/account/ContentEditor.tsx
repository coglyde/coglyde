"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { ContentSchema } from "@/lib/site-content";
import { ContentTypeForm } from "./ContentTypeForm";

/**
 * "Site updates": first pick a section, then edit only that one. Keeps each
 * screen focused instead of showing every form at once. `clientId` is set when
 * an admin is editing a chosen client's site.
 */
export function ContentEditor({ clientId }: { clientId?: string }) {
  const [schemas, setSchemas] = useState<ContentSchema[] | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/site-content${clientId ? `?clientId=${clientId}` : ""}`);
        setSchemas(res.ok ? ((await res.json()).types ?? []) : []);
      } catch {
        setSchemas([]);
      }
    })();
  }, [clientId]);

  const selected = schemas?.find((s) => s.key === selectedKey) ?? null;

  if (selected) {
    return (
      <ContentTypeForm
        schema={selected}
        clientId={clientId}
        onBack={() => setSelectedKey(null)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-white">Site updates</h2>
        <p className="text-white/60">
          Pick what you&apos;d like to update. Changes publish to the live site in
          about a minute.
        </p>
      </div>

      {schemas === null ? (
        <p className="text-sm text-white/40">Loading...</p>
      ) : schemas.length === 0 ? (
        <p className="text-sm text-white/40">
          No editable sections {clientId ? "for this site" : "for your account"} yet.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {schemas.map((schema) => (
            <button
              key={schema.key}
              type="button"
              onClick={() => setSelectedKey(schema.key)}
              className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition-colors hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div className="min-w-0">
                <p className="font-medium text-white">{schema.label}</p>
                {schema.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-white/50">{schema.description}</p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/30 transition-colors group-hover:text-white/70" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

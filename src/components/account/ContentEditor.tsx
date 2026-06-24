"use client";

import { useEffect, useState } from "react";
import type { ContentSchema } from "@/lib/site-content";
import { ContentTypeForm } from "./ContentTypeForm";

/**
 * "Edit content" section. Fetches the content types this site declares (its
 * own _schema.json, filtered to what the requester may edit) and renders a form
 * for each. `clientId` is set when an admin is editing a chosen client's site.
 */
export function ContentEditor({ clientId }: { clientId?: string }) {
  const [schemas, setSchemas] = useState<ContentSchema[] | null>(null);

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

  return (
    <div className="space-y-5">
      {!clientId && (
        <div>
          <h2 className="mb-2 text-2xl font-semibold text-white">Edit content</h2>
          <p className="text-white/60">
            Update these directly. Changes publish to your live site in about a
            minute, no request needed.
          </p>
        </div>
      )}

      {schemas === null ? (
        <p className="text-sm text-white/40">Loading...</p>
      ) : schemas.length === 0 ? (
        <p className="text-sm text-white/40">
          No editable sections {clientId ? "for this site" : "for your account"} yet.
        </p>
      ) : (
        <div className="space-y-5">
          {schemas.map((schema) => (
            <ContentTypeForm key={schema.key} schema={schema} clientId={clientId} />
          ))}
        </div>
      )}
    </div>
  );
}

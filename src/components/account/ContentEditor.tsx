"use client";

import { getSchema } from "@/lib/site-content";
import { ContentTypeForm } from "./ContentTypeForm";

/**
 * "Edit content" section: a direct form for each given content type. Saves
 * commit straight to the repo and publish on the next rebuild (no agent).
 * `clientId` is set when an admin is editing a chosen client's site.
 */
export function ContentEditor({ types, clientId }: { types: string[]; clientId?: string }) {
  const known = types.filter((type) => getSchema(type));

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

      {known.length === 0 ? (
        <p className="text-sm text-white/40">
          No editable sections are enabled {clientId ? "for this site" : "for your account"} yet.
        </p>
      ) : (
        <div className="space-y-5">
          {known.map((type) => (
            <ContentTypeForm key={type} type={type} clientId={clientId} />
          ))}
        </div>
      )}
    </div>
  );
}

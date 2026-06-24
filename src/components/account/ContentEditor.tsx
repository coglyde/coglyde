"use client";

import { getSchema } from "@/lib/site-content";
import { ContentTypeForm } from "./ContentTypeForm";

/**
 * "Edit content" dashboard section: a direct form for each content type the
 * client is enabled for. Saves commit straight to their repo and publish on the
 * next rebuild (no agent in the loop).
 */
export function ContentEditor({ types }: { types: string[] }) {
  const known = types.filter((type) => getSchema(type));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-white">Edit content</h2>
        <p className="text-white/60">
          Update these directly. Changes publish to your live site in about a
          minute, no request needed.
        </p>
      </div>

      {known.length === 0 ? (
        <p className="text-sm text-white/40">
          No editable sections are enabled for your account yet.
        </p>
      ) : (
        <div className="space-y-5">
          {known.map((type) => (
            <ContentTypeForm key={type} type={type} />
          ))}
        </div>
      )}
    </div>
  );
}

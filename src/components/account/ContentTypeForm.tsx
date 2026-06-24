"use client";

import { useCallback, useEffect, useState } from "react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import type { ContentField, ContentItem, ContentSchema } from "@/lib/site-content";

type Status = "idle" | "success" | "error";

const inputClass =
  "h-9 w-full rounded-md border border-white/15 bg-white/[0.05] px-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-primary/60 focus:outline-none";

/** Normalize a loaded row so every field has an editable value present. */
function normalize(schema: ContentSchema, raw: unknown): ContentItem {
  const rec = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const item: ContentItem = {};
  for (const field of schema.fields) {
    const v = rec[field.key];
    if (field.type === "stringList") item[field.key] = Array.isArray(v) ? v.map(String) : [];
    else item[field.key] = typeof v === "string" ? v : "";
  }
  return item;
}

function blank(schema: ContentSchema): ContentItem {
  const item: ContentItem = {};
  for (const field of schema.fields) item[field.key] = field.type === "stringList" ? [""] : "";
  return item;
}

/** Direct editor for one content type (schema comes from the site's own
 *  _schema.json). Loads the current list, edits rows, publishes to the repo.
 *  `clientId` is set when an admin edits a chosen client's site. */
export function ContentTypeForm({ schema, clientId }: { schema: ContentSchema; clientId?: string }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const url = `/api/site-content/${schema.key}${clientId ? `?clientId=${clientId}` : ""}`;

  const load = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as { items?: unknown[] };
        setItems((data.items ?? []).map((it) => normalize(schema, it)));
      }
    } catch {
      // a failed load leaves an empty editor; saving still works
    } finally {
      setLoading(false);
    }
  }, [url, schema]);

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);

  const setText = (i: number, key: string, value: string) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));

  const setListEntry = (i: number, key: string, j: number, value: string) =>
    setItems((prev) =>
      prev.map((it, idx) => {
        if (idx !== i) return it;
        const list = [...((it[key] as string[]) ?? [])];
        list[j] = value;
        return { ...it, [key]: list };
      }),
    );

  const addListEntry = (i: number, key: string) =>
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i ? { ...it, [key]: [...((it[key] as string[]) ?? []), ""] } : it,
      ),
    );

  const removeListEntry = (i: number, key: string, j: number) =>
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i ? { ...it, [key]: ((it[key] as string[]) ?? []).filter((_, k) => k !== j) } : it,
      ),
    );

  const addItem = () => setItems((prev) => [...prev, blank(schema)]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setError("");
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 6000);
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not save your changes.");
        setStatus("error");
      }
    } catch {
      setError("Could not save your changes.");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (item: ContentItem, i: number, field: ContentField) => {
    if (field.type === "stringList") {
      const list = (item[field.key] as string[]) ?? [];
      return (
        <div key={field.key} className="w-full">
          <span className="text-xs font-medium uppercase tracking-wide text-white/45">
            {field.label}
          </span>
          <div className="mt-1.5 space-y-2">
            {list.map((entry, j) => (
              <div key={j} className="flex items-center gap-2">
                <input
                  value={entry}
                  onChange={(e) => setListEntry(i, field.key, j, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeListEntry(i, field.key, j)}
                  className="shrink-0 rounded-md border border-white/10 px-2 py-1.5 text-xs text-white/50 transition-colors hover:border-red-500/40 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListEntry(i, field.key)}
              className="rounded-md border border-dashed border-white/15 px-2.5 py-1 text-xs text-white/55 transition-colors hover:border-white/30 hover:text-white"
            >
              + Add entry
            </button>
          </div>
        </div>
      );
    }

    const value = (item[field.key] as string) ?? "";
    return (
      <label key={field.key} className="flex min-w-[8rem] flex-1 flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-white/45">
          {field.label}
        </span>
        {field.type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => setText(i, field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={2}
            className={`${inputClass} h-auto resize-y py-2`}
          />
        ) : (
          <input
            type={field.type === "date" ? "date" : "text"}
            value={value}
            onChange={(e) => setText(i, field.key, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
        )}
      </label>
    );
  };

  const canAdd = schema.max == null || items.length < schema.max;
  const canRemove = items.length > (schema.min ?? 0);

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-lg font-semibold text-white">{schema.label}</h3>
      {schema.description && <p className="mt-1 text-sm text-white/55">{schema.description}</p>}

      {loading ? (
        <p className="mt-4 text-sm text-white/40">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-wrap items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3"
            >
              {schema.fields.map((field) => renderField(item, i, field))}
              {canRemove && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="ml-auto shrink-0 rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-white/50 transition-colors hover:border-red-500/40 hover:text-red-300"
                >
                  Remove {schema.itemNoun}
                </button>
              )}
            </div>
          ))}

          {canAdd && (
            <button
              type="button"
              onClick={addItem}
              className="rounded-md border border-dashed border-white/15 px-3 py-2 text-sm text-white/55 transition-colors hover:border-white/30 hover:text-white"
            >
              + Add {schema.itemNoun}
            </button>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
            {status === "success" && (
              <span className="text-sm text-emerald-300">
                Published. The site updates in about a minute.
              </span>
            )}
            {status === "error" && <span className="text-sm text-red-300">{error}</span>}
            <GlowingButton type="submit" disabled={saving || loading}>
              {saving ? "Publishing..." : "Publish changes"}
            </GlowingButton>
          </div>
        </div>
      )}
    </form>
  );
}

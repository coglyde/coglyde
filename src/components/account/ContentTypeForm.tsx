"use client";

import { useCallback, useEffect, useState } from "react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { getSchema, type ContentItem } from "@/lib/site-content";

type Status = "idle" | "success" | "error";

/** Direct editor for one content type: load the current list from the client's
 *  repo, edit rows in place (add / remove), publish straight to the live site. */
export function ContentTypeForm({ type }: { type: string }) {
  const schema = getSchema(type);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/site-content/${type}`);
      if (res.ok) {
        const data = (await res.json()) as { items?: ContentItem[] };
        setItems(data.items ?? []);
      }
    } catch {
      // a failed load leaves an empty editor; saving still works
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);

  if (!schema) return null;

  const setField = (index: number, key: string, value: string) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  const addItem = () =>
    setItems((prev) => [...prev, Object.fromEntries(schema.fields.map((f) => [f.key, ""]))]);
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setError("");
    try {
      const res = await fetch(`/api/site-content/${type}`, {
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

  const canAdd = schema.max == null || items.length < schema.max;
  const canRemove = items.length > (schema.min ?? 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
    >
      <h3 className="text-lg font-semibold text-white">{schema.label}</h3>
      <p className="mt-1 text-sm text-white/55">{schema.description}</p>

      {loading ? (
        <p className="mt-4 text-sm text-white/40">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-end gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3"
            >
              {schema.fields.map((field) => (
                <label key={field.key} className="flex min-w-[8rem] flex-1 flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-white/45">
                    {field.label}
                  </span>
                  <input
                    value={item[field.key] ?? ""}
                    onChange={(e) => setField(index, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="h-9 w-full rounded-md border border-white/15 bg-white/[0.05] px-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-primary/60 focus:outline-none"
                  />
                </label>
              ))}
              {canRemove && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-white/50 transition-colors hover:border-red-500/40 hover:text-red-300"
                >
                  Remove
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
                Published. Your site updates in about a minute.
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

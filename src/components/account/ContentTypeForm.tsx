"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, Plus, Trash2 } from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import type { ContentField, ContentItem, ContentSchema } from "@/lib/site-content";

type Status = "idle" | "success" | "error";

const inputClass =
  "h-10 w-full rounded-lg border border-white/15 bg-white/[0.05] px-3.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-primary/60 focus:outline-none";

// Lists of this length or shorter open fully; longer ones collapse by default.
const EXPAND_ALL_UP_TO = 4;

// Pick a human label for an item card from its most "headline" field.
const HEADLINE_KEYS = ["title", "name", "event", "label", "year"];

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

/** Focused editor for ONE content type. Add is at the top, existing entries are
 *  collapsible (header only) to stay scannable, and there's a single save. */
export function ContentTypeForm({
  schema,
  clientId,
  onBack,
}: {
  schema: ContentSchema;
  clientId?: string;
  onBack?: () => void;
}) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [open, setOpen] = useState<boolean[]>([]); // parallel to items
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
        const loaded = (data.items ?? []).map((it) => normalize(schema, it));
        setItems(loaded);
        setOpen(loaded.map(() => loaded.length <= EXPAND_ALL_UP_TO));
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

  // New entries go to the top, opened, so they appear right under the Add button.
  const addItem = () => {
    setItems((prev) => [blank(schema), ...prev]);
    setOpen((prev) => [true, ...prev]);
  };
  const removeItem = (i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    setOpen((prev) => prev.filter((_, idx) => idx !== i));
  };
  const toggle = (i: number) => setOpen((prev) => prev.map((o, idx) => (idx === i ? !o : o)));

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

  const headlineField =
    schema.fields.find((f) => HEADLINE_KEYS.includes(f.key)) ??
    schema.fields.find((f) => f.type !== "stringList");

  const itemHeader = (item: ContentItem) => {
    const raw = headlineField ? item[headlineField.key] : "";
    const v = typeof raw === "string" ? raw.trim() : "";
    return v || `New ${schema.itemNoun}`;
  };

  const renderField = (item: ContentItem, i: number, field: ContentField) => {
    const label = (
      <span className="text-xs font-medium uppercase tracking-wide text-white/45">{field.label}</span>
    );

    if (field.type === "stringList") {
      const list = (item[field.key] as string[]) ?? [];
      return (
        <div key={field.key} className="flex flex-col gap-1.5 sm:col-span-2">
          {label}
          <div className="space-y-2">
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
                  aria-label="Remove entry"
                  onClick={() => removeListEntry(i, field.key, j)}
                  className="shrink-0 rounded-lg border border-white/10 p-2 text-white/45 transition-colors hover:border-red-500/40 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListEntry(i, field.key)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-1.5 text-xs text-white/55 transition-colors hover:border-white/30 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add entry
            </button>
          </div>
        </div>
      );
    }

    const value = (item[field.key] as string) ?? "";
    return (
      <label
        key={field.key}
        className={`flex flex-col gap-1.5 ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
      >
        {label}
        {field.type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => setText(i, field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`${inputClass} h-auto resize-y py-2.5`}
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All sections
          </button>
        )}
        <h2 className="text-2xl font-semibold text-white">{schema.label}</h2>
        {schema.description && <p className="mt-1 text-white/55">{schema.description}</p>}
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading...</p>
      ) : (
        <>
          {canAdd && (
            <button
              type="button"
              onClick={addItem}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:border-primary/60 hover:text-white"
            >
              <Plus className="h-4 w-4" /> Add {schema.itemNoun}
            </button>
          )}

          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center justify-between gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                  >
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${open[i] ? "" : "-rotate-90"}`}
                    />
                    <span className="truncate text-sm font-semibold text-white/80">
                      {itemHeader(item)}
                    </span>
                  </button>
                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/50 transition-colors hover:border-red-500/40 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  )}
                </div>

                {open[i] && (
                  <div className="border-t border-white/10 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {schema.fields.map((field) => renderField(item, i, field))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {items.length === 0 && (
              <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/40">
                Nothing here yet. Use &ldquo;Add {schema.itemNoun}&rdquo; above.
              </p>
            )}
          </div>

          {/* Single save bar, pinned while editing. */}
          <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-xl border border-white/10 bg-[#0c0c10]/90 p-3 backdrop-blur">
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
        </>
      )}
    </form>
  );
}

// The reusable content engine: field types, validation, and a parser for a
// per-site schema. The *engine* is shared across all clients; the actual content
// types are NOT - each client repo declares its own in content/_schema.json
// (e.g. a music site has "events"/"gallery"; a racing site has "stats"/"news").
//
// Isomorphic (pure data + parsing/validation, no server-only imports), so the
// client form imports the same types/validation the API uses.

export type FieldType = "text" | "textarea" | "url" | "date" | "stringList";

export type ContentField = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  /** Regex (source string) a text/url value must match. */
  pattern?: string;
  /** Value may be empty: text/url is omitted from output, date is omitted. */
  optional?: boolean;
  /** date only: empty is allowed and written as null (e.g. a "TBC" round). */
  nullable?: boolean;
};

export type ContentSchema = {
  /** url-safe id, e.g. "stats" */
  key: string;
  /** human label, e.g. "Career stats" */
  label: string;
  description: string;
  /** file in the client repo, e.g. "content/stats.json" */
  path: string;
  /** singular noun for one row, e.g. "stat" */
  itemNoun: string;
  fields: ContentField[];
  min?: number;
  max?: number;
  /** When the file wraps the list under a key (e.g. calendar.json is
   *  { season, races }), the editable list lives at this key and the other
   *  top-level keys are preserved on save. Omit for bare-array files. */
  listKey?: string;
};

/** Where each client repo declares its editable content types. */
export const SCHEMA_FILE = "content/_schema.json";

export type FieldValue = string | string[] | null;
export type ContentItem = Record<string, FieldValue>;

// --- Parsing a repo's _schema.json (defensive: bad entries are skipped) -----

const VALID_FIELD_TYPES = new Set<FieldType>(["text", "textarea", "url", "date", "stringList"]);

function parseField(raw: unknown): ContentField | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.key !== "string" || typeof r.label !== "string") return null;
  if (typeof r.type !== "string" || !VALID_FIELD_TYPES.has(r.type as FieldType)) return null;
  const field: ContentField = { key: r.key, label: r.label, type: r.type as FieldType };
  if (typeof r.placeholder === "string") field.placeholder = r.placeholder;
  if (typeof r.pattern === "string") field.pattern = r.pattern;
  if (r.optional === true) field.optional = true;
  if (r.nullable === true) field.nullable = true;
  return field;
}

function parseSchema(raw: unknown): ContentSchema | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.key !== "string" || typeof r.label !== "string" || typeof r.path !== "string") {
    return null;
  }
  if (!Array.isArray(r.fields)) return null;
  const fields = r.fields.map(parseField).filter((f): f is ContentField => f !== null);
  if (fields.length === 0) return null;

  const schema: ContentSchema = {
    key: r.key,
    label: r.label,
    path: r.path,
    description: typeof r.description === "string" ? r.description : "",
    itemNoun: typeof r.itemNoun === "string" ? r.itemNoun : "item",
    fields,
  };
  if (typeof r.min === "number") schema.min = r.min;
  if (typeof r.max === "number") schema.max = r.max;
  if (typeof r.listKey === "string") schema.listKey = r.listKey;
  return schema;
}

/** Parse a repo's _schema.json. Accepts `{ types: [...] }` or a bare `[...]`. */
export function parseSchemas(json: unknown): ContentSchema[] {
  let arr: unknown[] = [];
  if (Array.isArray(json)) arr = json;
  else if (json && typeof json === "object" && Array.isArray((json as { types?: unknown }).types)) {
    arr = (json as { types: unknown[] }).types;
  }
  return arr.map(parseSchema).filter((s): s is ContentSchema => s !== null);
}

// --- Validating submitted content against a schema --------------------------

type FieldOutcome = { value: FieldValue | undefined } | { error: string };

function validateField(field: ContentField, raw: unknown): FieldOutcome {
  if (field.type === "stringList") {
    const arr = Array.isArray(raw) ? raw : [];
    const clean = arr
      .filter((s): s is string => typeof s === "string")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    if (clean.length === 0 && !field.optional) {
      return { error: `${field.label} needs at least one entry.` };
    }
    return { value: clean };
  }

  const isEmpty = raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "");

  if (field.type === "date") {
    if (isEmpty) {
      if (field.nullable) return { value: null };
      if (field.optional) return { value: undefined };
      return { error: `${field.label} is required.` };
    }
    const s = String(raw).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return { error: `${field.label} must be a valid date.` };
    return { value: s };
  }

  // text | textarea | url
  if (isEmpty) {
    if (field.optional) return { value: undefined };
    return { error: `${field.label} is required.` };
  }
  const s = String(raw).trim();
  if (field.pattern && !new RegExp(field.pattern).test(s)) {
    return { error: `${field.label} should look like "${field.placeholder ?? ""}".` };
  }
  return { value: s };
}

export type ValidationResult = { items: ContentItem[] } | { error: string };

/** Validate + normalize a posted list against a schema. Guarantees the written
 *  JSON matches the shape the client site expects, so a save can't break a build. */
export function validateContent(schema: ContentSchema, raw: unknown): ValidationResult {
  if (!Array.isArray(raw)) return { error: "Expected a list of items." };
  if (schema.min != null && raw.length < schema.min) {
    return { error: `Add at least ${schema.min} ${schema.itemNoun}.` };
  }
  if (schema.max != null && raw.length > schema.max) {
    return { error: `Keep it to ${schema.max} ${schema.itemNoun}s or fewer.` };
  }

  const items: ContentItem[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) {
      return { error: "Each item must be an object." };
    }
    const rec = entry as Record<string, unknown>;
    const item: ContentItem = {};
    for (const field of schema.fields) {
      const outcome = validateField(field, rec[field.key]);
      if ("error" in outcome) return { error: outcome.error };
      if (outcome.value !== undefined) item[field.key] = outcome.value;
    }
    items.push(item);
  }
  return { items };
}

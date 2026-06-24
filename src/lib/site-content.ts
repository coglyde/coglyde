// Declarative content schemas shared by the dashboard (renders the form) and
// the API (validates + commits). Each entry maps a content "type" to the file
// in the client's repo and the fields a client may edit. Adding a type, a
// field, or later a media field type is additive here, never a migration.
//
// This module is isomorphic (pure data + validation, no server-only imports),
// so the client form imports the same schema the API validates against.

export type FieldType = "text";

export type ContentField = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  /** Optional regex (source string) the value must match. Keeps the repo JSON
   *  well-formed so a save can never break the client's build. */
  pattern?: string;
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
};

export const SITE_CONTENT_SCHEMAS: Record<string, ContentSchema> = {
  stats: {
    key: "stats",
    label: "Career stats",
    description:
      "The headline numbers shown across the site (the home stats band and the sponsorships pitch both read these).",
    path: "content/stats.json",
    itemNoun: "stat",
    min: 1,
    max: 8,
    fields: [
      { key: "value", label: "Value", type: "text", placeholder: "50", pattern: "^\\d+\\+?$" },
      { key: "label", label: "Label", type: "text", placeholder: "Races" },
    ],
  },
};

export type ContentItem = Record<string, string>;

export function getSchema(type: string): ContentSchema | null {
  return SITE_CONTENT_SCHEMAS[type] ?? null;
}

export type ValidationResult = { items: ContentItem[] } | { error: string };

/** Validate + normalize a posted list against a schema. */
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
    const clean: ContentItem = {};
    for (const field of schema.fields) {
      const value = rec[field.key];
      if (typeof value !== "string" || value.trim() === "") {
        return { error: `${field.label} is required for every ${schema.itemNoun}.` };
      }
      const trimmed = value.trim();
      if (field.pattern && !new RegExp(field.pattern).test(trimmed)) {
        return {
          error: `${field.label} for each ${schema.itemNoun} should look like "${field.placeholder ?? ""}".`,
        };
      }
      clean[field.key] = trimmed;
    }
    items.push(clean);
  }
  return { items };
}

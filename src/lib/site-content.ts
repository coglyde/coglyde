// Declarative content schemas shared by the dashboard (renders the form) and
// the API (validates + commits). Each entry maps a content "type" to the file
// in the client's repo and the fields a client may edit. Adding a type, a
// field, or a new field type is additive here, never a migration.
//
// Isomorphic (pure data + validation, no server-only imports), so the client
// form imports the same schema the API validates against.

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

export const SITE_CONTENT_SCHEMAS: Record<string, ContentSchema> = {
  stats: {
    key: "stats",
    label: "Career stats",
    description:
      "The headline numbers across the site (the home stats band and the sponsorships pitch both read these).",
    path: "content/stats.json",
    itemNoun: "stat",
    min: 1,
    max: 8,
    fields: [
      { key: "value", label: "Value", type: "text", placeholder: "50", pattern: "^\\d+\\+?$" },
      { key: "label", label: "Label", type: "text", placeholder: "Races" },
    ],
  },

  news: {
    key: "news",
    label: "News cards",
    description: "The cards in the home-page News carousel.",
    path: "content/home-news.json",
    itemNoun: "card",
    min: 0,
    max: 6,
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "Fast Forward: Episode 3" },
      { key: "blurb", label: "Blurb", type: "textarea", placeholder: "One-line summary" },
      { key: "image", label: "Image URL", type: "url", placeholder: "/news/photo.png" },
      { key: "href", label: "Link", type: "url", placeholder: "https://..." },
      { key: "cta", label: "Button text", type: "text", placeholder: "Read More" },
    ],
  },

  press: {
    key: "press",
    label: "Press coverage",
    description: "The press/media links on the Highlights page.",
    path: "content/news.json",
    itemNoun: "link",
    min: 0,
    max: 12,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "outlet", label: "Outlet", type: "text", placeholder: "Aldergrove Star" },
      { key: "date", label: "Date", type: "text", optional: true, placeholder: "Nov 2024" },
      { key: "url", label: "Link", type: "url", optional: true, placeholder: "https://..." },
    ],
  },

  timeline: {
    key: "timeline",
    label: "Season by season",
    description: "The year-by-year record on the home Profile section (newest first).",
    path: "content/timeline.json",
    itemNoun: "season",
    min: 1,
    max: 30,
    fields: [
      { key: "year", label: "Year", type: "text", placeholder: "2024", pattern: "^\\d{4}$" },
      { key: "items", label: "Highlights", type: "stringList" },
    ],
  },

  calendar: {
    key: "calendar",
    label: "Race calendar",
    description: "The rounds on the Race Calendar page. Leave the start date empty for a TBC round.",
    path: "content/calendar.json",
    listKey: "races",
    itemNoun: "round",
    min: 0,
    max: 40,
    fields: [
      { key: "date", label: "Start date", type: "date", nullable: true },
      { key: "endDate", label: "End date", type: "date", optional: true },
      { key: "event", label: "Event", type: "text", placeholder: "Round 3" },
      { key: "series", label: "Series", type: "text", placeholder: "West Coast Kart Club" },
      { key: "venue", label: "Venue", type: "text", placeholder: "Greg Moore Raceway" },
      { key: "location", label: "Location", type: "text", placeholder: "Chilliwack, BC" },
      { key: "result", label: "Result", type: "text", optional: true, placeholder: "1st" },
    ],
  },
};

export type FieldValue = string | string[] | null;
export type ContentItem = Record<string, FieldValue>;

export function getSchema(type: string): ContentSchema | null {
  return SITE_CONTENT_SCHEMAS[type] ?? null;
}

export function allContentTypes(): string[] {
  return Object.keys(SITE_CONTENT_SCHEMAS);
}

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

// One-time importer: converts a Webflow CMS blog CSV export into markdown files
// under content/blog/. The Slug column becomes the filename (preserving URLs);
// the Post Body HTML is converted to markdown. Run:
//   node scripts/import-blog.mjs "/path/to/export.csv"
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import TurndownService from "turndown";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/import-blog.mjs <csv-path>");
  process.exit(1);
}

const OUT = path.join(process.cwd(), "content", "blog");
fs.mkdirSync(OUT, { recursive: true });

const rows = parse(fs.readFileSync(csvPath, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
});

const td = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "_",
});

const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').trim();

for (const row of rows) {
  const slug = (row.Slug || "").trim();
  if (!slug) continue;

  const title = row.Name || slug;
  const description = row["Post Summary"] || "";
  const date = row["Published On"] || row["Created On"] || "";
  const tag = row.Tag || "";
  const image = row["Main Image"] || "";
  const bodyMd = td.turndown(row["Post Body"] || "").trim();

  const fm = [
    "---",
    `title: "${esc(title)}"`,
    `description: "${esc(description)}"`,
    `date: "${esc(date)}"`,
    tag ? `tag: "${esc(tag)}"` : null,
    image ? `image: "${esc(image)}"` : null,
    "draft: false",
    "---",
    "",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

  fs.writeFileSync(path.join(OUT, `${slug}.md`), fm + bodyMd + "\n");
  console.log(`wrote ${slug}.md (${bodyMd.length} chars)`);
}

// Cleans Webflow->markdown conversion artifacts in content/blog/*.md:
// bold-wrapped headings split onto a second line, zero-width characters,
// escaped "1\." list numbers, and runs of blank lines.
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "blog");

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const full = path.join(dir, file);
  const src = fs.readFileSync(full, "utf8");

  const fmMatch = src.match(/^---\n[\s\S]*?\n---\n/);
  const fm = fmMatch ? fmMatch[0].replace(/\n+$/, "\n") : "";
  let body = fmMatch ? src.slice(fmMatch[0].length) : src;

  // Strip zero-width / BOM characters Webflow scatters around.
  body = body.replace(/[​‌‍﻿]/g, "");
  // Unescape "1\." -> "1."
  body = body.replace(/(\d)\\\./g, "$1.");

  const lines = body.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\s+$/, "");

    // "### Title" with inline bold -> "### Title"
    const inlineBold = line.match(/^(#{1,6})\s+\*\*(.+?)\*\*\s*$/);
    if (inlineBold) {
      out.push(`${inlineBold[1]} ${inlineBold[2].trim()}`);
      continue;
    }

    // An "empty" heading marker line (e.g. "### **" or "###   ") whose text
    // lives on the next non-empty line.
    const emptyHeading = line.match(/^(#{1,6})\s*\*{0,2}\s*$/);
    if (emptyHeading) {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length) {
        const title = lines[j]
          .trim()
          .replace(/^\*\*/, "")
          .replace(/\*\*$/, "")
          .replace(/\*\*/g, "")
          .trim();
        out.push(`${emptyHeading[1]} ${title}`);
        i = j;
        continue;
      }
    }

    out.push(line);
  }

  body = out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  fs.writeFileSync(full, `${fm}\n${body}\n`);
  console.log(`cleaned ${file}`);
}

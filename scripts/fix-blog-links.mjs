// Repoints links inside migrated posts: old service URLs -> new /services/*
// paths, and cross-links to migrated posts -> relative /blog/* URLs. Links to
// posts that haven't been migrated are left absolute (they still resolve on the
// live site).
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "blog");
const slugs = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""));

const replacements = [
  [/https?:\/\/www\.coglyde\.com\/website-design-services/g, "/services/website-design"],
  [/https?:\/\/www\.coglyde\.com\/seo-services/g, "/services/seo"],
];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const p = path.join(dir, file);
  let s = fs.readFileSync(p, "utf8");
  for (const [re, to] of replacements) s = s.replace(re, to);
  for (const slug of slugs) {
    s = s.replaceAll(`https://www.coglyde.com/blog/${slug}/`, `/blog/${slug}`);
    s = s.replaceAll(`https://www.coglyde.com/blog/${slug}`, `/blog/${slug}`);
  }
  fs.writeFileSync(p, s);
  console.log(`relinked ${file}`);
}

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Markdown-powered blog. Posts live as `.md` files in /content/blog with
// frontmatter; the filename (minus .md) is the URL slug, so slugs are
// preserved exactly for SEO. Set `draft: true` to keep a post out of the index
// and out of static generation until its content is migrated in.

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string | null;
  image: string | null;
  draft: boolean;
  content: string;
};

function readPost(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: data.date ? String(data.date) : null,
    image: typeof data.image === "string" ? data.image : null,
    draft: data.draft === true,
    content,
  };
}

// All slug strings present on disk, drafts included.
export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

export function getPost(slug: string): Post | null {
  return readPost(slug);
}

// Published (non-draft) posts, newest first. Posts without a date sort last.
export function getPublishedPosts(): Post[] {
  return getAllSlugs()
    .map(readPost)
    .filter((post): post is Post => post !== null && !post.draft)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";
import { getPost, getPublishedPosts } from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.draft) return {};
  return {
    title: `${post.title} | Coglyde`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: post.image ? [post.image] : undefined,
    },
  };
}

function formatDate(date: string | null): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.draft) notFound();

  const html = await marked.parse(post.content);
  const date = formatDate(post.date);

  return (
    <>
      <PageAmbientBackground />
      <Header />
      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span>
          All posts
        </Link>

        <article className="mt-8">
          {date ? (
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/40">
              {date}
            </p>
          ) : null}
          <h1 className="mt-3 text-balance text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>

          {post.image ? (
            <div className="mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div
            className="prose prose-invert mt-10 max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-a:text-violet-300 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}

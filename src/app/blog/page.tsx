import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";
import { getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Coglyde",
  description:
    "Practical guides and insights on web design, SEO, GEO and digital marketing from the Coglyde team.",
};

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

export default function BlogIndexPage() {
  const posts = getPublishedPosts();

  return (
    <>
      <PageAmbientBackground />
      <Header />
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-24 sm:px-10 sm:pt-40">
        <header className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            Blog
          </p>
          <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Insights on web, SEO and GEO
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/55">
            Practical guides and ideas on web design, search, and the new era of
            AI-powered discovery.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
            <p className="text-sm text-white/55">
              Posts are being migrated. Check back soon.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const date = formatDate(post.date);
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-colors hover:border-white/20"
                >
                  {post.image ? (
                    <div className="aspect-[16/10] w-full overflow-hidden bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-7 sm:p-8">
                    {date ? (
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/40">
                        {date}
                      </p>
                    ) : null}
                    <h2 className="mt-3 text-balance text-xl font-medium leading-snug tracking-tight text-white">
                      {post.title}
                    </h2>
                    {post.description ? (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
                        {post.description}
                      </p>
                    ) : null}
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300">
                      Read
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

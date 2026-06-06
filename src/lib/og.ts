import type { Metadata } from "next";

type OgInput = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  type?: "website" | "article";
};

// Builds the openGraph + twitter metadata for a page, pointing at the branded
// /api/og card with the page's own title/subtitle/eyebrow. Spread the result
// into a page's `metadata` (or generateMetadata return) so every shared link
// renders a card with its own character.
export function ogMetadata({
  title,
  subtitle,
  eyebrow,
  type = "website",
}: OgInput): Pick<Metadata, "openGraph" | "twitter"> {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set("subtitle", subtitle);
  if (eyebrow) params.set("eyebrow", eyebrow);
  const image = `/api/og?${params.toString()}`;

  return {
    openGraph: {
      title,
      description: subtitle,
      siteName: "Coglyde",
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: subtitle,
      images: [image],
    },
  };
}

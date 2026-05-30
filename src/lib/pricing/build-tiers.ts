import type { BuildTier } from "./types";

// One-time, quoted-to-scope website builds. These are not Stripe
// subscriptions; the card sends people to a strategy call to scope the work.
export const buildTiers: BuildTier[] = [
  {
    name: "Starter",
    startingAt: 4500,
    blurb: "A focused launch or rebrand for founders and local businesses.",
    features: [
      "Up to 5 custom-coded pages",
      "Mobile-first responsive design",
      "Core on-page SEO, metadata and sitemap",
      "Contact form and lead capture",
      "Analytics setup",
      "Migration of your existing site, if you have one",
      "One round of revisions",
    ],
  },
  {
    name: "Growth",
    startingAt: 10000,
    blurb: "A content engine, light commerce or CMS for established brands.",
    popular: true,
    features: [
      "6 to 10 custom pages and a design system",
      "Headless CMS so you edit content yourself",
      "Blog and structured-data SEO",
      "Light e-commerce (Stripe) or booking",
      "Custom animations and interactions",
      "Performance tuned for Core Web Vitals",
      "Migration of your existing site, if you have one",
      "Two rounds of revisions",
    ],
  },
  {
    name: "Bespoke",
    startingAt: 22000,
    blurb: "A flagship, one-of-a-kind site for premium brands.",
    features: [
      "Unlimited, fully custom pages",
      "Custom WebGL, 3D or motion hero",
      "Full e-commerce and media pipeline",
      "Custom admin CMS and integrations",
      "Advanced, AI and GEO-ready SEO",
      "Multi-stage design and QA",
      "Migration of your existing site, if you have one",
      "Dedicated project lead",
    ],
  },
];

import type { BuildTier } from "./types";

// One-time, quoted-to-scope website builds. These are not Stripe
// subscriptions; the card sends people to a strategy call to scope the work.
export const buildTiers: BuildTier[] = [
  {
    name: "Starter",
    startingAt: 2500,
    blurb: "A fast, focused launch for founders and local businesses that need to look credible and convert.",
    features: [
      "Up to 5 custom-coded pages",
      "Mobile-first, responsive design",
      "On-page SEO, metadata and sitemap",
      "Contact form and lead capture",
      "Analytics setup",
      "Migration from your existing site",
      "One round of revisions",
    ],
  },
  {
    name: "Growth",
    startingAt: 5000,
    blurb: "A CMS-driven content engine with light commerce for established brands ready to scale.",
    popular: true,
    features: [
      "6 to 12 custom pages with a design system",
      "Headless CMS so you edit content yourself",
      "Blog and structured-data SEO",
      "Light e-commerce (Stripe) or booking",
      "Custom animations and interactions",
      "Tuned for Core Web Vitals",
      "Migration from your existing site",
      "Two rounds of revisions",
    ],
  },
  {
    name: "Bespoke",
    startingAt: 10000,
    blurb: "A flagship, one-of-a-kind build with custom WebGL, 3D and motion for premium brands.",
    features: [
      "20+ fully custom pages",
      "Custom WebGL, 3D and motion",
      "Full e-commerce and media pipeline",
      "Custom CMS and integrations",
      "Advanced, AI and GEO-ready SEO",
      "Multi-stage design and QA",
      "Migration from your existing site",
      "Dedicated project lead",
    ],
  },
];

import type { SubscriptionPlan } from "./types";

// Hands-on SEO and AEO retainers for the SEO tab.
export const seoPlans: SubscriptionPlan[] = [
  {
    key: "seo-foundation",
    name: "Foundation",
    blurb: "Hands-on SEO to establish your search and AI presence.",
    monthly: 499,
    features: [
      "4 SEO articles per month, written by our team",
      "Monthly keyword research",
      "On-page optimization, up to 5 pages",
      "Technical SEO fixes and monitoring",
      "AEO foundation: entity, schema and llms.txt",
      "AI Overviews and ChatGPT visibility",
      "Monthly reporting dashboard",
    ],
  },
  {
    key: "seo-growth",
    name: "Growth",
    blurb: "A full retainer for brands competing on real keywords.",
    monthly: 999,
    popular: true,
    features: [
      "8 SEO articles per month, written by our team",
      "Full competitor analysis, monthly",
      "Keyword research across 50 tracked terms",
      "On-page optimization, up to 15 pages",
      "Ongoing technical SEO",
      "AEO across Perplexity and Gemini with citation tracking",
      "Light backlink outreach",
      "Monthly report and quarterly strategy call",
    ],
  },
  {
    key: "seo-authority",
    name: "Authority",
    blurb: "Lead your category across Google and AI answers.",
    monthly: 1999,
    features: [
      "12 long-form articles per month",
      "Deep competitor and market analysis",
      "150 tracked keywords",
      "Unlimited priority pages",
      "Advanced technical SEO and Core Web Vitals",
      "Full multi-engine AEO and entity build-out",
      "Active digital PR and link building",
      "Bi-weekly reporting and monthly strategy call",
    ],
  },
];

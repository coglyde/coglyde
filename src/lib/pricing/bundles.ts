import type { SubscriptionPlan } from "./types";

// All-in-one bundles: hosting + maintenance, SEO and automations rolled into
// one plan, priced below the sum of the parts. These are the "just handle
// everything" option for clients who don't want to assemble their own stack.
export const bundles: SubscriptionPlan[] = [
  {
    key: "bundle-launch",
    name: "Launch",
    blurb: "Hosting, upkeep and foundational SEO in one tidy plan.",
    monthly: 649,
    features: [
      "Hosting + Maintenance included",
      "Foundation SEO: 4 articles/mo, on-page and technical",
      "AI search (AEO) foundation",
      "Missed Call Text-Back automation",
      "Monthly reporting dashboard",
    ],
  },
  {
    key: "bundle-grow",
    name: "Grow",
    blurb: "A full growth engine: upkeep, real SEO and automations together.",
    monthly: 1490,
    popular: true,
    features: [
      "Everything in Launch",
      "Growth SEO: 8 articles/mo across 50 keywords",
      "Monthly competitor analysis and link outreach",
      "Two automations of your choice",
      "Quarterly strategy call",
    ],
  },
  {
    key: "bundle-dominate",
    name: "Dominate",
    blurb: "Lead your category across Google and AI answers, fully managed.",
    monthly: 2490,
    features: [
      "Everything in Grow",
      "Authority SEO: 12 articles/mo across 150 keywords",
      "Full multi-engine AEO and digital PR",
      "Unlimited automations from our menu",
      "Dedicated account lead, bi-weekly reporting",
    ],
  },
];

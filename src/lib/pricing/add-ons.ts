import type { AddOn } from "./types";

// The automation menu. The full list is shown everywhere add-ons appear (every
// pricing category and the website-design page), so there is no per-tab
// filtering. Add-ons are billed monthly only.
export const addOns: AddOn[] = [
  {
    key: "addon-missed-call",
    name: "Missed Call Text-Back",
    price: 149,
    blurb:
      "Every missed call gets an instant, on-brand text so you never lose a lead.",
    note: "Includes ~500 texts per month, overage billed at cost.",
  },
  {
    key: "addon-ai-admin",
    name: "Virtual AI Admin",
    price: 497,
    blurb:
      "An AI receptionist that answers, books, and handles intake over call and chat.",
    note: "Core tier. Lite ($250) and high-volume ($600) options available.",
  },
  {
    key: "addon-blog",
    name: "Blog Automation",
    price: 497,
    blurb:
      "4 to 8 SEO blog posts drafted and published to your site each month.",
  },
  {
    key: "addon-keyword-research",
    name: "Keyword Research Automation",
    price: 199,
    blurb:
      "Ongoing keyword discovery and rank tracking, delivered to a live dashboard.",
  },
  {
    key: "addon-seo-audit",
    name: "SEO Audit Automation",
    price: 149,
    blurb:
      "Scheduled site audits that flag technical and on-page issues automatically.",
  },
  {
    key: "addon-backlink-audit",
    name: "Backlink Audit Automation",
    price: 99,
    blurb:
      "Automated backlink monitoring so you catch toxic links and new mentions early.",
  },
  {
    key: "addon-carousel",
    name: "Carousel Generation",
    price: 149,
    blurb:
      "Scroll-stopping carousels and slideshows for TikTok and Instagram, designed and delivered.",
    note: "Starts at 4 per month; scales with volume.",
  },
];

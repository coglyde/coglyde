import type { AddOn } from "./types";

// The automation menu. The full list is shown everywhere add-ons appear (every
// pricing category, the website-design page, and the automations service page),
// so there is no per-tab filtering. Add-ons are billed monthly only.
export const addOns: AddOn[] = [
  // --- Lead capture & front desk ---
  {
    key: "addon-missed-call",
    name: "Missed Call Text-Back",
    price: 149,
    blurb:
      "Every missed call gets an instant, on-brand text so you never lose a lead.",
    note: "Includes ~500 texts per month, overage billed at cost.",
  },
  {
    key: "addon-ai-chatbot",
    name: "AI Chatbot",
    price: 249,
    blurb:
      "A chat widget trained on your business that answers questions, qualifies visitors, and books appointments around the clock.",
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
    key: "addon-appointment-reminders",
    name: "Appointment Reminders",
    price: 99,
    blurb:
      "Automated confirmations and reminders over text and email that cut no-shows and fill your calendar.",
  },
  {
    key: "addon-lead-gen",
    name: "Lead Generation Automation",
    price: 399,
    blurb:
      "Sources qualified prospects and runs personalized outreach on autopilot to keep your pipeline full.",
    note: "Targeting and volume scoped to your market on a quick setup call.",
  },
  {
    key: "addon-nurture",
    name: "Email & SMS Nurture",
    price: 199,
    blurb:
      "Automated drip sequences that warm every new lead and bring past customers back, hands-free.",
  },
  {
    key: "addon-reputation",
    name: "Reputation & Reviews",
    price: 149,
    blurb:
      "Automatically requests reviews after every job, flags unhappy customers early, and drafts replies for you.",
  },
  // --- Content & social ---
  {
    key: "addon-blog",
    name: "Blog Automation",
    price: 249,
    blurb:
      "4 to 8 SEO blog posts drafted and published to your site each month.",
  },
  {
    key: "addon-carousel",
    name: "Carousel Generation",
    price: 149,
    blurb:
      "Scroll-stopping carousels and slideshows for TikTok and Instagram, designed and delivered.",
    note: "Starts at 4 per month; scales with volume.",
  },
  // --- SEO, research & reporting ---
  {
    key: "addon-keyword-research",
    name: "Keyword Research Automation",
    price: 199,
    blurb:
      "Ongoing keyword discovery and rank tracking, delivered to a live dashboard.",
  },
  {
    key: "addon-research",
    name: "Research Automation",
    price: 199,
    blurb:
      "Scheduled market, competitor, and topic research, compiled and delivered to you automatically.",
  },
  {
    key: "addon-reporting",
    name: "Ads & Analytics Reporting",
    price: 149,
    blurb:
      "Always-current dashboards and reports across your ads, analytics, and conversions.",
  },
];

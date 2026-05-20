import { ServiceDetailCard } from "./ServiceDetailCard";

const details = [
  {
    title: "SEO",
    description:
      "Rank higher on search engines, drive organic traffic, and make sure your audience finds you first.",
  },
  {
    title: "Paid Marketing",
    description:
      "Target the right audiences across Facebook, Google, Instagram, TikTok, and YouTube, then turn clicks into customers.",
  },
  {
    title: "AI Adoption",
    description:
      "Bring AI into your operations to simplify complexity and lift efficiency, with hands-on guidance for your team.",
  },
  {
    title: "Automations",
    description:
      "Free your team from repetitive work so they can focus on the things that actually move the needle.",
  },
  {
    title: "Development",
    description:
      "Ship production-grade features tailored to your industry. Fast, reliable, and architected to scale.",
  },
  {
    title: "Design",
    description:
      "Custom graphics, illustrations, animations, and 3D that make your brand stand out and convert.",
  },
];

export function ServiceDetailList() {
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
      {details.map((detail, i) => (
        <ServiceDetailCard
          key={detail.title}
          title={detail.title}
          description={detail.description}
          index={i + 1}
        />
      ))}
    </div>
  );
}

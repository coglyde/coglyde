import { ServiceDetailCard } from "./ServiceDetailCard";

const details = [
  {
    title: "SEO",
    description:
      "We optimize your website to rank higher on search engines, driving organic traffic and ensuring your audience finds you easily.",
  },
  {
    title: "Paid Marketing",
    description:
      "We target the right audiences through platforms like Facebook, Google, Instagram, TikTok, and YouTube. We maximize your reach and turn clicks into customers.",
  },
  {
    title: "AI Adoption",
    description:
      "We leverage AI to simplify complex operations and enhance efficiency. Plus, we'll guide your team to harness its full potential for lasting impact.",
  },
  {
    title: "Automations",
    description:
      "We save your team time and money by automating repetitive tasks, freeing you up to focus on the work that actually moves the needle.",
  },
  {
    title: "Development",
    description:
      "We build advanced, production-grade features tailored to your industry — fast, reliable, and architected to scale with your business.",
  },
  {
    title: "Design",
    description:
      "We craft custom graphics, illustrations, animations, and 3D models that help your brand stand out and convert visitors into customers.",
  },
];

export function ServiceDetailList() {
  return (
    <div className="flex flex-col gap-4">
      {details.map((detail) => (
        <ServiceDetailCard key={detail.title} {...detail} />
      ))}
    </div>
  );
}

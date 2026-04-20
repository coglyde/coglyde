import { SmallServiceCard } from "./SmallServiceCard";
import { BrainCircuitIcon, CommandIcon, WorkflowIcon } from "./icons";

const cards = [
  {
    title: "AI Integrations",
    description:
      "Transform your business operations with cutting-edge AI solutions tailored to streamline workflows and boost efficiency effortlessly.",
    icon: <BrainCircuitIcon className="h-4 w-4" />,
  },
  {
    title: "Streamlined Automations",
    description:
      "Simplify complex processes with innovative automation systems designed to save time and optimize performance seamlessly.",
    icon: <WorkflowIcon className="h-4 w-4" />,
  },
  {
    title: "Lead Generation",
    description:
      "Unlock potential customers with proven strategies that drive engagement and deliver high-quality leads directly to your business.",
    icon: <CommandIcon className="h-4 w-4" />,
  },
];

export function SecondaryServicesGrid() {
  return (
    <section className="relative z-10 px-6 pt-6 pb-24 sm:pb-32">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <SmallServiceCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

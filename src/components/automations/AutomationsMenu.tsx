import { addOns } from "@/lib/pricing";
import type { AddOnGroup } from "@/lib/pricing/types";
import { AddOnCard } from "../pricing/AddOnCard";

// Display order and copy for each automation category. The menu is the same
// catalog as the pricing page, grouped here for scannability.
const GROUPS: { key: AddOnGroup; label: string; description: string }[] = [
  {
    key: "front-desk",
    label: "Front desk",
    description: "Answer, qualify, and book every caller and visitor.",
  },
  {
    key: "lead-retention",
    label: "Leads & retention",
    description: "Fill the pipeline and keep customers coming back.",
  },
  {
    key: "content",
    label: "Content & social",
    description: "Show up consistently without the weekly grind.",
  },
  {
    key: "intelligence",
    label: "Research & reporting",
    description: "Always know what's working and what to do next.",
  },
];

export function AutomationsMenu() {
  return (
    <section className="relative z-10 px-6 pb-20 sm:px-10 sm:pb-28">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            The full menu
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Pick the automations you need
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Attach any of these to a plan or run them on their own. Billed
            monthly, cancel anytime.
          </p>
        </header>

        <div className="mt-16 flex flex-col gap-14">
          {GROUPS.map((group) => {
            const items = addOns.filter((a) => a.group === group.key);
            if (items.length === 0) return null;
            return (
              <div key={group.key}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-white/[0.08] pb-4">
                  <h3 className="text-lg font-medium text-white">
                    {group.label}
                  </h3>
                  <p className="text-sm text-white/45">{group.description}</p>
                </div>
                <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((addOn) => (
                    <AddOnCard key={addOn.key} addOn={addOn} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

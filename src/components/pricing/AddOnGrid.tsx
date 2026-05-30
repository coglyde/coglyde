import type { AddOn } from "@/lib/pricing";
import { AddOnCard } from "./AddOnCard";

// A titled, left-aligned grid of add-ons. Heading and cards share the same left
// edge as the rest of the panel. Renders nothing when there are no add-ons.
export function AddOnGrid({
  title,
  description,
  addOns,
}: {
  title: string;
  description?: string;
  addOns: AddOn[];
}) {
  if (addOns.length === 0) return null;

  return (
    <div>
      <div className="max-w-2xl">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-white/50">{description}</p>
        ) : null}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {addOns.map((addOn) => (
          <AddOnCard key={addOn.key} addOn={addOn} />
        ))}
      </div>
    </div>
  );
}

import { addOns } from "@/lib/pricing";
import { AddOnGrid } from "../AddOnGrid";

// The full automation menu, shown identically under every pricing category and
// on the website-design page.
export function AddOnsSection() {
  return (
    <AddOnGrid
      title="Automations & add-ons"
      description="Attach any of these to your plan, or run them on their own. Billed monthly, cancel anytime."
      addOns={addOns}
    />
  );
}

import { addOns } from "@/lib/pricing";
import { AddOnCard } from "../pricing/AddOnCard";

// The full automation menu, the same catalog shown on the pricing page. Each
// card subscribes directly, so the page doubles as a storefront.
export function AutomationsMenu() {
  return (
    <section className="relative z-10 px-6 pb-20 sm:px-10 sm:pb-28">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            The menu
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Pick your automations
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Attach any of these to a plan or run them on their own. Billed
            monthly, cancel anytime.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {addOns.map((addOn) => (
            <AddOnCard key={addOn.key} addOn={addOn} />
          ))}
        </div>
      </div>
    </section>
  );
}

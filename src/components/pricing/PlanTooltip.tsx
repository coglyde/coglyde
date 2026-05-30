// A small info affordance with a hover/focus popover, used to explain a plan
// (e.g. what "maintenance" covers). CSS-only so it needs no client JS.
export function PlanTooltip({ text }: { text: string }) {
  return (
    <span className="group/tt relative inline-flex">
      <span
        tabIndex={0}
        role="button"
        aria-label="More about this plan"
        className="grid h-4 w-4 cursor-help place-items-center rounded-full border border-white/30 text-[0.6rem] font-semibold text-white/60 transition-colors hover:border-white/60 hover:text-white focus:outline-none focus-visible:border-white/60"
      >
        i
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-7 z-30 w-64 -translate-x-1/2 rounded-xl border border-white/15 bg-black/90 p-3 text-left text-xs font-normal leading-relaxed text-white/70 opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

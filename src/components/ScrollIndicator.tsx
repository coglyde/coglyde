export function ScrollIndicator() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 text-white/80">
      <span aria-hidden className="animate-bounce text-lg">
        ⌄
      </span>
      <span className="text-xs tracking-[0.5em]">SCROLL</span>
      <span className="h-px w-10 bg-white/60" />
    </div>
  );
}
